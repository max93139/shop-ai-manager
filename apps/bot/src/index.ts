import { Bot } from 'grammy';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const botId = process.env.TELEGRAM_BOT_ID || '';

if (!token) {
  console.warn('Warning: TELEGRAM_BOT_TOKEN is not set in .env file');
}

const bot = new Bot(token);

bot.command('start', (ctx) => ctx.reply('Bot started!'));

if (token) {
  bot.start();
}

