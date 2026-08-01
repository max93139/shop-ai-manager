'use client';

import React, { type ReactNode } from 'react';

interface MainProps {
  children?: ReactNode;
}

export default function Main({ children }: MainProps) {
  return (
    <main className="flex-1 min-w-0 flex flex-col bg-[var(--bg)] overflow-y-auto">
      {children}
    </main>
  );
}
