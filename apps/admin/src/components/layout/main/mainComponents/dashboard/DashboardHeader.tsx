'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

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

  const formattedDate = new Date().toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });

  const subtitle =
    language === 'uk'
      ? `${t.dashboardSubtitlePrefix} ${storeName} ${t.dashboardSubtitleToday}, ${formattedDate}.`
      : `${t.dashboardSubtitlePrefix} ${storeName} ${t.dashboardSubtitleToday}, ${formattedDate}.`;

  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.01em] text-[var(--text)]">
        {getGreeting()}
      </h1>
      <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
        {subtitle}
      </p>
    </div>
  );
}
