'use client';

import React from 'react';
import StatStrip from '@/components/common/StatStrip';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMoney } from '@/utils/format';

export interface OrdersStatsProps {
  totalRevenue: number;
  statusCounts: {
    all: number;
    active: number;
    archive: number;
    pending: number;
    processing: number;
    paid: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  loading?: boolean;
}

export default function OrdersStats({ totalRevenue, statusCounts, loading = false }: OrdersStatsProps) {
  const { t, language } = useTranslation();

  const inFulfillment = statusCounts.paid + statusCounts.processing + statusCounts.shipped;
  const activeCount = statusCounts.active ?? statusCounts.pending + inFulfillment;
  const archiveCount = statusCounts.archive ?? statusCounts.delivered + statusCounts.cancelled;

  return (
    <StatStrip
      loading={loading}
      items={[
        { label: t.totalRevenueTitle, value: formatMoney(totalRevenue, language), hint: t.fromAllRecordedSales },
        { label: t.activeOrdersTitle, value: String(activeCount), hint: `${inFulfillment} ${t.inFulfillmentSuffix}` },
        { label: t.pendingActionTitle, value: String(statusCounts.pending), hint: t.awaitingConfirmationSubtitle },
        {
          label: t.archivedTitle,
          value: String(archiveCount),
          hint: `${statusCounts.delivered} ${t.deliveredSuffix} · ${statusCounts.cancelled} ${t.cancelledSuffix}`,
        },
      ]}
    />
  );
}
