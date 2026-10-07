'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Clock, Archive } from 'lucide-react';

export interface OrdersStatsProps {
  totalRevenue: number;
  statusCounts: {
    all: number;
    active: number;
    archive: number;
    pending: number;
    processing: number;
    paid: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  loading?: boolean;
}

export default function OrdersStats({
  totalRevenue,
  statusCounts,
  loading = false,
}: OrdersStatsProps) {
  const activeCount = statusCounts.active ?? (statusCounts.pending + statusCounts.paid + statusCounts.processing + statusCounts.shipped);
  const archiveCount = statusCounts.archive ?? (statusCounts.delivered + statusCounts.cancelled);

  const cards = [
    {
      title: 'Total Revenue',
      value: `₴${totalRevenue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'From all recorded sales',
      icon: <DollarSign className="h-5 w-5 text-[#0F6B4F]" />,
      bgIcon: 'bg-[#E7F2ED]',
    },
    {
      title: 'Active Orders',
      value: activeCount.toString(),
      subtitle: `${statusCounts.paid + statusCounts.processing + statusCounts.shipped} in fulfillment`,
      icon: <ShoppingBag className="h-5 w-5 text-[var(--accent)]" />,
      bgIcon: 'bg-[var(--accent-soft)]',
    },
    {
      title: 'Pending Action',
      value: statusCounts.pending.toString(),
      subtitle: 'Awaiting confirmation',
      icon: <Clock className="h-5 w-5 text-[#B87A00]" />,
      bgIcon: 'bg-[#FEF6E7]',
    },
    {
      title: 'Archived',
      value: archiveCount.toString(),
      subtitle: `${statusCounts.delivered} delivered · ${statusCounts.cancelled} cancelled`,
      icon: <Archive className="h-5 w-5 text-[#4B5563]" />,
      bgIcon: 'bg-[#F3F4F6]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_2px_8px_rgba(28,27,25,0.02)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
              {card.title}
            </span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${card.bgIcon}`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-3 flex flex-col">
            {loading ? (
              <div className="h-7 w-24 animate-pulse rounded bg-[var(--border)]" />
            ) : (
              <span className="font-['Fraunces',Georgia,serif] text-[22px] font-[650] text-[var(--text)]">
                {card.value}
              </span>
            )}
            <span className="mt-1 text-[12px] text-[var(--text-tertiary)]">
              {card.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
