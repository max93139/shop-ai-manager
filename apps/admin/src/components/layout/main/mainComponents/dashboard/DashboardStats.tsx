'use client';

import React from 'react';
import { Receipt, BarChart3, Package, Users } from 'lucide-react';
import StatCard, { type StatCardProps } from './StatCard';
import type { DashboardOverviewData } from '@shop-ai/types';

export interface DashboardStatsProps {
  data?: DashboardOverviewData | null;
  loading?: boolean;
}

export default function DashboardStats({ data, loading }: DashboardStatsProps) {
  // Default values structured cleanly for API integration
  const defaultData: DashboardOverviewData = {
    todaySales: {
      title: "Today's sales",
      value: '$4,286',
      change: '12.4%',
      changeType: 'increase',
      timeframe: 'vs yesterday',
    },
    revenue30d: {
      title: 'Revenue (30d)',
      value: '$96,410',
      change: '8.1%',
      changeType: 'increase',
      timeframe: 'vs last month',
    },
    orders: {
      title: 'Orders',
      value: '14',
      change: '3.2%',
      changeType: 'decrease',
      timeframe: 'vs yesterday',
    },
    newCustomers: {
      title: 'New customers',
      value: '7',
      change: '21%',
      changeType: 'increase',
      timeframe: 'vs yesterday',
    },
  };

  const activeData = data || defaultData;

  const statItems: StatCardProps[] = [
    {
      ...activeData.todaySales,
      icon: <Receipt className="h-4 w-4 text-[#0F6B4F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#E7F2ED]',
    },
    {
      ...activeData.revenue30d,
      icon: <BarChart3 className="h-4 w-4 text-[#2B6CB0]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#EBF8FF]',
    },
    {
      ...activeData.orders,
      icon: <Package className="h-4 w-4 text-[#B7791F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#FEFCBF]',
    },
    {
      ...activeData.newCustomers,
      icon: <Users className="h-4 w-4 text-[#0F6B4F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#E7F2ED]',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="h-[140px] animate-pulse rounded-[18px] border border-[var(--border)] bg-[var(--surface-soft)] p-5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
      {statItems.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
