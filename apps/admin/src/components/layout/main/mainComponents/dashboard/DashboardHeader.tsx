'use client';

import React from 'react';
import { Download, Plus } from 'lucide-react';

export interface DashboardHeaderProps {
  storeName?: string;
  onExport?: () => void;
  onNewProduct?: () => void;
}

export default function DashboardHeader({
  storeName = 'Atelier',
  onExport,
  onNewProduct,
}: DashboardHeaderProps) {
  // Determine greeting based on current time of day without user name
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour >= 18) return 'Good evening';
    return 'Good afternoon';
  };

  // Format today's date dynamically (e.g. "Aug 1")
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Greeting Title & Date Subtitle */}
      <div className="flex flex-col">
        <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.01em] text-[var(--text)]">
          {getGreeting()}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
          Here's what's happening at {storeName} today, {formattedDate}.
        </p>
      </div>

      {/* Header Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] shadow-sm transition-all duration-150 hover:bg-[var(--surface-soft)] active:scale-95"
        >
          <Download className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.8} />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={onNewProduct}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[var(--accent-hover)] active:scale-95"
        >
          <Plus className="h-4 w-4 text-white" strokeWidth={2} />
          <span>New product</span>
        </button>
      </div>
    </div>
  );
}
