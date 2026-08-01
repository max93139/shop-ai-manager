'use client';

import React from 'react';
import AuthHeader from '../components/auth/AuthHeader';
import AuthCard from '../components/auth/AuthCard';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../provider/authProvider';
import { LogOut, User, ShieldCheck, Loader2 } from 'lucide-react';

export default function Page() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[var(--bg)] p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--accent)]" />
          <div className="text-[13px] font-medium text-[var(--text-secondary)]">
            Verifying authentication...
          </div>
        </div>
      </main>
    );
  }

  if (isAuthenticated && user) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[var(--bg)] p-6">
        <div className="w-full max-w-[500px] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-md)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-[650] text-[var(--text)]">
                  {user.name || 'Store Admin'}
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)]">{user.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11.5px] font-semibold text-[var(--accent)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              {user.role || 'ADMIN'}
            </span>
          </div>

          <div className="my-6 rounded-[var(--radius-sm)] bg-[var(--surface-soft)] p-4 text-[13px] text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text)] mb-1">
              🎉 Authenticated & JWT Protected
            </p>
            You are logged into Shop AI Manager Admin Panel. All API requests are protected via Bearer Token & HTTP-Only cookies.
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-white py-2.5 text-[13.5px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)]"
          >
            <LogOut className="h-4 w-4 text-[var(--text-secondary)]" />
            Log out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--bg)] p-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <AuthHeader />
        <AuthCard>
          <LoginForm />
        </AuthCard>
        <div className="mt-5 text-center text-[12px] text-[var(--text-tertiary)]">
          No account access yet? Contact your store admin.
        </div>
      </div>
    </main>
  );
}
