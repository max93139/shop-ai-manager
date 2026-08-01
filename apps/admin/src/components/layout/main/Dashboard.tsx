'use client';

import React, { useEffect, useState } from 'react';
import {
  DashboardHeader,
  DashboardStats,
  RevenueChart,
  LatestOrders,
} from './mainComponents/dashboard';
import type { DashboardFullData } from '@shop-ai/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardFullData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
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
        console.error('Failed to fetch dashboard data from API:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    // Export handler
  };

  const handleNewProduct = () => {
    // New product modal handler
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
      <DashboardHeader onExport={handleExport} onNewProduct={handleNewProduct} />
      <DashboardStats data={dashboardData?.stats} loading={loading} />
      <RevenueChart
        peakInfo={dashboardData?.revenueChart?.peakInfo}
        data={dashboardData?.revenueChart?.bars}
        loading={loading}
      />
      <LatestOrders orders={dashboardData?.latestOrders} loading={loading} />
    </div>
  );
}
