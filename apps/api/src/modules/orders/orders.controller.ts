import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus } from '@shop-ai/database';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return this.ordersService.getDashboardFullData();
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Query('period') period?: string) {
    return this.ordersService.getAnalyticsData(period);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.getOrders({ search, status, page, limit });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}

