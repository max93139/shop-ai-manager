import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { prisma } from '@shop-ai/database';
import { createApp, loginAsAdmin, resetDatabase } from './helpers';

describe('auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await resetDatabase();
    app = await createApp();
  });
  afterAll(() => app.close());

  it('rejects a wrong password and protected routes without a token', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: process.env.ADMIN_EMAIL, password: 'wrong-password' })
      .expect(401);
    for (const path of ['/products', '/orders', '/notifications', '/settings']) {
      await request(app.getHttpServer()).get(path).expect(401);
    }
  });

  it('does not overwrite an existing admin password on restart', async () => {
    await prisma.user.update({
      where: { email: process.env.ADMIN_EMAIL },
      data: { password: '$2b$10$abcdefghijklmnopqrstuuJ5V5L9vGZ0n6gC3h4C4bzxkJ4F4W2a' },
    });
    const restarted = await createApp();
    const user = await prisma.user.findUniqueOrThrow({ where: { email: process.env.ADMIN_EMAIL } });
    expect(user.password).toBe('$2b$10$abcdefghijklmnopqrstuuJ5V5L9vGZ0n6gC3h4C4bzxkJ4F4W2a');
    await restarted.close();
    await resetDatabase();
    await app.close();
    app = await createApp();
  });

  it('changes the password, revokes older tokens and keeps the new session', async () => {
    const oldToken = await loginAsAdmin(app);
    const server = app.getHttpServer();

    await request(server)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${oldToken}`)
      .send({ currentPassword: 'nope', newPassword: 'another-password-1' })
      .expect(400);
    await request(server)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${oldToken}`)
      .send({ currentPassword: process.env.ADMIN_PASSWORD, newPassword: 'short' })
      .expect(400);

    // JWT iat has one-second precision; make sure the change happens in a later second.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const changed = await request(server)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${oldToken}`)
      .send({ currentPassword: process.env.ADMIN_PASSWORD, newPassword: 'another-password-1' })
      .expect(200);

    await request(server).get('/auth/me').set('Authorization', `Bearer ${oldToken}`).expect(401);
    await request(server).get('/auth/me').set('Authorization', `Bearer ${changed.body.access_token}`).expect(200);
    await request(server)
      .post('/auth/login')
      .send({ email: process.env.ADMIN_EMAIL, password: 'another-password-1' })
      .expect(200);
  });
});
