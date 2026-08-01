import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProductsService, type CreateProductDto } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return this.productsService.getStorageStats();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }
}
