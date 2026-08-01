import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return this.ordersService.getDashboardFullData();
  }
}
