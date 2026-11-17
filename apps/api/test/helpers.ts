import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { prisma } from '@shop-ai/database';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

/** Empties every table; the admin is re-seeded from env when the app starts. */
export async function resetDatabase() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE order_items, orders, product_variants, products, categories, notifications, store_settings, sessions, users CASCADE',
  );
}

export async function createApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = configureApp(moduleRef.createNestApplication());
  await app.init();
  return app;
}

export async function loginAsAdmin(app: INestApplication): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
    .expect(200);
  return res.body.access_token;
}

/** Same steps as the bot checkout: reserve stock atomically, then store the order with item snapshots. */
export async function placeOrder(variantId: string, quantity: number, overrides: Record<string, unknown> = {}) {
  const user = await prisma.user.create({ data: { name: 'Buyer', telegramId: BigInt(Date.now()) } });
  return prisma.$transaction(async (tx) => {
    const reserved = await tx.productVariant.updateMany({
      where: { id: variantId, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });
    if (reserved.count === 0) throw new Error('insufficient stock');
    const variant = await tx.productVariant.findUniqueOrThrow({ where: { id: variantId }, include: { product: true } });
    return tx.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        totalAmount: Number(variant.price) * quantity,
        fullName: 'Шевченко Тарас',
        phone: '+380671234567',
        items: {
          create: [
            {
              variantId,
              productName: variant.product.name,
              sku: variant.sku,
              size: variant.size,
              color: variant.color,
              quantity,
              price: variant.price,
            },
          ],
        },
        ...overrides,
      },
    });
  });
}

export const stockOf = async (variantId: string) =>
  (await prisma.productVariant.findUniqueOrThrow({ where: { id: variantId } })).stock;
