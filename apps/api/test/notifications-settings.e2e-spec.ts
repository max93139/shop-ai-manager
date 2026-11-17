import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { prisma } from '@shop-ai/database';
import { createApp, loginAsAdmin, resetDatabase } from './helpers';

describe('notifications and settings', () => {
  let app: INestApplication;
  let auth: { Authorization: string };

  beforeAll(async () => {
    await resetDatabase();
    app = await createApp();
    auth = { Authorization: `Bearer ${await loginAsAdmin(app)}` };
  });
  afterAll(() => app.close());

  it('lists, reads and clears notifications', async () => {
    await prisma.notification.createMany({
      data: [
        { kind: 'NEW_ORDER', data: { orderNumber: '#A', customerName: 'Тарас', total: 900, itemsCount: 1 } },
        { kind: 'LOW_STOCK', data: { variantId: 'v', productName: 'Пальто', size: 'M', color: 'Black', stock: 2 } },
      ],
    });
    const server = app.getHttpServer();

    const list = await request(server).get('/notifications').set(auth).expect(200);
    expect(list.body.unreadCount).toBe(2);
    expect(list.body.notifications.find((n: { kind: string }) => n.kind === 'NEW_ORDER').data.total).toBe(900);

    const [first] = list.body.notifications;
    await request(server).patch(`/notifications/${first.id}/read`).set(auth).expect(200);
    await request(server).patch('/notifications/00000000-0000-0000-0000-000000000000/read').set(auth).expect(404);
    await request(server).delete('/notifications/read').set(auth).expect(200);
    expect(await prisma.notification.count()).toBe(1);
    await request(server).patch('/notifications/read-all').set(auth).expect(200);
    expect(await prisma.notification.count({ where: { read: false } })).toBe(0);
  });

  it('saves validated settings and reports environment-only state', async () => {
    const server = app.getHttpServer();
    const initial = await request(server).get('/settings').set(auth).expect(200);
    expect(initial.body).toMatchObject({ lowStockThreshold: 5, botTokenConfigured: false, monobankConfigured: false });

    await request(server).put('/settings').set(auth).send({ supportEmail: 'not-an-email' }).expect(400);
    await request(server).put('/settings').set(auth).send({ managerChatId: 'abc' }).expect(400);
    await request(server).put('/settings').set(auth).send({ telegramChannel: '@x' }).expect(400);

    const saved = await request(server)
      .put('/settings')
      .set(auth)
      .send({ storeName: '  Ательє  ', supportEmail: 'my_shop@example.com', managerChatId: '-1001234567890' })
      .expect(200);
    expect(saved.body).toMatchObject({ storeName: 'Ательє', supportEmail: 'my_shop@example.com' });

    const stats = await request(server).get('/orders/stats').set(auth).expect(200);
    expect(stats.body.storeName).toBe('Ательє');
  });
});
