'use client';

import React from 'react';
import { DashboardHeader, DashboardStats } from './mainComponents/dashboard';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
      <DashboardHeader />
      <DashboardStats />
    </div>
  );
}
