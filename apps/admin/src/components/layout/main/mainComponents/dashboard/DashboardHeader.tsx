'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatShortDate } from '@/utils/format';

export interface DashboardHeaderProps {
  storeName?: string;
}

export default function DashboardHeader({
  storeName = 'Atelier',
}: DashboardHeaderProps) {
  const { t, language } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour >= 18) return t.goodEvening;
    return t.goodAfternoon;
  };

  const subtitle = `${t.dashboardSubtitlePrefix} ${storeName} ${t.dashboardSubtitleToday}, ${formatShortDate(new Date(), language)}.`;

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
        {getGreeting()}
      </h1>
      <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
        {subtitle}
      </p>
    </div>
  );
}
