import { Injectable } from '@nestjs/common';
import { prisma } from '@shop-ai/database';

@Injectable()
export class OrdersService {
  async getDashboardStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Aggregate today's sales from DB
    const todaySalesAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfToday } },
    });

    // Aggregate 30 days revenue from DB
    const revenue30dAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // Count today's orders from DB
    const todayOrdersCount = await prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
    });

    // Count new customers in last 30 days from DB
    const newCustomersCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const todaySalesNum = Number(todaySalesAgg._sum.totalAmount || 0);
    const revenue30dNum = Number(revenue30dAgg._sum.totalAmount || 0);

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    return {
      todaySales: {
        title: "Today's sales",
        value: formatter.format(todaySalesNum),
        change: '0%',
        changeType: 'increase' as const,
        timeframe: 'vs yesterday',
      },
      revenue30d: {
        title: 'Revenue (30d)',
        value: formatter.format(revenue30dNum),
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
  }
}
