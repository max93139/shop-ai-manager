'use client';

import React from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface OrdersHeaderProps {
  totalOrders: number;
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export default function OrdersHeader({
  totalOrders,
  loading,
  onRefresh,
  onExport,
}: OrdersHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
            {t.ordersTitle}
          </h1>
          <span className="text-[13px] font-medium tabular-nums text-[var(--text-tertiary)]">
            {totalOrders} {t.totalOrdersBadge}
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-secondary)]">
          {t.ordersSubtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{t.refreshBtn}</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{t.exportCsvBtn}</span>
        </button>
      </div>
    </div>
  );
}
