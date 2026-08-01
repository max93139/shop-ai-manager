'use client';

import React from 'react';

export interface ProductSummaryProps {
  selectedSizes: string[];
  selectedColors: string[];
}

export default function ProductSummary({
  selectedSizes,
  selectedColors,
}: ProductSummaryProps) {
  const variantCount = Math.max(selectedSizes.length, 1) * Math.max(selectedColors.length, 1);

  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col gap-2">
      <h2 className="text-[15px] font-bold text-[var(--text)]">Summary</h2>
      <p className="text-[12px] text-[var(--text-tertiary)] mb-2">
        Live preview of the variant matrix that will be generated.
      </p>

      <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed font-medium">
        <div>
          <strong>
            {selectedSizes.length > 0
              ? selectedSizes.join(' · ')
              : '— no sizes selected —'}
          </strong>
        </div>
        <div>
          {selectedColors.length > 0
            ? selectedColors.join(' · ')
            : '— no colors selected —'}
        </div>
        <div className="mt-2 text-[12px] text-[var(--text-tertiary)] font-semibold">
          {variantCount} variant{variantCount === 1 ? '' : 's'} will be created
        </div>
      </div>
    </div>
  );
}
