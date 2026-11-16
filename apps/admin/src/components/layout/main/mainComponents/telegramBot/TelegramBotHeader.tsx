'use client';

import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TelegramBotHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col">
        <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
          {t.telegramBotTitle}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
          {t.telegramBotSubtitle}
        </p>
      </div>

      <Link
        href="/settings?tab=telegram"
        className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)] shrink-0 self-start sm:self-auto"
      >
        <Settings className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.8} />
        <span>{t.botSettingsBtn}</span>
      </Link>
    </div>
  );
}
