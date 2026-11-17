import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import type { RawBodyRequest } from './modules/payments/raw-body';

/** Middleware, validation and CORS shared by the server entry point and the e2e tests. */
export function configureApp(app: INestApplication) {
  app.use(
    json({
      limit: '50mb',
      // Payment webhooks are signed over the exact bytes received.
      verify: (req, _res, buf) => {
        (req as RawBodyRequest).rawBody = buf;
      },
    }),
  );
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
      process.env.ADMIN_URL || '',
    ].filter(Boolean),
    credentials: true,
  });
  return app;
}
