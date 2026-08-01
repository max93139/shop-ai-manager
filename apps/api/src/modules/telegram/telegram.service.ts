import { Injectable, Logger, BadRequestException } from '@nestjs/common';

export interface BroadcastPostDto {
  text: string;
  imageUrl?: string;
  channelId?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  async broadcastToChannel(dto: BroadcastPostDto) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = dto.channelId || process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken) {
      this.logger.warn('TELEGRAM_BOT_TOKEN is not configured in .env');
      return {
        success: false,
        message: 'TELEGRAM_BOT_TOKEN is not set in environment variables',
      };
    }

    if (!channelId) {
      this.logger.warn('TELEGRAM_CHANNEL_ID is not configured in .env');
      return {
        success: false,
        message: 'TELEGRAM_CHANNEL_ID is not set in environment variables',
      };
    }

    const cleanText = dto.text.trim();
    if (!cleanText) {
      throw new BadRequestException('Message text is required');
    }

    try {
      if (dto.imageUrl && dto.imageUrl.startsWith('http')) {
        // Send Photo with caption
        const photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        const res = await fetch(photoUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: channelId,
            photo: dto.imageUrl,
            caption: cleanText,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          this.logger.error(`Telegram sendPhoto failed: ${JSON.stringify(data)}`);
          throw new BadRequestException(data.description || 'Failed to send photo to Telegram channel');
        }

        return { success: true, messageId: data.result?.message_id };
      } else {
        // Send Text Message
        const msgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(msgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: channelId,
            text: cleanText,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          this.logger.error(`Telegram sendMessage failed: ${JSON.stringify(data)}`);
          throw new BadRequestException(data.description || 'Failed to send message to Telegram channel');
        }

        return { success: true, messageId: data.result?.message_id };
      }
    } catch (err: any) {
      this.logger.error(`Error broadcasting to Telegram: ${err.message}`);
      throw new BadRequestException(err.message || 'Telegram broadcast failed');
    }
  }
}
