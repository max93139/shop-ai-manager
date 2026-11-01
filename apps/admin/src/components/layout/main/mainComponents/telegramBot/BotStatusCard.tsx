'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface BotStatusCardProps {
  handle?: string;
  uptime?: string;
  messagesToday?: number;
  activeChats?: number;
  isOnline?: boolean;
}

export default function BotStatusCard({
  handle = '@atelier_store_bot',
  uptime = '18d 6h',
  messagesToday = 312,
  activeChats = 96,
  isOnline = true,
}: BotStatusCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
      <div className="flex items-center justify-between pb-5 border-b border-[var(--border)]">
        <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
          {t.botStatusTitle}
        </h2>
        {isOnline ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F2ED] px-3 py-1 text-[12px] font-semibold text-[#0F6B4F]">
            <span className="h-2 w-2 rounded-full bg-[#0F6B4F] animate-pulse" />
            {t.botOnline}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBECEC] px-3 py-1 text-[12px] font-semibold text-[#B84343]">
            <span className="h-2 w-2 rounded-full bg-[#B84343]" />
            {t.botOffline}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 pt-5">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1 truncate">
            {t.botHandleLabel}
          </span>
          <span className="text-[15px] font-bold text-[var(--text)] truncate">{handle}</span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1 truncate">
            {t.botUptimeLabel}
          </span>
          <span className="text-[15px] font-bold text-[var(--text)]">{uptime}</span>
        </div>

        <div className="flex flex-col pt-2 border-t border-[var(--border)] min-w-0">
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1 truncate">
            {t.botMessagesTodayLabel}
          </span>
          <span className="text-[24px] font-bold text-[var(--text)] tabular-nums">{messagesToday}</span>
        </div>

        <div className="flex flex-col pt-2 border-t border-[var(--border)] min-w-0">
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1 truncate">
            {t.botActiveChatsLabel}
          </span>
          <span className="text-[24px] font-bold text-[var(--text)] tabular-nums">{activeChats}</span>
        </div>
      </div>
    </div>
  );
}
