import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { NovaPoshtaController } from './nova-poshta.controller';
import { NovaPoshtaService } from './nova-poshta.service';

@Module({
  imports: [NotificationsModule],
  controllers: [NovaPoshtaController],
  providers: [NovaPoshtaService],
  exports: [NovaPoshtaService],
})
export class NovaPoshtaModule {}
