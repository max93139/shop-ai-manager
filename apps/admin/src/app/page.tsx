'use client';

import React from 'react';
import AuthHeader from '../components/auth/AuthHeader';
import AuthCard from '../components/auth/AuthCard';
import LoginForm from '../components/auth/LoginForm';
import Layout from '../components/layout';
import { useAuth } from '../provider/authProvider';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth();

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

  if (isAuthenticated) {
    return <Layout />;
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
