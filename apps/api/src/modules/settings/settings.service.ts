import { Injectable } from '@nestjs/common';
import { getStoreSettings, prisma } from '@shop-ai/database';
import type { StoreSettingsResponse } from '@shop-ai/types';
import type { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  async get(): Promise<StoreSettingsResponse> {
    const row = await getStoreSettings();
    return {
      storeName: row.storeName,
      supportPhone: row.supportPhone,
      supportEmail: row.supportEmail,
      managerChatId: row.managerChatId,
      lowStockThreshold: row.lowStockThreshold,
      botTokenConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim()),
      telegramChannel: process.env.TELEGRAM_CHANNEL_ID?.trim() || null,
      managerChatFromEnv: Boolean(process.env.TELEGRAM_MANAGER_CHAT_ID?.trim()),
      monobankConfigured: Boolean(process.env.MONOBANK_TOKEN?.trim()),
      novaPoshtaSenderConfigured: Boolean(process.env.NOVA_POSHTA_SENDER_WAREHOUSE_REF?.trim()),
    };
  }

  async update(dto: UpdateSettingsDto): Promise<StoreSettingsResponse> {
    const data = {
      ...(dto.storeName !== undefined ? { storeName: dto.storeName.trim() } : {}),
      ...(dto.supportPhone !== undefined ? { supportPhone: dto.supportPhone.trim() } : {}),
      ...(dto.supportEmail !== undefined ? { supportEmail: dto.supportEmail.trim() } : {}),
      ...(dto.managerChatId !== undefined ? { managerChatId: dto.managerChatId.trim() } : {}),
      ...(dto.lowStockThreshold !== undefined ? { lowStockThreshold: dto.lowStockThreshold } : {}),
    };
    await prisma.storeSettings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
    return this.get();
  }
}
