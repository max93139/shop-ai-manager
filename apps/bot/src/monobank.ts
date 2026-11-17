const API_URL = 'https://api.monobank.ua/api/merchant';

export interface PaymentLink {
  invoiceId: string;
  pageUrl: string;
}

/**
 * Creates a Monobank invoice for an order. Returns null when acquiring is not configured or Monobank
 * refuses, so checkout still completes and the customer can pay on delivery.
 */
export async function createMonobankInvoice(params: {
  orderId: string;
  orderNumber: string;
  total: number;
  redirectUrl?: string;
}): Promise<PaymentLink | null> {
  // Read at call time: this module is imported before index.ts runs dotenv.config().
  const token = process.env.MONOBANK_TOKEN?.trim();
  if (!token) return null;

  const publicApiUrl = process.env.API_PUBLIC_URL?.trim().replace(/\/$/, '');
  const body = {
    amount: Math.round(params.total * 100),
    ccy: 980,
    merchantPaymInfo: {
      reference: params.orderId,
      destination: `Оплата замовлення ${params.orderNumber}`,
    },
    validity: 24 * 60 * 60,
    ...(params.redirectUrl ? { redirectUrl: params.redirectUrl } : {}),
    ...(publicApiUrl ? { webHookUrl: `${publicApiUrl}/payments/monobank/webhook` } : {}),
  };

  try {
    const res = await fetch(`${API_URL}/invoice/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Token': token },
      body: JSON.stringify(body),
    });
    const json: any = await res.json().catch(() => null);
    if (!res.ok || !json?.invoiceId || !json?.pageUrl) {
      console.error('Monobank invoice was not created:', json?.errText || `HTTP ${res.status}`);
      return null;
    }
    return { invoiceId: json.invoiceId, pageUrl: json.pageUrl };
  } catch (err) {
    console.error('Monobank invoice request failed:', err);
    return null;
  }
}
