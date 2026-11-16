'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface ProductSummaryProps {
  selectedSizes: string[];
  selectedColors: string[];
}

export default function ProductSummary({
  selectedSizes,
  selectedColors,
}: ProductSummaryProps) {
  const { t, formatVariantsCreated, translateColor } = useTranslation();
  const variantCount = Math.max(selectedSizes.length, 1) * Math.max(selectedColors.length, 1);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col gap-2">
      <h2 className="text-[15px] font-bold text-[var(--text)]">{t.summaryTitle}</h2>
      <p className="text-[12px] text-[var(--text-tertiary)] mb-2">
        {t.summarySubtitle}
      </p>

      <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed font-medium">
        <div>
          <strong>
            {selectedSizes.length > 0
              ? selectedSizes.join(' · ')
              : t.noSizesSelected}
          </strong>
        </div>
        <div>
          {selectedColors.length > 0
            ? selectedColors.map(translateColor).join(' · ')
            : t.noColorsSelected}
        </div>
        <div className="mt-2 text-[12px] text-[var(--text-tertiary)] font-semibold">
          {formatVariantsCreated(variantCount)}
        </div>
      </div>
    </div>
  );
}
