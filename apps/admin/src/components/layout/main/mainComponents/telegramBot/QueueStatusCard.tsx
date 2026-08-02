'use client';

import React from 'react';

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
  return (
    <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
      <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)] mb-4">
        Queue status
      </h2>

      <div className="divide-y divide-[var(--border)] text-[14px]">
        <div className="flex items-center justify-between py-3">
          <span className="font-medium text-[var(--text)]">Pending posts</span>
          <span className="font-bold text-[var(--text)]">{pendingPosts}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="font-medium text-[var(--text)]">Scheduled today</span>
          <span className="font-bold text-[var(--text)]">{scheduledToday}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="font-medium text-[var(--text)]">Failed (needs review)</span>
          <span className="font-bold text-[#B84343]">{failedCount}</span>
        </div>
      </div>
    </div>
  );
}
