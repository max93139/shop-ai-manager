import { Injectable, Logger, BadRequestException } from '@nestjs/common';

export interface BroadcastPostDto {
  text: string;
  imageUrl?: string;
  photoBase64?: string;
  photosBase64?: string[];
  channelId?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  async broadcastToChannel(dto: BroadcastPostDto, file?: Express.Multer.File) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    let channelId = (dto.channelId || process.env.TELEGRAM_CHANNEL_ID || '').trim();

    if (!botToken) {
      return { success: false, message: 'TELEGRAM_BOT_TOKEN is not configured' };
    }
    if (!channelId) {
      return { success: false, message: 'TELEGRAM_CHANNEL_ID is not configured' };
    }
    if (!channelId.startsWith('@') && !channelId.startsWith('-')) {
      channelId = `@${channelId}`;
    }

    const cleanText = dto.text.trim();
    if (!cleanText) {
      throw new BadRequestException('Message text is required');
    }

    try {
      const photoFiles: File[] = [];

      const processBase64 = (rawImg: string, index: number) => {
        if (rawImg && rawImg.startsWith('data:image')) {
          const matches = rawImg.match(/^data:(image\/\w+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            photoFiles.push(new File([new Uint8Array(buffer)], `photo${index}.jpg`, { type: mimeType }));
          }
        }
      };

      if (dto.photosBase64 && dto.photosBase64.length > 0) {
        dto.photosBase64.slice(0, 10).forEach((b64, idx) => processBase64(b64, idx));
      } else if (dto.photoBase64) {
        processBase64(dto.photoBase64, 0);
      } else if (file && file.buffer) {
        photoFiles.push(new File([new Uint8Array(file.buffer)], file.originalname || 'photo.jpg', {
          type: file.mimetype || 'image/jpeg',
        }));
      }

      if (photoFiles.length > 1) {
        const formData = new FormData();
        formData.append('chat_id', channelId);
        
        const mediaGroup = photoFiles.map((pf, idx) => {
          formData.append(`photo${idx}`, pf);
          return {
            type: 'photo',
            media: `attach://photo${idx}`,
            caption: idx === 0 ? cleanText : undefined,
          };
        });
        
        formData.append('media', JSON.stringify(mediaGroup));

        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          this.logger.error(`Telegram sendMediaGroup failed: ${JSON.stringify(data)}`);
          return { success: false, message: data.description || 'Failed to send media group' };
        }
        return { success: true, messageId: data.result?.[0]?.message_id };
      } else if (photoFiles.length === 1) {
        const formData = new FormData();
        formData.append('chat_id', channelId);
        formData.append('caption', cleanText);
        formData.append('photo', photoFiles[0]);

        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          this.logger.error(`Telegram sendPhoto failed: ${JSON.stringify(data)}`);
          return { success: false, message: data.description || 'Failed to send photo file' };
        }
        return { success: true, messageId: data.result?.message_id };
      } else if (dto.imageUrl && (dto.imageUrl.startsWith('http://') || dto.imageUrl.startsWith('https://'))) {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: channelId, photo: dto.imageUrl, caption: cleanText }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          this.logger.error(`Telegram sendPhoto URL failed: ${JSON.stringify(data)}`);
          return { success: false, message: data.description || 'Failed to send photo URL' };
        }
        return { success: true, messageId: data.result?.message_id };
      } else {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: channelId, text: cleanText }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          this.logger.error(`Telegram sendMessage failed: ${JSON.stringify(data)}`);
          return { success: false, message: data.description || 'Failed to send message' };
        }
        return { success: true, messageId: data.result?.message_id };
      }
    } catch (err: any) {
      this.logger.error(`Error broadcasting to Telegram: ${err.message}`);
      return { success: false, message: err.message || 'Telegram broadcast network error' };
    }
  }
}
