'use client';

import React, { useEffect } from 'react';
import { notFound, usePathname, useRouter } from 'next/navigation';
import Layout from '../../components/layout';
import { useAuth } from '../../provider/authProvider';
import BrandLoader from '../../components/common/BrandLoader';

export default function CatchAllPage({
  params,
}: {
  params?: { slug?: string[] };
}) {
  const slug = params?.slug;
  const first = slug?.[0];
  const last = slug?.[slug.length - 1];

  if (first === '_next' || first === 'api' || (last && last.includes('.'))) {
    notFound();
  }

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login';
      router.replace(redirectUrl);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return <BrandLoader message="Verifying authentication..." />;
  }

  if (isAuthenticated) {
    return <Layout />;
  }

  return <BrandLoader message="Redirecting to login..." />;
}
