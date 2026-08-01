import React, { type ReactNode } from 'react';

type AuthCardProps = {
  children: ReactNode;
};

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-[28px] shadow-[var(--shadow-md)]">
      {children}
    </div>
  );
}
