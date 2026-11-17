import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma, OrderStatus } from '@shop-ai/database';
import { canTransitionOrder, type OrderStatus as SharedOrderStatus } from '@shop-ai/types';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(private readonly notifications: NotificationsService) {}

  async getDashboardFullData() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const currencyFormatter = new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      maximumFractionDigits: 0,
    });

    const detailedCurrencyFormatter = new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
    });

    // 1. STATS METRICS
    const todaySalesAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: startOfToday },
        status: { not: OrderStatus.CANCELLED },
      },
    });

    const revenue30dAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: OrderStatus.CANCELLED },
      },
    });

    const todayOrdersCount = await prisma.order.count({
      where: {
        createdAt: { gte: startOfToday },
        status: { not: OrderStatus.CANCELLED },
      },
    });

    const newCustomersCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const stats = {
      todaySales: {
        title: "Today's sales",
        value: currencyFormatter.format(Number(todaySalesAgg._sum.totalAmount || 0)),
        change: '0%',
        changeType: 'increase' as const,
        timeframe: 'vs yesterday',
      },
      revenue30d: {
        title: 'Revenue (30d)',
        value: currencyFormatter.format(Number(revenue30dAgg._sum.totalAmount || 0)),
        change: '0%',
        changeType: 'increase' as const,
        timeframe: 'vs last month',
      },
      orders: {
        title: 'Orders',
        value: todayOrdersCount.toString(),
        change: '0%',
        changeType: 'increase' as const,
        timeframe: 'vs yesterday',
      },
      newCustomers: {
        title: 'New customers',
        value: newCustomersCount.toString(),
        change: '0%',
        changeType: 'increase' as const,
        timeframe: 'vs yesterday',
      },
    };

    // 2. REVENUE CHART (LAST 7 DAYS)
    const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueBars = [];
    let peakValue = 0;
    let peakDayName = 'Wed';

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);

      const dayAgg = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd,
          },
          status: { not: OrderStatus.CANCELLED },
        },
      });

      const dayVal = Number(dayAgg._sum.totalAmount || 0);
      const dayName = daysName[dayStart.getDay()];

      if (dayVal > peakValue) {
        peakValue = dayVal;
        peakDayName = dayName;
      }

      revenueBars.push({
        day: dayName,
        value: dayVal,
        formattedValue: dayVal >= 1000 ? `${(dayVal / 1000).toFixed(1)}k ₴` : `${dayVal} ₴`,
        isHighlight: false,
      });
    }

    // Highlight peak day
    let peakInfo = 'Peak -';
    if (peakValue > 0) {
      const peakFormatted = peakValue >= 1000 ? `${(peakValue / 1000).toFixed(1)}k ₴` : `${peakValue} ₴`;
      peakInfo = `Peak ${peakDayName} · ${peakFormatted}`;
      const peakIndex = revenueBars.findIndex((b) => b.day === peakDayName && b.value === peakValue);
      if (peakIndex !== -1) {
        revenueBars[peakIndex].isHighlight = true;
      }
    }

    // 3. LATEST ORDERS (TOP 5 FROM DB)
    const rawOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    const latestOrders = rawOrders.map((ord, index) => {
      const shortId = (10482 - index).toString();
      const customerName = ord.fullName || ord.user?.name || 'Customer';
      const formattedTotal = detailedCurrencyFormatter.format(Number(ord.totalAmount));

      let paymentStatus: 'Paid' | 'Pending' | 'Failed' = 'Paid';
      if (ord.status === 'PENDING') paymentStatus = 'Pending';
      else if (ord.status === 'CANCELLED') paymentStatus = 'Failed';

      let fulfillmentStatus: 'Processing' | 'Shipped' | 'Unfulfilled' | 'Delivered' = 'Processing';
      if (ord.status === 'SHIPPED') fulfillmentStatus = 'Shipped';
      else if (ord.status === 'DELIVERED') fulfillmentStatus = 'Delivered';
      else if (ord.status === 'PENDING') fulfillmentStatus = 'Unfulfilled';

      return {
        id: ord.id,
        orderNumber: `#${shortId}`,
        customerName,
        phone: ord.phone || undefined,
        city: ord.city || undefined,
        postOffice: ord.postOffice || undefined,
        totalAmount: formattedTotal,
        paymentStatus,
        fulfillmentStatus,
      };
    });

    return {
      stats,
      revenueChart: {
        peakInfo,
        bars: revenueBars,
      },
      latestOrders,
    };
  }

  async getOrders(query: { search?: string; status?: string; page?: number; limit?: number }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    const statusUpper = query.status?.toUpperCase();
    if (statusUpper === 'ACTIVE') {
      where.status = {
        in: [
          OrderStatus.PENDING,
          OrderStatus.PAID,
          OrderStatus.PROCESSING,
          OrderStatus.SHIPPED,
        ],
      };
    } else if (statusUpper === 'ARCHIVE' || statusUpper === 'ARCHIVED') {
      where.status = {
        in: [
          OrderStatus.DELIVERED,
          OrderStatus.CANCELLED,
        ],
      };
    } else if (statusUpper && statusUpper !== 'ALL') {
      const targetStatus = statusUpper as OrderStatus;
      if (Object.values(OrderStatus).includes(targetStatus)) {
        where.status = targetStatus;
      }
    }

    if (query.search?.trim()) {
      const search = query.search.trim();
      const cleanSearch = search.startsWith('#') ? search.slice(1).trim() : search;
      where.OR = [
        { id: { contains: cleanSearch, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { postOffice: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { items: { some: { productName: { contains: search, mode: 'insensitive' } } } },
        {
          items: {
            some: {
              variant: {
                product: {
                  name: { contains: search, mode: 'insensitive' },
                },
              },
            },
          },
        },
      ];
    }

    let revenueStatusFilter: any = where.status ? where.status : { not: OrderStatus.CANCELLED };
    if (where.status && typeof where.status === 'object' && Array.isArray(where.status.in)) {
      const nonCancelled = where.status.in.filter((s: OrderStatus) => s !== OrderStatus.CANCELLED);
      revenueStatusFilter = nonCancelled.length === 1 ? nonCancelled[0] : { in: nonCancelled };
    }

    const [items, totalCount, statusCountsRaw, totalRevenueAgg] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          ...where,
          status: revenueStatusFilter,
        },
      }),
    ]);

    const statusCounts: Record<string, number> = {
      all: 0,
      active: 0,
      archive: 0,
      pending: 0,
      processing: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    let totalAll = 0;
    for (const sc of statusCountsRaw) {
      const count = sc._count._all;
      totalAll += count;
      const key = sc.status.toLowerCase();
      if (key in statusCounts) {
        statusCounts[key] = count;
      }
    }
    statusCounts.all = totalAll;
    statusCounts.active =
      statusCounts.pending +
      statusCounts.paid +
      statusCounts.processing +
      statusCounts.shipped;
    statusCounts.archive =
      statusCounts.delivered + statusCounts.cancelled;

    const orders = items.map((ord) => {
      const orderNumber = `#${ord.id.slice(0, 8).toUpperCase()}`;
      const customerName = ord.fullName || ord.user?.name || 'Customer';

      const itemsDetail = ord.items.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        productName: item.productName ?? item.variant?.product?.name ?? 'Product',
        sku: item.sku ?? item.variant?.sku ?? '',
        size: item.size ?? item.variant?.size ?? 'Standard',
        color: item.color ?? item.variant?.color ?? 'Standard',
        price: Number(item.price),
        quantity: item.quantity,
        image: item.image ?? item.variant?.product?.images?.[0] ?? undefined,
      }));

      const totalItemsCount = ord.items.reduce((acc, curr) => acc + curr.quantity, 0);

      return {
        id: ord.id,
        orderNumber,
        status: ord.status,
        totalAmount: Number(ord.totalAmount),
        customerName,
        phone: ord.phone || undefined,
        city: ord.city || undefined,
        postOffice: ord.postOffice || undefined,
        ttn: ord.ttn || undefined,
        deliveryCityRef: ord.deliveryCityRef || undefined,
        deliveryWarehouseRef: ord.deliveryWarehouseRef || undefined,
        paymentUrl: ord.paymentUrl || undefined,
        paidAt: ord.paidAt?.toISOString(),
        telegramId: ord.user?.telegramId ? ord.user.telegramId.toString() : undefined,
        items: itemsDetail,
        itemsCount: totalItemsCount,
        createdAt: ord.createdAt.toISOString(),
        updatedAt: ord.updatedAt.toISOString(),
      };
    });

    return {
      orders,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
      statusCounts,
      totalRevenue: Number(totalRevenueAgg._sum.totalAmount || 0),
    };
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const previousStatus = order.status;

      if (!canTransitionOrder(previousStatus as SharedOrderStatus, status as SharedOrderStatus)) {
        throw new BadRequestException(`Cannot change order status from ${previousStatus} to ${status}`);
      }

      if (previousStatus === status) {
        return { success: true, id: order.id, status: order.status };
      }

      if (status === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          if (!item.variantId) continue;
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      if (previousStatus === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const label = item.productName ?? item.sku ?? item.id;
          if (!item.variantId) {
            throw new BadRequestException(`Cannot restore the order: "${label}" was removed from the catalogue`);
          }
          const reserved = await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (reserved.count === 0) {
            throw new BadRequestException(`Cannot restore the order: not enough stock for "${label}"`);
          }
        }
      }

      const updated = await tx.order.update({
        where: { id },
        data: { status },
      });

      return {
        success: true,
        id: updated.id,
        status: updated.status,
        changed: true,
      };
    });

    if ('changed' in result) {
      void this.notifications.notifyCustomerAboutStatus(id, status);
    }
    return { success: result.success, id: result.id, status: result.status };
  }

  async deleteOrder(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await prisma.order.delete({
      where: { id },
    });

    return { success: true, message: 'Order deleted successfully' };
  }

  async getAnalyticsData(period: string = '30d') {
    const now = new Date();
    let daysCount = 30;
    if (period === '7d') {
      daysCount = 7;
    } else if (period === '90d') {
      daysCount = 90;
    } else if (period === 'all') {
      const earliestOrder = await prisma.order.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      });
      if (earliestOrder) {
        const daysSinceEarliest = Math.ceil(
          (now.getTime() - earliestOrder.createdAt.getTime()) / (24 * 60 * 60 * 1000)
        );
        daysCount = Math.max(daysSinceEarliest, 30);
      } else {
        daysCount = 365;
      }
    }

    const startDate = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - daysCount * 24 * 60 * 60 * 1000);

    const currentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const prevAgg = await prisma.order.aggregate({
      where: {
        createdAt: { gte: prevStartDate, lt: startDate },
        status: { not: OrderStatus.CANCELLED },
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const nonCancelledOrders = currentOrders.filter((o) => o.status !== OrderStatus.CANCELLED);

    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const totalOrders = nonCancelledOrders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const completedOrPaidOrders = nonCancelledOrders.filter(
      (o) =>
        o.status === OrderStatus.PAID ||
        o.status === OrderStatus.DELIVERED ||
        o.status === OrderStatus.SHIPPED,
    ).length;
    const conversionRate = totalOrders > 0 ? Number(((completedOrPaidOrders / totalOrders) * 100).toFixed(1)) : 0;

    const prevRevenue = Number(prevAgg._sum.totalAmount || 0);
    const prevOrders = prevAgg._count.id || 0;
    const revenueGrowth =
      prevRevenue > 0
        ? Number((((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1))
        : totalRevenue > 0
          ? 100
          : 0;
    const ordersGrowth =
      prevOrders > 0
        ? Number((((totalOrders - prevOrders) / prevOrders) * 100).toFixed(1))
        : totalOrders > 0
          ? 100
          : 0;

    const bucketCount = Math.min(daysCount, 14);
    const bucketIntervalMs = (daysCount * 24 * 60 * 60 * 1000) / bucketCount;
    const revenueTrend = [];
    for (let i = bucketCount - 1; i >= 0; i--) {
      const bucketStart = new Date(now.getTime() - (i + 1) * bucketIntervalMs);
      const bucketEnd = new Date(now.getTime() - i * bucketIntervalMs);
      const bucketOrders = nonCancelledOrders.filter(
        (o) => o.createdAt >= bucketStart && o.createdAt < bucketEnd,
      );
      const rev = bucketOrders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
      const label = `${bucketStart.getDate()} ${bucketStart.toLocaleString('en', { month: 'short' })}`;
      revenueTrend.push({
        date: bucketStart.toISOString().split('T')[0],
        label,
        revenue: rev,
        orders: bucketOrders.length,
      });
    }

    const categoryRevMap = new Map<string, number>();
    const productStatsMap = new Map<
      string,
      { id: string; name: string; category: string; salesCount: number; revenue: number }
    >();
    const cityMap = new Map<string, { ordersCount: number; totalAmount: number }>();

    for (const order of nonCancelledOrders) {
      if (order.city) {
        const c = order.city.trim();
        const existing = cityMap.get(c) || { ordersCount: 0, totalAmount: 0 };
        existing.ordersCount += 1;
        existing.totalAmount += Number(order.totalAmount || 0);
        cityMap.set(c, existing);
      }

      for (const item of order.items) {
        const prod = item.variant?.product;
        const catName = prod?.category?.name || 'General';
        const itemRev = Number(item.price) * item.quantity;

        categoryRevMap.set(catName, (categoryRevMap.get(catName) || 0) + itemRev);

        const productName = item.productName ?? prod?.name;
        const productKey = prod?.id ?? (productName ? `deleted:${productName}` : null);
        if (productKey && productName) {
          const existingProd = productStatsMap.get(productKey) || {
            id: productKey,
            name: productName,
            category: catName,
            salesCount: 0,
            revenue: 0,
          };
          existingProd.salesCount += item.quantity;
          existingProd.revenue += itemRev;
          productStatsMap.set(productKey, existingProd);
        }
      }
    }

    if (categoryRevMap.size === 0) {
      const dbCategories = await prisma.category.findMany({ take: 4 });
      if (dbCategories.length > 0) {
        dbCategories.forEach((c) => categoryRevMap.set(c.name, 0));
      }
    }

    const categories = Array.from(categoryRevMap.entries()).map(([name, rev]) => ({
      name,
      revenue: rev,
      percentage: totalRevenue > 0 ? Number(((rev / totalRevenue) * 100).toFixed(1)) : 0,
    }));

    const topProducts = Array.from(productStatsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const cities = Array.from(cityMap.entries())
      .map(([city, data]) => ({ city, ...data }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    const statusBreakdown = {
      delivered: currentOrders.filter((o) => o.status === OrderStatus.DELIVERED).length,
      shipped: currentOrders.filter((o) => o.status === OrderStatus.SHIPPED).length,
      processing: currentOrders.filter((o) => o.status === OrderStatus.PROCESSING).length,
      paid: currentOrders.filter((o) => o.status === OrderStatus.PAID).length,
      pending: currentOrders.filter((o) => o.status === OrderStatus.PENDING).length,
      cancelled: currentOrders.filter((o) => o.status === OrderStatus.CANCELLED).length,
    };

    return {
      timeframe: period,
      summary: {
        totalRevenue,
        totalOrders,
        aov,
        conversionRate,
        revenueGrowth,
        ordersGrowth,
      },
      revenueTrend,
      categories,
      topProducts,
      cities,
      statusBreakdown,
    };
  }
}
