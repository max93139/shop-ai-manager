import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log('Worker service initialized.');
  console.log('Listening for background queues (AI tasks, Telegram publishing, notifications)...');
}

bootstrap();
