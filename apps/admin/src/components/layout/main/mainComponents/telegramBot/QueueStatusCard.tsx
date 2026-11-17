'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface QueueStatusCardProps {
  pendingPosts?: number;
  scheduledToday?: number;
  failedCount?: number;
}

export default function QueueStatusCard({
  pendingPosts = 4,
  scheduledToday = 2,
  failedCount = 1,
}: QueueStatusCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
      <h2 className="text-[18px] font-bold tracking-tight text-[var(--text)] mb-4">
        {t.queueStatusTitle}
      </h2>

      <div className="divide-y divide-[var(--border)] text-[14px]">
        <div className="flex items-center justify-between py-3 gap-2">
          <span className="font-medium text-[var(--text)]">{t.queuePendingPosts}</span>
          <span className="font-bold text-[var(--text)] tabular-nums">{pendingPosts}</span>
        </div>
        <div className="flex items-center justify-between py-3 gap-2">
          <span className="font-medium text-[var(--text)]">{t.queueScheduledToday}</span>
          <span className="font-bold text-[var(--text)] tabular-nums">{scheduledToday}</span>
        </div>
        <div className="flex items-center justify-between py-3 gap-2">
          <span className="font-medium text-[var(--text)]">{t.queueFailedReview}</span>
          <span className="font-bold text-[#B84343] tabular-nums">{failedCount}</span>
        </div>
      </div>
    </div>
  );
}
