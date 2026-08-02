import { Controller, Get, Post, Patch, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ProductsService, type CreateProductDto, type ProductsQueryDto } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return this.productsService.getStorageStats();
  }

  @Get('filters')
  @UseGuards(JwtAuthGuard)
  async getFilterOptions() {
    return this.productsService.getFilterOptions();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts(@Query() query: ProductsQueryDto) {
    return this.productsService.getProducts(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch('variants/:id')
  @UseGuards(JwtAuthGuard)
  async updateVariant(
    @Param('id') id: string,
    @Body() dto: { stock?: number; price?: number },
  ) {
    return this.productsService.updateVariant(id, dto);
  }

  @Delete('variants/:id')
  @UseGuards(JwtAuthGuard)
  async deleteVariant(@Param('id') id: string) {
    return this.productsService.deleteVariant(id);
  }
}
