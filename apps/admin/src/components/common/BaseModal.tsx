'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidthClass = 'max-w-md',
}: BaseModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 w-full ${maxWidthClass} max-h-[90vh] flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-2xl transition-all duration-150`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 shrink-0 border-b border-[var(--border)] mb-4">
          <div className="min-w-0 pr-2">
            {title && (
              <h3 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[var(--text)] truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5 truncate">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto no-scrollbar flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
