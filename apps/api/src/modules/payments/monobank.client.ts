import { BadGatewayException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createVerify } from 'crypto';

const API_URL = 'https://api.monobank.ua/api/merchant';

export type MonobankInvoiceStatus =
  | 'created'
  | 'processing'
  | 'hold'
  | 'success'
  | 'failure'
  | 'reversed'
  | 'expired';

export interface MonobankInvoice {
  invoiceId: string;
  status: MonobankInvoiceStatus;
  amount: number;
  ccy: number;
  finalAmount?: number;
  reference?: string;
  failureReason?: string;
  modifiedDate?: string;
}

/** Thin client for Monobank acquiring: invoice status and webhook signature checks. */
@Injectable()
export class MonobankClient {
  private readonly logger = new Logger(MonobankClient.name);
  private publicKeyPem: string | null = null;

  isConfigured(): boolean {
    return Boolean(process.env.MONOBANK_TOKEN?.trim());
  }

  private token(): string {
    const token = process.env.MONOBANK_TOKEN?.trim();
    if (!token) {
      throw new BadRequestException('MONOBANK_TOKEN is not configured');
    }
    return token;
  }

  private async request<T>(path: string): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${API_URL}${path}`, { headers: { 'X-Token': this.token() } });
    } catch (err: any) {
      this.logger.error(`Monobank request ${path} failed: ${err.message}`);
      throw new BadGatewayException('Monobank is unavailable, try again later');
    }
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const reason = body?.errText || body?.errCode || `HTTP ${res.status}`;
      this.logger.warn(`Monobank rejected ${path}: ${reason}`);
      throw new BadRequestException(`Monobank: ${reason}`);
    }
    return body as T;
  }

  getInvoiceStatus(invoiceId: string): Promise<MonobankInvoice> {
    return this.request<MonobankInvoice>(`/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`);
  }

  /** PEM key that signs webhooks; MONOBANK_PUBLIC_KEY (base64 PEM) overrides the fetched one. */
  private async publicKey(forceRefresh = false): Promise<string> {
    const override = process.env.MONOBANK_PUBLIC_KEY?.trim();
    if (override) {
      return Buffer.from(override, 'base64').toString('utf8');
    }
    if (!this.publicKeyPem || forceRefresh) {
      const { key } = await this.request<{ key: string }>('/pubkey');
      this.publicKeyPem = Buffer.from(key, 'base64').toString('utf8');
    }
    return this.publicKeyPem;
  }

  /** Checks the X-Sign header (base64 ECDSA/SHA-256 over the raw body), refetching the key once if it was rotated. */
  async verifyWebhook(rawBody: Buffer, signature: string | undefined): Promise<boolean> {
    if (!signature) return false;
    const check = (pem: string) => {
      try {
        return createVerify('SHA256').update(rawBody).verify(pem, Buffer.from(signature, 'base64'));
      } catch {
        return false;
      }
    };
    if (check(await this.publicKey())) return true;
    if (process.env.MONOBANK_PUBLIC_KEY?.trim()) return false;
    return check(await this.publicKey(true));
  }
}
