'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/layout';
import { useAuth } from '../provider/authProvider';
import BrandLoader from '../components/common/BrandLoader';

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <BrandLoader message="Verifying authentication..." />;
  }

  if (isAuthenticated) {
    return <Layout />;
  }

  return <BrandLoader message="Redirecting to login..." />;
}
