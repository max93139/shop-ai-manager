'use client';

import React from 'react';
import { Settings } from 'lucide-react';

export interface TelegramBotHeaderProps {
  onBotSettings?: () => void;
}

export default function TelegramBotHeader({ onBotSettings }: TelegramBotHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col">
        <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.01em] text-[var(--text)]">
          Telegram Bot
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
          Manage the assistant connected to your store
        </p>
      </div>

      <button
        type="button"
        onClick={onBotSettings}
        className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] shadow-sm transition-all duration-150 hover:bg-[var(--surface-soft)] active:scale-95 shrink-0 self-start sm:self-auto"
      >
        <Settings className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.8} />
        <span>Bot settings</span>
      </button>
    </div>
  );
}
