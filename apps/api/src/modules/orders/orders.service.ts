import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, OrderStatus } from '@shop-ai/database';

@Injectable()
export class OrdersService {
  async getDashboardFullData() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    const detailedCurrencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    // 1. STATS METRICS
    const todaySalesAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfToday } },
    });

    const revenue30dAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const todayOrdersCount = await prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
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
        formattedValue: dayVal >= 1000 ? `$${(dayVal / 1000).toFixed(1)}k` : `$${dayVal}`,
        isHighlight: false,
      });
    }

    // Highlight peak day
    let peakInfo = 'Peak -';
    if (peakValue > 0) {
      const peakFormatted = peakValue >= 1000 ? `$${(peakValue / 1000).toFixed(1)}k` : `$${peakValue}`;
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
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { postOffice: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
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
        productName: item.variant?.product?.name || 'Product',
        sku: item.variant?.sku || '',
        size: item.variant?.size || 'Standard',
        color: item.variant?.color || 'Standard',
        price: Number(item.price),
        quantity: item.quantity,
        image: item.variant?.product?.images?.[0] || undefined,
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
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const previousStatus = order.status;

    // If order was not CANCELLED and is now being cancelled/refused -> restore stock
    if (previousStatus !== OrderStatus.CANCELLED && status === OrderStatus.CANCELLED) {
      for (const item of order.items) {
        await prisma.productVariant
          .update({
            where: { id: item.variantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })
          .catch(() => null);
      }
    }

    // If order was CANCELLED and is now being re-activated -> decrement stock again
    if (previousStatus === OrderStatus.CANCELLED && status !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        await prisma.productVariant
          .update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
          .catch(() => null);
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      id: updated.id,
      status: updated.status,
    };
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
}
