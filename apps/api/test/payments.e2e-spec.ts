import { INestApplication } from '@nestjs/common';
import { createSign, generateKeyPairSync } from 'crypto';
import request from 'supertest';
import { prisma } from '@shop-ai/database';
import { createApp, loginAsAdmin, placeOrder, resetDatabase } from './helpers';

describe('Monobank payments', () => {
  let app: INestApplication;
  let auth: { Authorization: string };
  let variantId: string;
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  let invoiceReply: Record<string, unknown> = {};

  const sign = (body: string) => createSign('SHA256').update(body).sign(privateKey).toString('base64');
  const webhook = (body: string, signature?: string) => {
    const req = request(app.getHttpServer()).post('/payments/monobank/webhook').set('Content-Type', 'application/json');
    return (signature ? req.set('X-Sign', signature) : req).send(body);
  };

  beforeAll(async () => {
    process.env.MONOBANK_TOKEN = 'test-token';
    process.env.MONOBANK_PUBLIC_KEY = Buffer.from(publicKey.export({ type: 'spki', format: 'pem' })).toString('base64');
    globalThis.fetch = (async (input: unknown) => {
      if (String(input).startsWith('https://api.monobank.ua/')) {
        return new Response(JSON.stringify(invoiceReply), { status: 200 });
      }
      throw new Error(`Unexpected outbound request: ${String(input)}`);
    }) as typeof fetch;

    await resetDatabase();
    app = await createApp();
    auth = { Authorization: `Bearer ${await loginAsAdmin(app)}` };
    const { body } = await request(app.getHttpServer())
      .post('/products')
      .set(auth)
      .send({ name: 'Пальто', category: 'Одяг', price: 1250.5, inStock: 10 })
      .expect(201);
    variantId = body.variants[0].id;
  });
  afterAll(() => app.close());

  it('rejects unsigned, badly signed and tampered webhooks', async () => {
    const body = JSON.stringify({ invoiceId: 'unknown', status: 'success' });
    await webhook(body).expect(401);
    await webhook(body, 'AAAA').expect(401);
    await webhook(body.replace('success', 'failure'), sign(body)).expect(401);
    await webhook(body, sign(body)).expect(200);
  });

  it('marks the order paid only for a successful invoice with the exact amount', async () => {
    const order = await placeOrder(variantId, 1, { paymentInvoiceId: 'inv-1' });
    const body = JSON.stringify({ invoiceId: 'inv-1', status: 'success' });

    invoiceReply = { invoiceId: 'inv-1', status: 'processing', amount: 125050, ccy: 980 };
    await webhook(body, sign(body)).expect(200);
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('PENDING');

    invoiceReply = { invoiceId: 'inv-1', status: 'success', amount: 100, ccy: 980 };
    await webhook(body, sign(body)).expect(200);
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('PENDING');

    invoiceReply = { invoiceId: 'inv-1', status: 'success', amount: 125050, ccy: 980 };
    await webhook(body, sign(body)).expect(200);
    const paid = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(paid.status).toBe('PAID');
    expect(paid.paidAt).not.toBeNull();

    await prisma.order.update({ where: { id: order.id }, data: { status: 'SHIPPED' } });
    invoiceReply = { invoiceId: 'inv-1', status: 'processing', amount: 125050, ccy: 980 };
    await webhook(body, sign(body)).expect(200);
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('SHIPPED');
  });

  it('lets the admin re-check a payment', async () => {
    const order = await placeOrder(variantId, 1, { paymentInvoiceId: 'inv-2' });
    invoiceReply = { invoiceId: 'inv-2', status: 'success', amount: 125050, ccy: 980 };
    const res = await request(app.getHttpServer()).post(`/payments/orders/${order.id}/sync`).set(auth).expect(201);
    expect(res.body.orderStatus).toBe('PAID');
    await request(app.getHttpServer()).post('/payments/orders/x/sync').expect(401);
  });
});
