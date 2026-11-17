import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@shop-ai/database';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateVariantDto } from './dto/update-variant.dto';

/** Reads a stock value from a client map, rejecting anything that is not a whole number >= 0. */
function parseStock(value: unknown, key: string): number {
  const stock = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
    throw new BadRequestException(`Stock for "${key}" must be a whole number of 0 or more`);
  }
  return stock;
}

export interface ProductsQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  status?: 'all' | 'active' | 'low_stock' | 'out_of_stock';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

  async getProducts(query: ProductsQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    // Build WHERE clause for ProductVariant
    const where: any = {};
    const productWhere: any = {};

    // Search by product name
    if (query.search?.trim()) {
      productWhere.name = { contains: query.search.trim(), mode: 'insensitive' };
    }

    // Category filter (by category name)
    if (query.category?.trim()) {
      productWhere.category = { name: { equals: query.category.trim(), mode: 'insensitive' } };
    }

    // Brand filter (stored in product.description as "Brand: XYZ")
    if (query.brand?.trim()) {
      productWhere.description = { contains: query.brand.trim(), mode: 'insensitive' };
    }

    if (Object.keys(productWhere).length > 0) {
      where.product = productWhere;
    }

    // Color filter
    if (query.color?.trim()) {
      where.color = { equals: query.color.trim(), mode: 'insensitive' };
    }

    // Size filter
    if (query.size?.trim()) {
      where.size = { equals: query.size.trim(), mode: 'insensitive' };
    }

    // Status filter (by stock level)
    if (query.status && query.status !== 'all') {
      switch (query.status) {
        case 'out_of_stock':
          where.stock = { equals: 0 };
          break;
        case 'low_stock':
          where.stock = { gt: 0, lte: 5 };
          break;
        case 'active':
          where.stock = { gt: 5 };
          break;
      }
    }

    const [items, totalCount] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.productVariant.count({ where }),
    ]);

    // Compute status counts for the tabs
    const baseWhere = { ...where };
    delete baseWhere.stock;

    const [activeCount, lowStockCount, outOfStockCount] = await Promise.all([
      prisma.productVariant.count({ where: { ...baseWhere, stock: { gt: 5 } } }),
      prisma.productVariant.count({ where: { ...baseWhere, stock: { gt: 0, lte: 5 } } }),
      prisma.productVariant.count({ where: { ...baseWhere, stock: { equals: 0 } } }),
    ]);

    const allCount = activeCount + lowStockCount + outOfStockCount;

    // Map items to a flat structure for the frontend
    const products = items.map((v) => {
      const brandMatch = v.product.description?.match(/Brand:\s*(.+)/i);
      const brand = brandMatch ? brandMatch[1].trim() : '';

      let status: 'active' | 'low_stock' | 'out_of_stock' = 'active';
      if (v.stock === 0) status = 'out_of_stock';
      else if (v.stock <= 5) status = 'low_stock';

      return {
        variantId: v.id,
        productId: v.product.id,
        name: v.product.name,
        sku: v.sku,
        category: v.product.category.name,
        brand,
        color: v.color,
        size: v.size,
        stock: v.stock,
        price: Number(v.price),
        status,
        images: v.product.images || [],
        createdAt: v.createdAt,
      };
    });

    return {
      products,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      statusCounts: {
        all: allCount,
        active: activeCount,
        low_stock: lowStockCount,
        out_of_stock: outOfStockCount,
      },
    };
  }

  async getFilterOptions() {
    const [categories, variants] = await Promise.all([
      prisma.category.findMany({ select: { name: true }, orderBy: { name: 'asc' } }),
      prisma.productVariant.findMany({
        select: { color: true, size: true, product: { select: { description: true } } },
      }),
    ]);

    const categoryNames = categories.map((c) => c.name);

    const brands = new Set<string>();
    const colors = new Set<string>();
    const sizes = new Set<string>();

    for (const v of variants) {
      if (v.color && v.color !== 'Standard') colors.add(v.color);
      if (v.size && v.size !== 'One size') sizes.add(v.size);
      const brandMatch = v.product.description?.match(/Brand:\s*(.+)/i);
      if (brandMatch) brands.add(brandMatch[1].trim());
    }

    return {
      categories: categoryNames,
      brands: Array.from(brands).sort(),
      colors: Array.from(colors).sort(),
      sizes: Array.from(sizes).sort(),
    };
  }

  async createProduct(dto: CreateProductDto) {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('Product name is required');
    }

    const categoryName = dto.category?.trim() || 'General';
    const rawPrice = dto.price;

    let fallbackStock = dto.inStock ?? 0;
    if (dto.colorStocks && Object.keys(dto.colorStocks).length > 0) {
      fallbackStock = Object.entries(dto.colorStocks).reduce((acc, [key, value]) => acc + parseStock(value, key), 0);
    }

    // Build and validate the variant matrix before anything is written.
    const sizes = dto.selectedSizes && dto.selectedSizes.length > 0 ? dto.selectedSizes : ['One size'];
    const colors = dto.selectedColors && dto.selectedColors.length > 0 ? dto.selectedColors : ['Standard'];

    const matrix: Array<{ size: string; color: string; stock: number }> = [];

    for (const size of sizes) {
      for (const color of colors) {
        // Determine stock priority: variantStocks (color+size) -> sizeStocks (size) -> colorStocks (color) -> fallbackStock
        let variantStock = fallbackStock;
        const variantKey1 = `${color}:::${size}`;
        const variantKey2 = `${color}_${size}`;

        if (dto.variantStocks && variantKey1 in dto.variantStocks) {
          variantStock = parseStock(dto.variantStocks[variantKey1], variantKey1);
        } else if (dto.variantStocks && variantKey2 in dto.variantStocks) {
          variantStock = parseStock(dto.variantStocks[variantKey2], variantKey2);
        } else if (dto.variantStocks && size in dto.variantStocks) {
          variantStock = parseStock(dto.variantStocks[size], size);
        } else if (dto.sizeStocks && size in dto.sizeStocks) {
          variantStock = parseStock(dto.sizeStocks[size], size);
        } else if (dto.colorStocks && color in dto.colorStocks) {
          variantStock = parseStock(dto.colorStocks[color], color);
        }

        // Zero-stock variants are kept so the size can be restocked later and shows as sold out in the bot.
        matrix.push({ size, color, stock: variantStock });
      }
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

    const categoryId = category.id;

    // 2. Create the product and its variants together
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name,
          slug,
          categoryId,
          description: dto.brand ? `Brand: ${dto.brand}` : undefined,
          images: dto.images || [],
        },
      });

      await tx.productVariant.createMany({
        data: matrix.map(({ size, color, stock }) => {
          const skuRandom = Math.floor(10000 + Math.random() * 90000);
          const cleanSize = size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'STD';
          const cleanColor = color.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'STD';
          return {
            productId: created.id,
            sku: `SKU-${cleanSize}-${cleanColor}-${skuRandom}`,
            size,
            color,
            price: rawPrice,
            stock,
          };
        }),
      });

      return created;
    });

    return prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async updateVariant(variantId: string, dto: UpdateVariantDto) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new BadRequestException('Product variant not found');
    }

    const dataToUpdate: { stock?: number; price?: number } = {};
    if (dto.stock !== undefined) {
      dataToUpdate.stock = dto.stock;
    }
    if (dto.price !== undefined) {
      dataToUpdate.price = dto.price;
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: dataToUpdate,
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const brandMatch = updated.product.description?.match(/Brand:\s*(.+)/i);
    const brand = brandMatch ? brandMatch[1].trim() : '';

    let status: 'active' | 'low_stock' | 'out_of_stock' = 'active';
    if (updated.stock === 0) status = 'out_of_stock';
    else if (updated.stock <= 5) status = 'low_stock';

    return {
      variantId: updated.id,
      productId: updated.product.id,
      name: updated.product.name,
      sku: updated.sku,
      category: updated.product.category.name,
      brand,
      color: updated.color,
      size: updated.size,
      stock: updated.stock,
      price: Number(updated.price),
      status,
      images: updated.product.images || [],
      createdAt: updated.createdAt,
    };
  }

  async deleteVariant(variantId: string) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new BadRequestException('Product variant not found');
    }

    const productId = variant.productId;

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    const remainingCount = await prisma.productVariant.count({
      where: { productId },
    });

    if (remainingCount === 0) {
      await prisma.product.delete({
        where: { id: productId },
      });
    }

    return { success: true, variantId, productId };
  }
}
