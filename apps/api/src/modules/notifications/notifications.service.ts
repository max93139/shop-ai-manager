import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma, OrderStatus, type Notification, type Prisma } from '@shop-ai/database';
import type { NotificationsResponse, StoreNotification } from '@shop-ai/types';

const CUSTOMER_STATUS_TEXT: Partial<Record<OrderStatus, (orderNumber: string, ttn?: string | null) => string>> = {
  [OrderStatus.PAID]: (n) => `✅ Оплату замовлення ${n} отримано. Дякуємо!`,
  [OrderStatus.PROCESSING]: (n) => `📦 Замовлення ${n} комплектується.`,
  [OrderStatus.SHIPPED]: (n, ttn) =>
    ttn
      ? `🚚 Замовлення ${n} відправлено Новою Поштою.\nТТН: ${ttn}\nВідстежити: https://tracking.novaposhta.ua/#/uk/cargo/${ttn}`
      : `🚚 Замовлення ${n} відправлено.`,
  [OrderStatus.DELIVERED]: (n) => `🎉 Замовлення ${n} отримано. Дякуємо за покупку!`,
  [OrderStatus.CANCELLED]: (n) => `❌ Замовлення ${n} скасовано. Якщо це помилка, напишіть нам.`,
};

/** Maps a stored row to the shared type, reading the JSON payload field by field. */
function toStoreNotification(row: Notification): StoreNotification {
  const base = {
    id: row.id,
    read: row.read,
    orderId: row.orderId ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
  const data = (row.data ?? {}) as Prisma.JsonObject;

  if (row.kind === 'NEW_ORDER') {
    return {
      ...base,
      kind: row.kind,
      data: {
        orderNumber: String(data.orderNumber ?? ''),
        customerName: String(data.customerName ?? ''),
        total: Number(data.total ?? 0),
        itemsCount: Number(data.itemsCount ?? 0),
        city: data.city ? String(data.city) : undefined,
      },
    };
  }

  return {
    ...base,
    kind: row.kind,
    data: {
      variantId: String(data.variantId ?? ''),
      productName: String(data.productName ?? ''),
      size: String(data.size ?? ''),
      color: String(data.color ?? ''),
      stock: Number(data.stock ?? 0),
    },
  };
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async list(): Promise<NotificationsResponse> {
    const [rows, unreadCount] = await Promise.all([
      prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.notification.count({ where: { read: false } }),
    ]);

    const notifications = rows.map(toStoreNotification);

    return { notifications, unreadCount };
  }

  async markRead(id: string) {
    const result = await prisma.notification.updateMany({ where: { id }, data: { read: true } });
    if (result.count === 0) {
      throw new NotFoundException('Notification not found');
    }
    return { success: true };
  }

  async markAllRead() {
    const result = await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
    return { success: true, updated: result.count };
  }

  async remove(id: string) {
    const result = await prisma.notification.deleteMany({ where: { id } });
    if (result.count === 0) {
      throw new NotFoundException('Notification not found');
    }
    return { success: true };
  }

  async clearRead() {
    const result = await prisma.notification.deleteMany({ where: { read: true } });
    return { success: true, deleted: result.count };
  }

  /**
   * Tells the customer in Telegram that their order moved to `status`.
   * Best effort: a missing token, a customer without Telegram or an API error is only logged.
   */
  async notifyCustomerAboutStatus(orderId: string, status: OrderStatus) {
    const format = CUSTOMER_STATUS_TEXT[status];
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    if (!format || !token) return;

    try {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
      const chatId = order?.user?.telegramId;
      if (!order || !chatId) return;

      const text = format(`#${order.id.slice(0, 8).toUpperCase()}`, order.ttn);
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId.toString(), text }),
      });
      if (!res.ok) {
        this.logger.warn(`Telegram refused the status message for order ${orderId}: HTTP ${res.status}`);
      }
    } catch (err: any) {
      this.logger.error(`Failed to notify the customer about order ${orderId}: ${err.message}`);
    }
  }
}
