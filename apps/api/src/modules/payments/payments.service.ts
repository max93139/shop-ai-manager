import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma, OrderStatus } from '@shop-ai/database';
import { OrdersService } from '../orders/orders.service';
import { MonobankClient } from './monobank.client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly monobank: MonobankClient,
    private readonly orders: OrdersService,
  ) {}

  verifyWebhook(rawBody: Buffer, signature: string | undefined) {
    return this.monobank.verifyWebhook(rawBody, signature);
  }

  /**
   * Re-reads the invoice from Monobank and applies it to the order. The webhook body is only a hint:
   * the status is always taken from the API, so out-of-order or replayed webhooks cannot regress an order.
   */
  async syncInvoice(invoiceId: string) {
    const order = await prisma.order.findUnique({ where: { paymentInvoiceId: invoiceId } });
    if (!order) {
      throw new NotFoundException('No order for this invoice');
    }

    const invoice = await this.monobank.getInvoiceStatus(invoiceId);
    const expectedAmount = Math.round(Number(order.totalAmount) * 100);

    if (invoice.status !== 'success') {
      return { orderId: order.id, invoiceStatus: invoice.status, orderStatus: order.status };
    }

    if (invoice.amount !== expectedAmount || invoice.ccy !== 980) {
      this.logger.error(
        `Invoice ${invoiceId} paid ${invoice.amount}/${invoice.ccy}, order ${order.id} expects ${expectedAmount}/980; left unchanged`,
      );
      return { orderId: order.id, invoiceStatus: invoice.status, orderStatus: order.status, amountMismatch: true };
    }

    if (!order.paidAt) {
      await prisma.order.update({ where: { id: order.id }, data: { paidAt: new Date() } });
    }

    if (order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING) {
      await this.orders.updateOrderStatus(order.id, OrderStatus.PAID);
      return { orderId: order.id, invoiceStatus: invoice.status, orderStatus: OrderStatus.PAID };
    }

    if (order.status === OrderStatus.CANCELLED) {
      this.logger.warn(`Order ${order.id} was paid after it had been cancelled; a refund may be needed`);
    }
    return { orderId: order.id, invoiceStatus: invoice.status, orderStatus: order.status };
  }

  async syncOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (!order.paymentInvoiceId) {
      throw new NotFoundException('The order has no online payment');
    }
    return this.syncInvoice(order.paymentInvoiceId);
  }
}
