'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface BrandLoaderProps {
  message?: string;
}

/**
 * Full-screen auth/loading state. Layout-critical styles are inlined so the screen
 * stays presentable before the stylesheet has loaded.
 */
export default function BrandLoader({ message }: BrandLoaderProps) {
  const { t } = useTranslation();

  return (
    <main
      role="status"
      aria-live="polite"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        padding: '24px',
        backgroundColor: '#FAFAF8',
        color: '#6F6B63',
        fontSize: '13px',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: '@keyframes brand-spin { to { transform: rotate(360deg); } }',
        }}
      />
      <div
        aria-hidden
        style={{
          height: '22px',
          width: '22px',
          borderRadius: '9999px',
          border: '2px solid #DBD7CF',
          borderTopColor: '#0F6B4F',
          animation: 'brand-spin 0.8s linear infinite',
        }}
      />
      <p style={{ margin: 0 }}>{message || t.loaderVerifying}</p>
    </main>
  );
}
