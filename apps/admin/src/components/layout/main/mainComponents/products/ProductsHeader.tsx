'use client';

import React from 'react';
import { Download, Package } from 'lucide-react';

export interface ProductsHeaderProps {
  totalCount: number;
  loading?: boolean;
}

export default function ProductsHeader({ totalCount, loading }: ProductsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col">
        <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.01em] text-[var(--text)]">
          Products
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
          {loading ? (
            <span className="inline-block h-4 w-32 rounded bg-[var(--border)] animate-pulse" />
          ) : (
            <>{totalCount} product variants in inventory</>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] shadow-sm transition-all duration-150 hover:bg-[var(--surface-soft)] active:scale-95"
        >
          <Download className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.8} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
