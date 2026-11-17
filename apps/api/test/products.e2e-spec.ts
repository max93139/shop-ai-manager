import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { prisma } from '@shop-ai/database';
import { createApp, loginAsAdmin, resetDatabase } from './helpers';

describe('products', () => {
  let app: INestApplication;
  let auth: { Authorization: string };

  beforeAll(async () => {
    await resetDatabase();
    app = await createApp();
    auth = { Authorization: `Bearer ${await loginAsAdmin(app)}` };
  });
  afterAll(() => app.close());

  const create = (body: Record<string, unknown>) =>
    request(app.getHttpServer()).post('/products').set(auth).send(body);

  it('creates every selected size, including sold-out ones, and stores the brand in its column', async () => {
    const res = await create({
      name: 'Пальто',
      category: 'Одяг',
      brand: 'Atelier',
      price: '1500',
      selectedSizes: ['M', 'L'],
      selectedColors: ['Black'],
      variantStocks: { 'Black:::M': 3, 'Black:::L': 0 },
    }).expect(201);
    expect(res.body.brand).toBe('Atelier');
    expect(res.body.variants.map((v: { size: string; stock: number }) => `${v.size}:${v.stock}`).sort()).toEqual([
      'L:0',
      'M:3',
    ]);
  });

  it('rejects invalid input without leaving a product behind', async () => {
    await create({ name: 'Bad price', category: 'Одяг', price: -50 }).expect(400);
    await create({ name: 'No price', category: 'Одяг' }).expect(400);
    await create({ name: 'Bad stock', category: 'Одяг', price: 100, selectedSizes: ['M'], variantStocks: { M: 'abc' } }).expect(400);
    expect(await prisma.product.count({ where: { name: { in: ['Bad price', 'No price', 'Bad stock'] } } })).toBe(0);
  });

  it('keeps Cyrillic categories apart', async () => {
    const shoes = await create({ name: 'Черевики', category: 'Взуття', price: 900 }).expect(201);
    const scarf = await create({ name: 'Шарф', category: 'Аксесуари', price: 300 }).expect(201);
    expect(shoes.body.categoryId).not.toBe(scarf.body.categoryId);
    const again = await create({ name: 'Кеди', category: 'взуття', price: 700 }).expect(201);
    expect(again.body.categoryId).toBe(shoes.body.categoryId);
  });

  it('edits product fields and validates them', async () => {
    const { body: product } = await create({ name: 'Светр', category: 'Одяг', brand: 'Old', price: 800 }).expect(201);
    const server = app.getHttpServer();

    const edited = await request(server)
      .patch(`/products/${product.id}`)
      .set(auth)
      .send({ name: 'Светр вовняний', brand: 'New', category: 'Трикотаж', images: ['data:image/png;base64,AAAA'] })
      .expect(200);
    expect(edited.body).toMatchObject({ name: 'Светр вовняний', brand: 'New', category: 'Трикотаж' });
    expect(edited.body.images).toHaveLength(1);

    await request(server).patch(`/products/${product.id}`).set(auth).send({ name: '   ' }).expect(400);
    await request(server).patch('/products/00000000-0000-0000-0000-000000000000').set(auth).send({ name: 'x' }).expect(404);

    const filtered = await request(server).get('/products?brand=New').set(auth).expect(200);
    expect(filtered.body.products.every((p: { brand: string }) => p.brand === 'New')).toBe(true);
  });

  it('validates variant updates and applies the low-stock threshold from settings', async () => {
    const { body: product } = await create({ name: 'Футболка', category: 'Одяг', price: 400, inStock: 3 }).expect(201);
    const variantId = product.variants[0].id;
    const server = app.getHttpServer();

    for (const body of [{ stock: 'abc' }, { stock: -1 }, { stock: 1.5 }, { price: 0 }]) {
      await request(server).patch(`/products/variants/${variantId}`).set(auth).send(body).expect(400);
    }

    let row = await request(server).patch(`/products/variants/${variantId}`).set(auth).send({ stock: 3 }).expect(200);
    expect(row.body.status).toBe('low_stock');

    await request(server).put('/settings').set(auth).send({ lowStockThreshold: 2 }).expect(200);
    row = await request(server).patch(`/products/variants/${variantId}`).set(auth).send({ stock: 3 }).expect(200);
    expect(row.body.status).toBe('active');
  });
});
