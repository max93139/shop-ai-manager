import {
  Controller,
  Headers,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import type { RawBodyRequest } from './raw-body';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly payments: PaymentsService) {}

  /** Monobank calls this for every invoice status change; any non-200 makes it retry. */
  @Post('monobank/webhook')
  @HttpCode(200)
  async monobankWebhook(@Req() req: RawBodyRequest, @Headers('x-sign') signature?: string) {
    const rawBody = req.rawBody;
    if (!rawBody || !(await this.payments.verifyWebhook(rawBody, signature))) {
      throw new UnauthorizedException('Invalid signature');
    }

    let invoiceId: unknown;
    try {
      invoiceId = JSON.parse(rawBody.toString('utf8')).invoiceId;
    } catch {
      invoiceId = undefined;
    }
    if (typeof invoiceId !== 'string') {
      this.logger.warn('Signed Monobank webhook without invoiceId');
      return { ok: true };
    }

    try {
      await this.payments.syncInvoice(invoiceId);
    } catch (err) {
      if (!(err instanceof NotFoundException)) throw err;
      this.logger.warn(`Monobank webhook for unknown invoice ${invoiceId}`);
    }
    return { ok: true };
  }

  @Post('orders/:id/sync')
  @UseGuards(JwtAuthGuard)
  syncOrder(@Param('id') id: string) {
    return this.payments.syncOrder(id);
  }
}
