'use client';

import React from 'react';
import type { RevenueBarData } from '@shop-ai/types';

export interface RevenueChartProps {
  title?: string;
  peakInfo?: string;
  data?: RevenueBarData[];
  loading?: boolean;
}

export default function RevenueChart({
  title = 'Revenue, last 7 days',
  peakInfo,
  data,
  loading,
}: RevenueChartProps) {
  const bars = data || [];
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  if (loading || !data || bars.length === 0) {
    return (
      <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)] animate-pulse">
        <div className="flex justify-between pb-6">
          <div className="h-5 w-40 rounded bg-[var(--border)]" />
          <div className="h-4 w-28 rounded bg-[var(--border)]" />
        </div>
        <div className="flex items-end justify-between gap-3 h-[180px] sm:h-[200px] pt-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex-1 rounded-[10px] bg-[var(--surface-soft)] h-[70%]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
      {/* Header: Title & Peak Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-6">
        <h2 className="font-['Fraunces',Georgia,serif] text-[18px] sm:text-[20px] font-[650] tracking-[-0.01em] text-[var(--text)]">
          {title}
        </h2>
        {peakInfo && (
          <span className="text-[12.5px] sm:text-[13px] font-medium text-[var(--text-tertiary)]">
            {peakInfo}
          </span>
        )}
      </div>

      {/* Bar Chart Container */}
      <div className="flex h-[180px] sm:h-[200px] items-end justify-between gap-2.5 sm:gap-4 pt-2">
        {bars.map((bar) => {
          const heightPercent = maxValue > 0 ? Math.round((bar.value / maxValue) * 100) : 10;

          return (
            <div key={bar.day} className="group relative flex flex-1 flex-col items-center h-full justify-end">
              {/* Tooltip on Hover */}
              <div className="pointer-events-none absolute -top-8 z-10 hidden rounded-[6px] bg-[var(--text)] px-2 py-1 text-[11px] font-medium text-white shadow-md group-hover:block transition-all">
                {bar.formattedValue}
              </div>

              {/* Bar Column */}
              <div className="w-full flex-1 flex items-end justify-center">
                <div
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  className={`w-full max-w-[42px] rounded-[10px] transition-all duration-300 group-hover:opacity-90 ${
                    bar.isHighlight
                      ? 'bg-[var(--accent)]'
                      : 'bg-[#E7F2ED] group-hover:bg-[var(--accent-line)]'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span className="mt-3 text-[12px] font-medium text-[var(--text-tertiary)]">
                {bar.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
