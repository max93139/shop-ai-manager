'use client';

import React from 'react';
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
  icon?: React.ReactNode;
  features: ComingSoonFeature[];
}

export default function ComingSoon({ badge, title, description, features }: ComingSoonProps) {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="flex max-w-[640px] flex-col gap-2">
        <span className="text-[12.5px] font-medium text-[var(--text-tertiary)]">{badge || t.comingSoonBadge}</span>
        <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">{title}</h1>
        <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">{description}</p>
      </div>

      <section className="max-w-[720px] rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <h2 className="border-b border-[var(--border)] px-5 py-3.5 text-[13px] font-semibold text-[var(--text)]">
          {t.comingSoonPlanned}
        </h2>
        <ul className="divide-y divide-[var(--border)]">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-3.5 px-5 py-4">
              <span className="mt-0.5 shrink-0 text-[var(--text-tertiary)]" aria-hidden>
                {feature.icon}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[14px] font-medium text-[var(--text)]">{feature.title}</span>
                <span className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{feature.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
