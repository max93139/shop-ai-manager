import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import type { RawBodyRequest } from './modules/payments/raw-body';

// Load env files from local and root workspace
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API running on port ${port}`);
}

bootstrap();
