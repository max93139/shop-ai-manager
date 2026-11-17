import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma, OrderStatus } from '@shop-ai/database';
import {
  NovaPoshtaSettlement,
  NovaPoshtaWarehouse,
  NovaPoshtaTrackingStatus,
} from '@shop-ai/types';

@Injectable()
export class NovaPoshtaService {
  private readonly logger = new Logger(NovaPoshtaService.name);
  private readonly apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

  private async callNpApi<T = any>(modelName: string, calledMethod: string, methodProperties: Record<string, any>): Promise<T[]> {
    const apiKey = process.env.NOVA_POSHTA_API_KEY;
    if (!apiKey) {
      this.logger.error('NOVA_POSHTA_API_KEY is not configured');
      return [];
    }
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          modelName,
          calledMethod,
          methodProperties,
        }),
      });

      if (!response.ok) {
        throw new Error(`Nova Poshta HTTP error: ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson.success) {
        this.logger.warn(`Nova Poshta API warning: ${JSON.stringify(resJson.errors || resJson.warnings)}`);
        return [];
      }

      return resJson.data || [];
    } catch (err: any) {
      this.logger.error(`Nova Poshta request failed for ${modelName}.${calledMethod}: ${err.message}`);
      return [];
    }
  }

  async searchSettlements(cityName: string, limit = 10): Promise<NovaPoshtaSettlement[]> {
    const rawData = await this.callNpApi('Address', 'searchSettlements', {
      CityName: cityName.trim(),
      Limit: String(limit),
      Page: '1',
    });

    if (!rawData.length || !rawData[0].Addresses) {
      return [];
    }

    return rawData[0].Addresses.map((addr: any) => ({
      ref: addr.Ref,
      present: addr.Present,
      mainDescription: addr.MainDescription,
      area: addr.Area,
      region: addr.Region || '',
      deliveryCityRef: addr.DeliveryCity,
    }));
  }

  async getWarehouses(cityRefOrName: string, searchOrNumber?: string, limit = 50): Promise<NovaPoshtaWarehouse[]> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cityRefOrName.trim());
    
    const methodProperties: Record<string, any> = {
      Limit: String(limit),
      Page: '1',
    };

    if (isUuid) {
      methodProperties.CityRef = cityRefOrName.trim();
    } else {
      methodProperties.CityName = cityRefOrName.trim();
    }

    if (searchOrNumber?.trim()) {
      methodProperties.FindByString = searchOrNumber.trim();
    }

    const rawData = await this.callNpApi('AddressGeneral', 'getWarehouses', methodProperties);

    return rawData.map((wh: any) => ({
      ref: wh.Ref,
      siteKey: wh.SiteKey,
      description: wh.Description,
      shortAddress: wh.ShortAddress,
      number: String(wh.Number),
      typeOfWarehouse: wh.TypeOfWarehouse,
    }));
  }

  async trackDocument(documentNumber: string): Promise<NovaPoshtaTrackingStatus | null> {
    const cleanNumber = documentNumber.replace(/\D/g, '');
    const rawData = await this.callNpApi('TrackingDocument', 'getStatusDocuments', {
      Documents: [{ DocumentNumber: cleanNumber, Phone: '' }],
    });

    if (!rawData.length) {
      return null;
    }

    const doc = rawData[0];
    return {
      number: doc.Number,
      status: doc.Status,
      statusCode: doc.StatusCode,
      statusDescription: doc.StatusDescription || doc.Status,
      citySender: doc.CitySender,
      cityRecipient: doc.CityRecipient,
      warehouseRecipient: doc.WarehouseRecipient,
      recipientFullName: doc.RecipientFullName,
      actualDeliveryDate: doc.ActualDeliveryDate,
      documentCost: doc.DocumentCost,
    };
  }

  /** Attaching a TTN ships an open order, keeps DELIVERED as is and is refused for a cancelled one. */
  private statusAfterTtn(current: OrderStatus): OrderStatus {
    if (current === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot attach a TTN to a cancelled order');
    }
    return current === OrderStatus.DELIVERED ? current : OrderStatus.SHIPPED;
  }

  async updateOrderTtn(orderId: string, ttn: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const cleanTtn = ttn.trim();
    const trackingInfo = await this.trackDocument(cleanTtn);

    return prisma.order.update({
      where: { id: orderId },
      data: {
        ttn: cleanTtn,
        status: this.statusAfterTtn(order.status),
      },
    });
  }

  async createTtnForOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.ttn) {
      return {
        success: true,
        ttn: order.ttn,
        alreadyExisted: true,
      };
    }

    const generatedTtn = `2045${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ttn: generatedTtn,
        status: this.statusAfterTtn(order.status),
      },
    });

    return {
      success: true,
      ttn: generatedTtn,
      order: updated,
    };
  }
}
