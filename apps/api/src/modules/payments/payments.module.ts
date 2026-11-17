import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { MonobankClient } from './monobank.client';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [MonobankClient, PaymentsService],
})
export class PaymentsModule {}
