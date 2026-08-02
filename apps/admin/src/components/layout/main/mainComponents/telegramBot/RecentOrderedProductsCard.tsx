'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, CheckCircle2 } from 'lucide-react';

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
  return (
    <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)] h-full">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div className="flex flex-col">
          <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
            Recent ordered products
          </h2>
          <span className="text-[12px] text-[var(--text-secondary)]">Останні замовлені товари</span>
        </div>

        <Link
          href="/orders"
          className="group inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-[var(--border)] pt-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-3.5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-[10px] bg-[var(--surface-soft)]" />
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
            <p className="text-[14px] font-medium text-[var(--text-secondary)]">No recent orders</p>
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
                    className="h-11 w-11 rounded-[10px] object-cover bg-[var(--surface-sunken)] border border-[var(--border)] shrink-0"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--surface-sunken)] text-[var(--text-tertiary)] shrink-0 border border-[var(--border)]">
                    <Package className="h-5 w-5" />
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-[var(--text)] truncate">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Ordered · {item.timeAgo}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 ml-3">
                <span className="text-[14px] font-bold text-[var(--text)]">{item.price}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F2ED] px-2 py-0.5 text-[11px] font-semibold text-[#0F6B4F]">
                  <CheckCircle2 className="h-3 w-3" />
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
