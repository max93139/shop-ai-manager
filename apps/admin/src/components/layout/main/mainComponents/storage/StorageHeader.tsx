'use client';

import React from 'react';
import { Download, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface StorageHeaderProps {
  totalItems?: number;
  totalCategories?: number;
  onExport?: () => void;
  onAddItem?: () => void;
}

export default function StorageHeader({
  totalItems = 0,
  totalCategories = 0,
  onExport,
  onAddItem,
}: StorageHeaderProps) {
  const { t, formatStorageSubtitle } = useTranslation();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col">
        <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.01em] text-[var(--text)]">
          {t.storageTitle}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
          {formatStorageSubtitle(totalItems, totalCategories)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] shadow-sm transition-all duration-150 hover:bg-[var(--surface-soft)] active:scale-95"
        >
          <Download className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.8} />
          <span>{t.exportBtn}</span>
        </button>

        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[var(--accent-hover)] active:scale-95"
        >
          <Plus className="h-4 w-4 text-white" strokeWidth={2} />
          <span>{t.addProductBtn}</span>
        </button>
      </div>
    </div>
  );
}
