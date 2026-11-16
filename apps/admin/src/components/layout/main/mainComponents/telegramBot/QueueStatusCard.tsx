'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface QueueStatusCardProps {
  pendingPosts?: number;
  scheduledToday?: number;
  failedCount?: number;
}

export default function QueueStatusCard({
  pendingPosts,
  scheduledToday,
  failedCount,
}: QueueStatusCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)] mb-4">
        {t.queueStatusTitle}
      </h2>

      <div className="divide-y divide-[var(--border)] text-[14px]">
        <div className="flex items-center justify-between py-3 gap-2">
          <span className="text-[var(--text)]">{t.queuePendingPosts}</span>
          <span className="font-semibold text-[var(--text)] tabular-nums">{pendingPosts ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between py-3 gap-2">
          <span className="text-[var(--text)]">{t.queueScheduledToday}</span>
          <span className="font-semibold text-[var(--text)] tabular-nums">{scheduledToday ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between py-3 gap-2">
          <span className="text-[var(--text)]">{t.queueFailedReview}</span>
          <span className={`font-semibold tabular-nums ${failedCount ? 'text-danger' : 'text-[var(--text)]'}`}>{failedCount ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
