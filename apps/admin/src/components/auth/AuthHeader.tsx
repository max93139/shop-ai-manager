import React from 'react';
import { UserRound } from 'lucide-react';

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-[22px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[var(--accent-soft)]">
        <UserRound className="h-6 w-6 text-[var(--accent)]" strokeWidth={1.7} />
      </div>

      <h1 className="mb-[6px] font-['Fraunces',Georgia,serif] text-[26px] font-[650] tracking-[-0.01em] text-[var(--text)]">
        Welcome to Admin Panel
      </h1>
      <p className="mb-[30px] text-[13.5px] text-[var(--text-secondary)]">
        Sign in with the account issued by your store admin
      </p>
    </div>
  );
}
