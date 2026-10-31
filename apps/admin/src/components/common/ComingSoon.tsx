'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, ArrowLeft, Receipt, Tag, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface ComingSoonFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ComingSoonProps {
  badge?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: ComingSoonFeature[];
}

export default function ComingSoon({
  badge,
  title,
  description,
  icon,
  features,
}: ComingSoonProps) {
  const { isUk } = useTranslation();

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8 max-w-[900px] w-full mx-auto">
      <div className="relative overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-[var(--shadow-md)] flex flex-col items-center text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] h-[160px] bg-[var(--accent)]/10 blur-[70px] rounded-full"
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[var(--accent-soft)] text-[var(--accent)] mb-4 shadow-2xs">
          {icon}
        </div>

        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
          {badge || (isUk ? 'Скоро у доступі' : 'Coming Soon')}
        </span>

        <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[30px] font-[650] tracking-[-0.02em] text-[var(--text)] mb-2.5 max-w-[600px]">
          {title}
        </h1>

        <p className="max-w-[560px] text-[13.5px] sm:text-[14.5px] text-[var(--text-secondary)] leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2.5 text-[13px] font-semibold shadow-xs transition-colors"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>{isUk ? 'На головну' : 'To Dashboard'}</span>
          </Link>

          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-soft)] text-[var(--text)] px-4 py-2.5 text-[13px] font-semibold shadow-xs transition-colors"
          >
            <Receipt className="h-4 w-4 text-[var(--text-secondary)]" />
            <span>{isUk ? 'Замовлення' : 'Orders'}</span>
          </Link>

          <Link
            href="/storage"
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-soft)] text-[var(--text)] px-4 py-2.5 text-[13px] font-semibold shadow-xs transition-colors"
          >
            <Tag className="h-4 w-4 text-[var(--text-secondary)]" />
            <span>{isUk ? 'Склад і товари' : 'Storage'}</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          <h2 className="font-['Fraunces',Georgia,serif] text-[17px] font-[650] text-[var(--text)]">
            {isUk ? 'Заплановані можливості модуля' : 'Planned Module Capabilities'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4.5 shadow-2xs"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--surface-soft)] text-[var(--accent)]">
                {feat.icon}
              </div>
              <h3 className="font-semibold text-[13.5px] text-[var(--text)]">
                {feat.title}
              </h3>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
