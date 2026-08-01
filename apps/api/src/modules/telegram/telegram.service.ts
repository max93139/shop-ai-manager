import { Injectable, Logger, BadRequestException } from '@nestjs/common';

export interface BroadcastPostDto {
  text: string;
  imageUrl?: string;
  photoBase64?: string;
  channelId?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  async broadcastToChannel(dto: BroadcastPostDto, file?: Express.Multer.File) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    let channelId = (dto.channelId || process.env.TELEGRAM_CHANNEL_ID || '').trim();

    if (!botToken) {
      return {
        success: false,
        message: 'TELEGRAM_BOT_TOKEN is not configured in .env',
      };
    }

    if (!channelId) {
      return {
        success: false,
        message: 'TELEGRAM_CHANNEL_ID is not configured in .env',
      };
    }

    if (!channelId.startsWith('@') && !channelId.startsWith('-')) {
      channelId = `@${channelId}`;
    }

    const cleanText = dto.text.trim();
    if (!cleanText) {
      throw new BadRequestException('Message text is required');
    }

    try {
      // 1. Check if binary file is uploaded directly or sent via base64
      let photoFile: File | null = null;

      if (file && file.buffer) {
        photoFile = new File([new Uint8Array(file.buffer)], file.originalname || 'photo.jpg', {
          type: file.mimetype || 'image/jpeg',
        });
      } else {
        const rawImg = dto.photoBase64 || dto.imageUrl;
        if (rawImg && rawImg.startsWith('data:image')) {
          const matches = rawImg.match(/^data:(image\/\w+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            photoFile = new File([new Uint8Array(buffer)], 'photo.jpg', { type: mimeType });
          }
        }
      }

      if (photoFile) {
        // Send Photo file via multipart/form-data to Telegram Bot API
        const formData = new FormData();
        formData.append('chat_id', channelId);
        formData.append('caption', cleanText);
        formData.append('photo', photoFile);

        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          this.logger.error(`Telegram sendPhoto file upload failed for ${channelId}: ${JSON.stringify(data)}`);
          return {
            success: false,
            message: data.description || 'Failed to send photo file to Telegram channel',
          };
        }

        return { success: true, messageId: data.result?.message_id };
      } else if (
        dto.imageUrl &&
        (dto.imageUrl.startsWith('https://') ||
          (dto.imageUrl.startsWith('http://') &&
            !dto.imageUrl.includes('localhost') &&
            !dto.imageUrl.includes('127.0.0.1')))
      ) {
        // Send Photo via public HTTPS URL
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
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
          this.logger.error(`Telegram sendPhoto URL failed: ${JSON.stringify(data)}`);
          return {
            success: false,
            message: data.description || 'Failed to send photo URL to Telegram channel',
          };
        }

        return { success: true, messageId: data.result?.message_id };
      } else {
        // Send Text Message
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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
          return {
            success: false,
            message: data.description || 'Failed to send message to Telegram channel',
          };
        }

        return { success: true, messageId: data.result?.message_id };
      }
    } catch (err: any) {
      this.logger.error(`Error broadcasting to Telegram: ${err.message}`);
      return {
        success: false,
        message: err.message || 'Telegram broadcast network error',
      };
    }
  }
}
