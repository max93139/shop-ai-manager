'use client';

import React from 'react';
import { Search, X, Archive } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface OrdersFiltersProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
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
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

export default function OrdersFilters({
  selectedStatus,
  onSelectStatus,
  statusCounts,
  searchQuery,
  onSearchChange,
}: OrdersFiltersProps) {
  const { t } = useTranslation();

  const tabs = [
    { key: 'ACTIVE', label: t.tabActiveOrders, count: statusCounts.active ?? (statusCounts.pending + statusCounts.paid + statusCounts.processing + statusCounts.shipped) },
    { key: 'PENDING', label: t.tabPending, count: statusCounts.pending },
    { key: 'PAID', label: t.tabPaid, count: statusCounts.paid },
    { key: 'PROCESSING', label: t.tabProcessing, count: statusCounts.processing },
    { key: 'SHIPPED', label: t.tabShipped, count: statusCounts.shipped },
    { key: 'ARCHIVE', label: t.tabArchive, count: statusCounts.archive ?? (statusCounts.delivered + statusCounts.cancelled) },
    { key: 'ALL', label: t.tabAllOrders, count: statusCounts.all },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const isSelected = selectedStatus === tab.key;
            const isArchive = tab.key === 'ARCHIVE';

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectStatus(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-all select-none ${
                  isSelected
                    ? isArchive
                      ? 'bg-[#3D3A34] text-white shadow-xs'
                      : 'bg-[var(--accent)] text-white shadow-xs'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]'
                }`}
              >
                {isArchive && <Archive className="h-3.5 w-3.5 opacity-80" />}
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchOrdersPlaceholder}
            className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-8 text-[13px] text-[var(--text)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
