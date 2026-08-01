'use client';

import React, { type ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  timeframe: string;
  icon: ReactNode;
  iconBgClass: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  timeframe,
  icon,
  iconBgClass,
}: StatCardProps) {
  const isIncrease = changeType === 'increase';

  return (
    <div className="flex flex-col justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_2px_8px_rgba(28,27,25,0.03)] transition-all duration-200 hover:shadow-[0_6px_16px_rgba(28,27,25,0.06)]">
      {/* Card Header: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
          {title}
        </span>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconBgClass}`}
        >
          {icon}
        </div>
      </div>

      {/* Metric Value */}
      <div className="my-3 font-['Fraunces',Georgia,serif] text-[26px] sm:text-[30px] font-[650] tracking-[-0.02em] text-[var(--text)]">
        {value}
      </div>

      {/* Trend Percentage & Timeframe */}
      <div className="flex items-center gap-1.5 text-[12.5px]">
        <span
          className={`inline-flex items-center gap-0.5 font-semibold ${
            isIncrease ? 'text-[#0F6B4F]' : 'text-[#B84343]'
          }`}
        >
          {isIncrease ? (
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          )}
          {change}
        </span>
        <span className="text-[var(--text-tertiary)]">{timeframe}</span>
      </div>
    </div>
  );
}
