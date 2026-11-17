'use client';

import React from 'react';
import { UserRound } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function AuthHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-[22px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[var(--accent-soft)]">
        <UserRound className="h-6 w-6 text-[var(--accent)]" strokeWidth={1.7} />
      </div>

      <h1 className="mb-[6px] text-[26px] font-bold tracking-tight text-[var(--text)]">
        {t.loginWelcomeTitle}
      </h1>
      <p className="mb-[30px] text-[13.5px] text-[var(--text-secondary)]">
        {t.loginSubtitle}
      </p>
    </div>
  );
}
