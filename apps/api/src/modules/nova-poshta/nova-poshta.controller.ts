import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { NovaPoshtaService } from './nova-poshta.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTtnDto } from './dto/create-ttn.dto';

@Controller('nova-poshta')
export class NovaPoshtaController {
  constructor(private readonly novaPoshtaService: NovaPoshtaService) {}

  @Get('cities')
  async searchCities(@Query('search') search?: string) {
    if (!search || search.trim().length < 2) {
      return [];
    }
    return this.novaPoshtaService.searchSettlements(search.trim());
  }

  @Get('warehouses')
  async getWarehouses(
    @Query('city') city?: string,
    @Query('search') search?: string,
  ) {
    if (!city || city.trim().length === 0) {
      throw new BadRequestException('City identifier or name is required');
    }
    return this.novaPoshtaService.getWarehouses(city.trim(), search?.trim());
  }

  @Get('track/:ttn')
  async trackTtn(@Param('ttn') ttn: string) {
    const result = await this.novaPoshtaService.trackDocument(ttn);
    if (!result) {
      return { number: ttn, status: 'Не знайдено', statusDescription: 'ТТН не знайдено в базі Нової Пошти' };
    }
    return result;
  }

  @Post('orders/:id/create-ttn')
  @UseGuards(JwtAuthGuard)
  async createTtn(@Param('id') orderId: string, @Body() dto: CreateTtnDto) {
    return this.novaPoshtaService.createTtnForOrder(orderId, dto);
  }

  @Patch('orders/:id/ttn')
  @UseGuards(JwtAuthGuard)
  async updateOrderTtn(
    @Param('id') orderId: string,
    @Body('ttn') ttn: string,
  ) {
    if (!ttn || ttn.trim().length < 10) {
      throw new BadRequestException('Valid TTN number is required');
    }
    return this.novaPoshtaService.updateOrderTtn(orderId, ttn.trim());
  }
}
