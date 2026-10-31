'use client';

import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

interface BrandLoaderProps {
  message?: string;
  subMessage?: string;
}

export default function BrandLoader({
  message = 'Verifying authentication...',
  subMessage = 'Protected Session',
}: BrandLoaderProps) {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center p-6 select-none bg-[var(--bg)]"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#FAFAF8',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes brand-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `,
        }}
      />
      <div
        className="relative flex w-full max-w-[340px] flex-col items-center text-center rounded-[28px] border border-white/80 bg-white/75 p-8 sm:p-9 backdrop-blur-2xl transition-all"
        style={{
          maxWidth: '340px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: '28px',
          backgroundColor: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(24px) saturate(190%)',
          WebkitBackdropFilter: 'blur(24px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          boxShadow:
            '0 20px 48px -12px rgba(28, 27, 25, 0.08), 0 1px 2px rgba(28, 27, 25, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
          padding: '36px 32px',
        }}
      >
        <div
          className="relative mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] text-white shadow-md"
          style={{
            height: '56px',
            width: '56px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #148362 0%, #0B523C 100%)',
            boxShadow: '0 10px 24px -4px rgba(15, 107, 79, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            marginBottom: '20px',
          }}
        >
          <ShoppingBag className="h-6 w-6 text-white" strokeWidth={2} />
        </div>

        <h1
          className="mb-1 text-[18px] font-semibold tracking-[-0.01em] text-[var(--text)]"
          style={{
            fontSize: '18px',
            fontWeight: 650,
            color: '#1C1B19',
            fontFamily: "'Fraunces', Georgia, serif",
            margin: '0 0 6px 0',
          }}
        >
          Shop AI Manager
        </h1>

        <div
          className="my-5 flex items-center justify-center"
          style={{ margin: '20px 0' }}
        >
          <div
            className="h-8 w-8 rounded-full border-2 border-[var(--accent)]/20 border-t-[var(--accent)] animate-spin"
            style={{
              height: '32px',
              width: '32px',
              borderRadius: '9999px',
              borderWidth: '2.5px',
              borderStyle: 'solid',
              borderColor: 'rgba(15, 107, 79, 0.18)',
              borderTopColor: '#0F6B4F',
              animation: 'brand-spin 0.8s linear infinite',
            }}
          />
        </div>

        <p
          className="text-[13px] font-medium text-[var(--text-secondary)]"
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#6F6B63',
            margin: '0 0 16px 0',
          }}
        >
          {message}
        </p>

        <div
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--accent)]"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '9999px',
            backgroundColor: '#E7F2ED',
            color: '#0F6B4F',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
          <span>{subMessage}</span>
        </div>
      </div>
    </main>
  );
}
