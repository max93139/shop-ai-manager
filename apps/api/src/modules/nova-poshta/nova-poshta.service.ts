import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { prisma, OrderStatus } from '@shop-ai/database';
import {
  NovaPoshtaSettlement,
  NovaPoshtaWarehouse,
  NovaPoshtaTrackingStatus,
} from '@shop-ai/types';

/** Returns the phone as 380XXXXXXXXX, or null if it is not a Ukrainian mobile number. */
function normalizeUaPhone(raw: string | null): string | null {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (/^380\d{9}$/.test(digits)) return digits;
  if (/^0\d{9}$/.test(digits)) return `38${digits}`;
  if (/^\d{9}$/.test(digits)) return `380${digits}`;
  return null;
}

/** Splits "Прізвище Ім'я По батькові" as the bot collects it. */
function splitFullName(raw: string | null) {
  const parts = (raw ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return null;
  return { lastName: parts[0], firstName: parts[1], middleName: parts.slice(2).join(' ') };
}

/** Today's date in Kyiv as dd.mm.yyyy, the format InternetDocument.save expects. */
function kyivDate(): string {
  const parts = new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}.${get('month')}.${get('year')}`;
}

@Injectable()
export class NovaPoshtaService {
  private readonly logger = new Logger(NovaPoshtaService.name);
  private readonly apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
  private readonly ttnInFlight = new Set<string>();
  private senderCache: {
    counterpartyRef: string;
    contactRef: string;
    phone: string;
    cityRef: string;
    warehouseRef: string;
  } | null = null;

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

  async createTtnForOrder(orderId: string, options: { weight?: number } = {}) {
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

    const nextStatus = this.statusAfterTtn(order.status);
    if (!order.deliveryCityRef || !order.deliveryWarehouseRef) {
      throw new BadRequestException('The order has no Nova Poshta city or warehouse selected');
    }
    const phone = normalizeUaPhone(order.phone);
    if (!phone) {
      throw new BadRequestException('The order has no valid Ukrainian phone number');
    }
    const name = splitFullName(order.fullName);
    if (!name) {
      throw new BadRequestException('Recipient full name must contain at least a last and a first name');
    }

    if (this.ttnInFlight.has(orderId)) {
      throw new ConflictException('A TTN is already being created for this order');
    }
    this.ttnInFlight.add(orderId);

    try {
      const sender = await this.getSender();

      const [recipient] = await this.callNpApiStrict<any>('Counterparty', 'save', {
        FirstName: name.firstName,
        MiddleName: name.middleName,
        LastName: name.lastName,
        Phone: phone,
        Email: '',
        CounterpartyType: 'PrivatePerson',
        CounterpartyProperty: 'Recipient',
      });
      const recipientContactRef = recipient?.ContactPerson?.data?.[0]?.Ref;
      if (!recipient?.Ref || !recipientContactRef) {
        throw new BadGatewayException('Nova Poshta did not return the recipient reference');
      }

      const total = Number(order.totalAmount);
      const description =
        order.items
          .map((item) => item.productName ?? item.variant?.product?.name)
          .filter(Boolean)
          .join(', ')
          .slice(0, 100) || 'Товар';
      const weight = options.weight ?? (Number(process.env.NOVA_POSHTA_DEFAULT_WEIGHT) || 1);
      const cashOnDelivery = order.status === OrderStatus.PENDING;

      const [document] = await this.callNpApiStrict<any>('InternetDocument', 'save', {
        PayerType: 'Recipient',
        PaymentMethod: 'Cash',
        DateTime: kyivDate(),
        CargoType: 'Parcel',
        Weight: String(weight),
        ServiceType: 'WarehouseWarehouse',
        SeatsAmount: '1',
        Description: description,
        Cost: String(Math.max(1, Math.round(total))),
        CitySender: sender.cityRef,
        Sender: sender.counterpartyRef,
        SenderAddress: sender.warehouseRef,
        ContactSender: sender.contactRef,
        SendersPhone: sender.phone,
        CityRecipient: order.deliveryCityRef,
        Recipient: recipient.Ref,
        RecipientAddress: order.deliveryWarehouseRef,
        ContactRecipient: recipientContactRef,
        RecipientsPhone: phone,
        ...(cashOnDelivery
          ? {
              BackwardDeliveryData: [
                { PayerType: 'Recipient', CargoType: 'Money', RedeliveryString: String(total) },
              ],
            }
          : {}),
      });

      const ttn = document?.IntDocNumber;
      if (!ttn) {
        throw new BadGatewayException('Nova Poshta did not return a TTN number');
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: { ttn: String(ttn), status: nextStatus },
      });

      return {
        success: true,
        ttn: String(ttn),
        deliveryCost: document.CostOnSite !== undefined ? Number(document.CostOnSite) : undefined,
        estimatedDeliveryDate: document.EstimatedDeliveryDate,
        cashOnDelivery,
        order: updated,
      };
    } finally {
      this.ttnInFlight.delete(orderId);
    }
  }

  /**
   * Sender data for new TTNs: the account's sender counterparty and contact come from the API,
   * the dispatch warehouse from NOVA_POSHTA_SENDER_WAREHOUSE_REF. Cached for the process lifetime.
   */
  private async getSender() {
    if (this.senderCache) {
      return this.senderCache;
    }

    const warehouseRef = process.env.NOVA_POSHTA_SENDER_WAREHOUSE_REF?.trim();
    if (!warehouseRef) {
      throw new BadRequestException(
        'NOVA_POSHTA_SENDER_WAREHOUSE_REF is not configured: set the Ref of the warehouse you ship from',
      );
    }

    const [warehouse] = await this.callNpApiStrict<any>('AddressGeneral', 'getWarehouses', { Ref: warehouseRef });
    if (!warehouse?.CityRef) {
      throw new BadRequestException('NOVA_POSHTA_SENDER_WAREHOUSE_REF does not match a Nova Poshta warehouse');
    }

    const [counterparty] = await this.callNpApiStrict<any>('Counterparty', 'getCounterparties', {
      CounterpartyProperty: 'Sender',
      Page: '1',
    });
    if (!counterparty?.Ref) {
      throw new BadRequestException('The Nova Poshta account has no sender counterparty');
    }

    const [contact] = await this.callNpApiStrict<any>('Counterparty', 'getCounterpartyContactPersons', {
      Ref: counterparty.Ref,
      Page: '1',
    });
    if (!contact?.Ref || !contact.Phones) {
      throw new BadRequestException('The Nova Poshta sender has no contact person with a phone number');
    }

    this.senderCache = {
      counterpartyRef: counterparty.Ref as string,
      contactRef: contact.Ref as string,
      phone: String(contact.Phones).split(',')[0].trim(),
      cityRef: warehouse.CityRef as string,
      warehouseRef,
    };
    return this.senderCache;
  }

  /** Like callNpApi, but surfaces Nova Poshta errors to the caller instead of returning an empty list. */
  private async callNpApiStrict<T = any>(
    modelName: string,
    calledMethod: string,
    methodProperties: Record<string, any>,
  ): Promise<T[]> {
    const apiKey = process.env.NOVA_POSHTA_API_KEY;
    if (!apiKey) {
      throw new BadRequestException('NOVA_POSHTA_API_KEY is not configured');
    }

    let resJson: any;
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, modelName, calledMethod, methodProperties }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      resJson = await response.json();
    } catch (err: any) {
      this.logger.error(`Nova Poshta request failed for ${modelName}.${calledMethod}: ${err.message}`);
      throw new BadGatewayException('Nova Poshta is unavailable, try again later');
    }

    if (!resJson.success) {
      const errors: string[] = resJson.errors?.length ? resJson.errors : ['Unknown error'];
      this.logger.warn(`Nova Poshta ${modelName}.${calledMethod} rejected: ${errors.join('; ')}`);
      throw new BadRequestException(`Nova Poshta: ${errors.join('; ')}`);
    }

    return resJson.data || [];
  }
}
