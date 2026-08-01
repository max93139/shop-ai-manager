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
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="flex h-[134px] flex-col justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface-soft)] p-5 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-[var(--border)]" />
              <div className="h-9 w-9 rounded-[10px] bg-[var(--border)]" />
            </div>
            <div className="h-7 w-28 rounded bg-[var(--border)]" />
            <div className="h-3.5 w-20 rounded bg-[var(--border)]" />
          </div>
        ))}
      </div>
    );
  }

  const statItems: StatCardProps[] = [
    {
      ...data.todaySales,
      icon: <Receipt className="h-4 w-4 text-[#0F6B4F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#E7F2ED]',
    },
    {
      ...data.revenue30d,
      icon: <BarChart3 className="h-4 w-4 text-[#2B6CB0]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#EBF8FF]',
    },
    {
      ...data.orders,
      icon: <Package className="h-4 w-4 text-[#B7791F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#FEFCBF]',
    },
    {
      ...data.newCustomers,
      icon: <Users className="h-4 w-4 text-[#0F6B4F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#E7F2ED]',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
      {statItems.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
