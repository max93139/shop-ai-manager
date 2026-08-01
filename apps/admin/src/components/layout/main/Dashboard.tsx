'use client';

import React, { useEffect, useState } from 'react';
import { DashboardHeader, DashboardStats } from './mainComponents/dashboard';
import type { DashboardOverviewData } from '@shop-ai/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${apiUrl}/orders/stats`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDashboardData(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats from API:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    // Export functionality
  };

  const handleNewProduct = () => {
    // New product modal
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
      <DashboardHeader
        onExport={handleExport}
        onNewProduct={handleNewProduct}
      />
      <DashboardStats data={dashboardData} loading={loading} />
    </div>
  );
}
