'use client';

import React from 'react';
import type { RevenueBarData } from '@shop-ai/types';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMoney } from '@/utils/format';

export interface RevenueChartProps {
  title?: string;
  peakInfo?: string;
  data?: RevenueBarData[];
  loading?: boolean;
}

export default function RevenueChart({ title, peakInfo, data, loading }: RevenueChartProps) {
  const { t, language, translateDay, translatePeakInfo } = useTranslation();
  const bars = data || [];
  const maxValue = Math.max(...bars.map((b) => b.value), 0);
  const hasSales = maxValue > 0;

  return (
    <section className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5">
        <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
          {title || t.revenueLast7Days}
        </h2>
        {hasSales && peakInfo && (
          <span className="text-[12.5px] text-[var(--text-tertiary)]">{translatePeakInfo(peakInfo)}</span>
        )}
      </div>

      {loading ? (
        <div className="h-[200px] rounded-md bg-[var(--surface-soft)]" aria-hidden />
      ) : !hasSales ? (
        <div className="flex h-[200px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-[var(--border-strong)] text-center">
          <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">{t.chartNoSalesTitle}</p>
          <p className="text-[12.5px] text-[var(--text-tertiary)]">{t.chartNoSalesHint}</p>
        </div>
      ) : (
        <div className="flex h-[200px] items-end justify-between gap-2.5 sm:gap-4">
          {bars.map((bar) => {
            const heightPercent = (bar.value / maxValue) * 100;
            const label = formatMoney(bar.value, language);

            return (
              <div
                key={bar.day}
                className="group relative flex h-full flex-1 flex-col items-center justify-end"
                title={`${translateDay(bar.day)}: ${label}`}
              >
                <div className="pointer-events-none absolute -top-1 z-10 hidden -translate-y-full whitespace-nowrap rounded-sm bg-[var(--text)] px-2 py-1 text-[11px] font-medium text-white group-hover:block">
                  {label}
                </div>
                <div
                  style={{ height: bar.value > 0 ? `max(${heightPercent}%, 3px)` : '1px' }}
                  className={`w-full max-w-[44px] rounded-t-[3px] ${
                    bar.value === 0
                      ? 'bg-[var(--border-strong)]'
                      : bar.isHighlight
                      ? 'bg-[var(--accent)]'
                      : 'bg-[var(--accent-line)] group-hover:bg-[var(--accent)]'
                  }`}
                />
                <span className="mt-2 text-[12px] font-medium text-[var(--text-secondary)]">
                  {translateDay(bar.day)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
