import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { prisma } from '@shop-ai/database';
import { createApp, loginAsAdmin, placeOrder, resetDatabase, stockOf } from './helpers';

describe('orders', () => {
  let app: INestApplication;
  let auth: { Authorization: string };
  let variantId: string;

  beforeAll(async () => {
    await resetDatabase();
    app = await createApp();
    auth = { Authorization: `Bearer ${await loginAsAdmin(app)}` };
    const { body } = await request(app.getHttpServer())
      .post('/products')
      .set(auth)
      .send({ name: 'Пальто', category: 'Одяг', price: 1000, inStock: 3 })
      .expect(201);
    variantId = body.variants[0].id;
  });
  afterAll(() => app.close());

  const setStatus = (id: string, status: string) =>
    request(app.getHttpServer()).patch(`/orders/${id}/status`).set(auth).send({ status });

  it('never oversells under concurrent checkouts', async () => {
    const results = await Promise.allSettled([placeOrder(variantId, 2), placeOrder(variantId, 2), placeOrder(variantId, 2)]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(await stockOf(variantId)).toBe(1);
  });

  it('enforces status transitions and restores stock on cancel', async () => {
    await prisma.productVariant.update({ where: { id: variantId }, data: { stock: 5 } });
    const order = await placeOrder(variantId, 2);

    await setStatus(order.id, 'FOO').expect(400);
    await setStatus(order.id, 'PAID').expect(200);
    await setStatus(order.id, 'PAID').expect(200);
    await setStatus(order.id, 'PENDING').expect(400);

    await setStatus(order.id, 'CANCELLED').expect(200);
    expect(await stockOf(variantId)).toBe(5);

    await prisma.productVariant.update({ where: { id: variantId }, data: { stock: 0 } });
    await setStatus(order.id, 'PENDING').expect(400);
    expect(await stockOf(variantId)).toBe(0);

    await prisma.productVariant.update({ where: { id: variantId }, data: { stock: 4 } });
    await setStatus(order.id, 'PENDING').expect(200);
    expect(await stockOf(variantId)).toBe(2);

    await setStatus(order.id, 'SHIPPED').expect(200);
    await setStatus(order.id, 'DELIVERED').expect(200);
    await setStatus(order.id, 'CANCELLED').expect(400);
  });

  it('refuses a TTN for a cancelled order', async () => {
    await prisma.productVariant.update({ where: { id: variantId }, data: { stock: 5 } });
    const order = await placeOrder(variantId, 1);
    await setStatus(order.id, 'CANCELLED').expect(200);
    await request(app.getHttpServer()).post(`/nova-poshta/orders/${order.id}/create-ttn`).set(auth).send({}).expect(400);
  });

  it('keeps order items readable after the product is deleted', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/products')
      .set(auth)
      .send({ name: 'Шапка', category: 'Аксесуари', price: 250, inStock: 2 })
      .expect(201);
    const order = await placeOrder(body.variants[0].id, 1);

    await request(app.getHttpServer()).delete(`/products/variants/${body.variants[0].id}`).set(auth).expect(200);

    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
    expect(items).toHaveLength(1);
    expect(items[0].variantId).toBeNull();

    const list = await request(app.getHttpServer()).get('/orders?search=Шапка').set(auth).expect(200);
    const listed = list.body.orders.find((o: { id: string }) => o.id === order.id);
    expect(listed.items[0].productName).toBe('Шапка');
  });

  it('reports real dashboard numbers', async () => {
    const res = await request(app.getHttpServer()).get('/orders/stats').set(auth).expect(200);
    expect(res.body.latestOrders[0].orderNumber).toMatch(/^#[0-9A-F]{8}$/);
    // Nothing was ordered yesterday, so there is no delta rather than a made-up 0%.
    expect(res.body.stats.orders.change).toBe('');
  });
});
