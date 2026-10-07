'use client';

import React from 'react';

export interface DashboardHeaderProps {
  storeName?: string;
}

export default function DashboardHeader({
  storeName = 'Atelier',
}: DashboardHeaderProps) {
  // Determine greeting based on current time of day without user name
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour >= 18) return 'Good evening';
    return 'Good afternoon';
  };

  // Format today's date dynamically (e.g. "Aug 1")
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-1">
      {/* Greeting Title & Date Subtitle */}
      <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.01em] text-[var(--text)]">
        {getGreeting()}
      </h1>
      <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
        Here's what's happening at {storeName} today, {formattedDate}.
      </p>
    </div>
  );
}
