'use client';

import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface StatStripItem {
  label: string;
  value: string;
  /** Signed percentage change against the comparison period. Zero renders as neutral. */
  delta?: number;
  hint?: string;
}

export interface StatStripProps {
  items: StatStripItem[];
  loading?: boolean;
}

function Delta({ delta }: { delta: number }) {
  if (delta === 0) {
    return <span className="font-semibold text-[var(--text-secondary)]">0%</span>;
  }
  const isUp = delta > 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-semibold ${
        isUp ? 'text-positive' : 'text-danger'
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
      {isUp ? '+' : '−'}
      {Math.abs(delta)}%
    </span>
  );
}

/**
 * A single bordered row of key figures separated by hairlines. Two columns on phones,
 * one row from the `lg` breakpoint.
 */
export default function StatStrip({ items, loading = false }: StatStripProps) {
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] gap-px">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-1.5 bg-[var(--surface)] px-4 py-4 sm:px-5">
          <dt className="text-[12.5px] leading-snug font-medium text-[var(--text-secondary)]">
            {item.label}
          </dt>
          <dd className="flex min-w-0 flex-col gap-1">
            {loading ? (
              <span className="my-1 h-6 w-20 rounded-sm bg-[var(--surface-sunken)]" aria-hidden />
            ) : (
              <span className="truncate text-[22px] sm:text-[24px] font-semibold leading-tight tracking-tight tabular-nums text-[var(--text)]">
                {item.value}
              </span>
            )}
            {(item.delta !== undefined || item.hint) && (
              <span className="flex flex-wrap items-center gap-x-1.5 text-[12px] text-[var(--text-tertiary)]">
                {item.delta !== undefined && !loading && <Delta delta={item.delta} />}
                {item.hint && <span>{item.hint}</span>}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
