import { Injectable } from '@nestjs/common';
import { prisma } from '@shop-ai/database';

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
}
