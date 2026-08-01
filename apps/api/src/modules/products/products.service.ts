import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@shop-ai/database';

export interface CreateProductDto {
  name: string;
  category: string;
  brand?: string;
  price?: string | number;
  selectedSizes?: string[];
  selectedColors?: string[];
  colorStocks?: Record<string, number>;
  inStock?: string | number;
}

@Injectable()
export class ProductsService {
  async getStorageStats() {
    const totalItems = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const products = await prisma.product.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: true,
      },
    });

    return {
      totalItems,
      totalCategories,
      products,
    };
  }

  async createProduct(dto: CreateProductDto) {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('Product name is required');
    }

    const categoryName = dto.category?.trim() || 'General';
    const rawPrice = typeof dto.price === 'number' ? dto.price : parseFloat(dto.price || '0') || 0;

    let fallbackStock = typeof dto.inStock === 'number' ? dto.inStock : parseInt(dto.inStock || '0', 10) || 0;
    if (dto.colorStocks && Object.keys(dto.colorStocks).length > 0) {
      fallbackStock = Object.values(dto.colorStocks).reduce((acc, curr) => acc + (curr || 0), 0);
    }

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    // Category Slug
    const categorySlug = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // 1. Find or Create Category
    let category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: categorySlug }, { name: categoryName }],
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
          description: `${categoryName} products`,
        },
      });
    }

    // 2. Create Product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId: category.id,
        description: dto.brand ? `Brand: ${dto.brand}` : undefined,
      },
    });

    // 3. Create Variants Matrix
    const sizes = dto.selectedSizes && dto.selectedSizes.length > 0 ? dto.selectedSizes : ['One size'];
    const colors = dto.selectedColors && dto.selectedColors.length > 0 ? dto.selectedColors : ['Standard'];

    const variantData = [];
    for (const size of sizes) {
      for (const color of colors) {
        const skuRandom = Math.floor(10000 + Math.random() * 90000);
        const cleanSize = size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'STD';
        const cleanColor = color.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'STD';
        const sku = `SKU-${cleanSize}-${cleanColor}-${skuRandom}`;

        const colorStock =
          dto.colorStocks && color in dto.colorStocks
            ? dto.colorStocks[color]
            : fallbackStock;

        variantData.push({
          productId: product.id,
          sku,
          size,
          color,
          price: rawPrice,
          stock: colorStock,
        });
      }
    }

    await prisma.productVariant.createMany({
      data: variantData,
    });

    return prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true,
      },
    });
  }
}
