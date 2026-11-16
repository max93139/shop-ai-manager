'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface ConnectedChannelCardProps {
  channelName?: string;
  channelHandle?: string;
  subscribersCount?: string;
  isConnected?: boolean;
}

export default function ConnectedChannelCard({
  channelName,
  channelHandle,
  subscribersCount,
  isConnected,
}: ConnectedChannelCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)] mb-4">
        {t.connectedChannelTitle}
      </h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 ">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-[var(--text)] truncate">{channelName ?? '—'}</span>
            <span className="text-[13px] text-[var(--text-secondary)] truncate">
              {channelHandle ? `${channelHandle} · ${subscribersCount ?? '—'} ${t.subscribersSuffix}` : '—'}
            </span>
          </div>
        </div>

        {isConnected === undefined ? null : isConnected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-positive-soft px-3 py-1 text-[12px] font-semibold text-positive shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t.channelConnected}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-sunken)] px-3 py-1 text-[12px] font-semibold text-[var(--text-secondary)] shrink-0">
            {t.channelDisconnected}
          </span>
        )}
      </div>
    </div>
  );
}
