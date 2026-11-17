'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface RecentOrderItem {
  id: string;
  name: string;
  sku: string;
  timeAgo: string;
  price: string;
  status: 'Paid' | 'Processing' | 'Delivered' | 'Pending';
  image?: string;
}

export interface RecentOrderedProductsCardProps {
  orders: RecentOrderItem[];
  loading?: boolean;
}

export default function RecentOrderedProductsCard({
  orders,
  loading = false,
}: RecentOrderedProductsCardProps) {
  const { t, isUk } = useTranslation();

  const getStatusText = (status: RecentOrderItem['status']) => {
    switch (status) {
      case 'Paid':
        return isUk ? 'Оплачено' : 'Paid';
      case 'Processing':
        return isUk ? 'В обробці' : 'Processing';
      case 'Delivered':
        return isUk ? 'Доставлено' : 'Delivered';
      case 'Pending':
        return isUk ? 'Очікує' : 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div className="flex flex-col">
          <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
            {t.recentOrderedTitle}
          </h2>
          <span className="text-[12px] text-[var(--text-secondary)]">{t.recentOrderedSubtitle}</span>
        </div>

        <Link
          href="/orders"
          className="group inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          <span>{t.recentOrderedViewAll}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-[var(--border)] pt-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-3.5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-md bg-[var(--surface-soft)]" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-28 rounded bg-[var(--border)]" />
                  <div className="h-3 w-20 rounded bg-[var(--surface-soft)]" />
                </div>
              </div>
              <div className="h-4 w-12 rounded bg-[var(--border)]" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package className="h-8 w-8 text-[var(--text-tertiary)] mb-2" />
            <p className="text-[14px] font-medium text-[var(--text-secondary)]">{t.recentOrderedEmpty}</p>
          </div>
        ) : (
          orders.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3.5 transition-colors hover:bg-[var(--surface-soft)] px-1 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-11 w-11 rounded-md object-cover bg-[var(--surface-sunken)] border border-[var(--border)] shrink-0"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--surface-sunken)] text-[var(--text-tertiary)] shrink-0 border border-[var(--border)]">
                    <Package className="h-5 w-5" />
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-[var(--text)] truncate">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)] truncate">
                    {t.recentOrderedTimePrefix} · {item.timeAgo}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 ml-3">
                <span className="text-[14px] font-semibold tabular-nums text-[var(--text)]">{item.price}</span>
                <span className="text-[12px] text-[var(--text-secondary)]">{getStatusText(item.status)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
