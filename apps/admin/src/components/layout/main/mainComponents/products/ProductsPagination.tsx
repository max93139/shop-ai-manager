'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProductsPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function ProductsPagination({
  page,
  totalPages,
  totalCount,
  limit,
  onPageChange,
}: ProductsPaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-[var(--text-tertiary)]">
          Showing 1–{totalCount} of {totalCount}
        </span>
      </div>
    );
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  // Calculate which page buttons to show
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) pages.push('ellipsis');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('ellipsis');

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
      <span className="text-[13px] text-[var(--text-tertiary)] order-2 sm:order-1">
        Showing {startItem}–{endItem} of {totalCount}
      </span>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous */}
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center justify-center h-8 w-8 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] shadow-sm transition-all hover:bg-[var(--surface-soft)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((p, idx) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex items-center justify-center h-8 w-8 text-[13px] text-[var(--text-tertiary)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex items-center justify-center h-8 min-w-[32px] px-1 rounded-[var(--radius-sm)] text-[13px] font-semibold transition-all ${
                p === page
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center justify-center h-8 w-8 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] shadow-sm transition-all hover:bg-[var(--surface-soft)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
