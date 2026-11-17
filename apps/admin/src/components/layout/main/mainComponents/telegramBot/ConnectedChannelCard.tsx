'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface ConnectedChannelCardProps {
  channelName?: string;
  channelHandle?: string;
  subscribersCount?: string;
  isConnected?: boolean;
}

export default function ConnectedChannelCard({
  channelName = 'Atelier Store',
  channelHandle = '@atelier.store',
  subscribersCount = '8,412',
  isConnected = true,
}: ConnectedChannelCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
      <h2 className="text-[18px] font-bold tracking-tight text-[var(--text)] mb-4">
        {t.connectedChannelTitle}
      </h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)] shrink-0">
            <Send className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-bold text-[var(--text)] truncate">{channelName}</span>
            <span className="text-[13px] text-[var(--text-secondary)] truncate">
              {channelHandle} · {subscribersCount} {t.subscribersSuffix}
            </span>
          </div>
        </div>

        {isConnected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F2ED] px-3 py-1 text-[12px] font-semibold text-[#0F6B4F] shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0F6B4F]" />
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
