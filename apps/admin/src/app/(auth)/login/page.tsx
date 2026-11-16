'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthHeader from '../../../components/auth/AuthHeader';
import AuthCard from '../../../components/auth/AuthCard';
import LoginForm from '../../../components/auth/LoginForm';
import { useAuth } from '../../../provider/authProvider';
import BrandLoader from '../../../components/common/BrandLoader';
import { useTranslation } from '@/hooks/useTranslation';

function LoginContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams?.get('redirect');
  const redirectTarget =
    rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isLoading, isAuthenticated, router, redirectTarget]);

  if (isLoading) {
    return <BrandLoader />;
  }

  if (isAuthenticated) {
    return <BrandLoader />;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--bg)] p-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <AuthHeader />
        <AuthCard>
          <LoginForm onSuccess={() => router.replace(redirectTarget)} />
        </AuthCard>
        <div className="mt-5 text-center text-[12px] text-[var(--text-tertiary)]">
          {t.loginNoAccess}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <LoginContent />
    </Suspense>
  );
}
