'use client';

import React from 'react';
import { Receipt, BarChart3, Package, Users } from 'lucide-react';
import StatCard, { type StatCardProps } from './StatCard';

export default function DashboardStats() {
  const stats: StatCardProps[] = [
    {
      title: "Today's sales",
      value: '$4,286',
      change: '12.4%',
      changeType: 'increase',
      timeframe: 'vs yesterday',
      icon: <Receipt className="h-4 w-4 text-[#0F6B4F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#E7F2ED]',
    },
    {
      title: 'Revenue (30d)',
      value: '$96,410',
      change: '8.1%',
      changeType: 'increase',
      timeframe: 'vs last month',
      icon: <BarChart3 className="h-4 w-4 text-[#2B6CB0]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#EBF8FF]',
    },
    {
      title: 'Orders',
      value: '14',
      change: '3.2%',
      changeType: 'decrease',
      timeframe: 'vs yesterday',
      icon: <Package className="h-4 w-4 text-[#B7791F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#FEFCBF]',
    },
    {
      title: 'New customers',
      value: '7',
      change: '21%',
      changeType: 'increase',
      timeframe: 'vs yesterday',
      icon: <Users className="h-4 w-4 text-[#0F6B4F]" strokeWidth={1.8} />,
      iconBgClass: 'bg-[#E7F2ED]',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
