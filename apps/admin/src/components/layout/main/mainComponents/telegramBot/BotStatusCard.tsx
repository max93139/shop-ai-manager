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
  handle,
  uptime,
  messagesToday,
  activeChats,
  isOnline,
}: BotStatusCardProps) {
  const { t, isUk } = useTranslation();
  const localizedUptime = uptime
    ? isUk
      ? uptime.replace(/d\b/g, ' д').replace(/h\b/g, ' год').replace(/m\b/g, ' хв')
      : uptime
    : '—';

  return (
    <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-center justify-between pb-5 border-b border-[var(--border)]">
        <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
          {t.botStatusTitle}
        </h2>
        {isOnline === undefined ? null : isOnline ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-positive-soft px-3 py-1 text-[12px] font-semibold text-positive">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {t.botOnline}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-3 py-1 text-[12px] font-semibold text-danger">
            <span className="h-2 w-2 rounded-full bg-danger" />
            {t.botOffline}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 pt-5">
        <div className="flex flex-col min-w-0">
          <span className="text-[12.5px] text-[var(--text-secondary)] mb-1 truncate">
            {t.botHandleLabel}
          </span>
          <span className="text-[15px] font-semibold text-[var(--text)] truncate">{handle ?? '—'}</span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[12.5px] text-[var(--text-secondary)] mb-1 truncate">
            {t.botUptimeLabel}
          </span>
          <span className="text-[15px] font-semibold text-[var(--text)]">{localizedUptime}</span>
        </div>

        <div className="flex flex-col pt-2 border-t border-[var(--border)] min-w-0">
          <span className="text-[12.5px] text-[var(--text-secondary)] mb-1 truncate">
            {t.botMessagesTodayLabel}
          </span>
          <span className="text-[22px] font-semibold text-[var(--text)] tabular-nums">{messagesToday ?? '—'}</span>
        </div>

        <div className="flex flex-col pt-2 border-t border-[var(--border)] min-w-0">
          <span className="text-[12.5px] text-[var(--text-secondary)] mb-1 truncate">
            {t.botActiveChatsLabel}
          </span>
          <span className="text-[22px] font-semibold text-[var(--text)] tabular-nums">{activeChats ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
