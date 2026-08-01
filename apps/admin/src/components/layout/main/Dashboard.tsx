'use client';

import React, { useState } from 'react';
import { DashboardHeader, DashboardStats } from './mainComponents/dashboard';
import type { DashboardOverviewData } from '@shop-ai/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    // Hook for export functionality
  };

  const handleNewProduct = () => {
    // Hook for new product creation modal
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
