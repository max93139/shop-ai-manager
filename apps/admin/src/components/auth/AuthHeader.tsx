'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function AuthHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex w-full flex-col">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-white">
          <ShoppingBag className="h-4 w-4" strokeWidth={2} aria-hidden />
        </div>
        <span className="text-[14.5px] font-semibold tracking-tight text-[var(--text)]">Shop AI Manager</span>
      </div>

      <h1 className="mb-1 text-[22px] font-semibold tracking-tight text-[var(--text)]">{t.loginWelcomeTitle}</h1>
      <p className="text-[13.5px] text-[var(--text-secondary)]">{t.loginSubtitle}</p>
    </div>
  );
}
