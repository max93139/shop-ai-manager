import { Module, Controller, Get } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Shop AI Manager API';
  }
}

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    InventoryModule,
    OrdersModule,
    TelegramModule,
    AiModule,
    NotificationsModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
