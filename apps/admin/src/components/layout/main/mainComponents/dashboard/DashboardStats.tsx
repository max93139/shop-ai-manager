'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Receipt, BarChart3, Package, Users } from 'lucide-react';
import StatCard, { type StatCardProps } from './StatCard';
import type { DashboardOverviewData } from '@shop-ai/types';

export interface DashboardStatsProps {
  data?: DashboardOverviewData | null;
  loading?: boolean;
}

export default function DashboardStats({ data, loading }: DashboardStatsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const statItems: StatCardProps[] = data
    ? [
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
      ]
    : [];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || statItems.length === 0) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) {
        setActiveIdx(0);
        return;
      }
      const progress = Math.max(0, Math.min(1, el.scrollLeft / max));
      const idx = Math.round(progress * (statItems.length - 1));
      setActiveIdx(Math.max(0, Math.min(statItems.length - 1, idx)));
    };

    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [statItems.length]);

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

  return (
    <div>
      {/* Mobile View (< sm): Horizontal carousel with scroll-snap & active dot indicator */}
      <div className="sm:hidden">
        <div
          ref={scrollerRef}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scroll-pl-5 scroll-pr-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {statItems.map((stat) => (
            <div key={stat.title} className="snap-start flex-[0_0_calc(85%-6px)] min-w-0">
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {statItems.map((stat, i) => (
            <span
              key={stat.title}
              aria-hidden
              className={
                i === activeIdx
                  ? 'h-[5px] w-[16px] rounded-[3px] bg-[var(--accent)] transition-all duration-200'
                  : 'h-[5px] w-[5px] rounded-full bg-[var(--border-strong)] transition-all duration-200'
              }
            />
          ))}
        </div>
      </div>

      {/* Desktop / Tablet View (>= sm): Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}
