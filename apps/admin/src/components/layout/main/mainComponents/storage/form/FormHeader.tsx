'use client';

import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';

export interface FormHeaderProps {
  name: string;
  category: string;
  brand: string;
  onBack: () => void;
  onSave?: () => void;
  onPublishTelegram?: () => void;
}

export default function FormHeader({
  name,
  category,
  brand,
  onBack,
  onSave,
  onPublishTelegram,
}: FormHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-[13px] text-[var(--text-tertiary)] mb-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Storage</span>
          </button>
          <span>/</span>
          <span className="font-semibold text-[var(--text)]">
            {name.trim() || 'New product'}
          </span>
        </div>
        <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] text-[var(--text)] tracking-[-0.01em]">
          {name.trim() || 'New product'}
        </h1>
        <p className="font-mono text-[12.5px] sm:text-[13px] text-[var(--text-secondary)] mt-1">
          Draft · {category}
          {brand ? ` · ${brand}` : ''}
        </p>
      </div>

      {/* Header Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onPublishTelegram}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] shadow-sm hover:bg-[var(--surface-soft)] transition-all active:scale-95"
        >
          <Send className="h-3.5 w-3.5 text-[#0088CC]" />
          <span>Publish to Telegram</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all active:scale-95"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
