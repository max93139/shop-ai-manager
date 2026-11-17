'use client';

import React from 'react';
import type { DashboardOverviewData, DashboardStatMetric } from '@shop-ai/types';
import StatStrip, { type StatStripItem } from '@/components/common/StatStrip';
import { useTranslation } from '@/hooks/useTranslation';

export interface DashboardStatsProps {
  data?: DashboardOverviewData | null;
  loading?: boolean;
}

/** Undefined when the API has nothing to compare with, so no delta is shown instead of a fake 0%. */
const toDelta = (metric?: DashboardStatMetric): number | undefined => {
  const magnitude = Math.abs(parseFloat(metric?.change ?? ''));
  if (!Number.isFinite(magnitude)) return undefined;
  return metric?.changeType === 'decrease' ? -magnitude : magnitude;
};

export default function DashboardStats({ data, loading }: DashboardStatsProps) {
  const { t } = useTranslation();

  const metrics: Array<[string, DashboardStatMetric | undefined, string]> = [
    [t.statTodaySales, data?.todaySales, t.statVsYesterday],
    [t.statRevenue30d, data?.revenue30d, t.statVsLastMonth],
    [t.statOrders, data?.orders, t.statVsYesterday],
    [t.statNewCustomers, data?.newCustomers, t.statVsLastMonth],
  ];

  const items: StatStripItem[] = metrics.map(([label, metric, hint]) => ({
    label,
    value: metric?.value ?? '—',
    delta: toDelta(metric),
    hint,
  }));

  return <StatStrip items={items} loading={loading} />;
}
