'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { LatestOrderItem } from '@shop-ai/types';
import { useTranslation } from '@/hooks/useTranslation';

export interface LatestOrdersProps {
  orders?: LatestOrderItem[];
  loading?: boolean;
}

export default function LatestOrders({ orders, loading }: LatestOrdersProps) {
  const { t } = useTranslation();
  const orderList = orders || [];

  const getPaymentBadge = (status: LatestOrderItem['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-positive-soft text-positive';
      case 'Pending':
        return 'bg-warning-soft text-warning';
      case 'Failed':
        return 'bg-danger-soft text-danger';
      default:
        return 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]';
    }
  };

  const getPaymentStatusLabel = (status: LatestOrderItem['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return t.paymentStatusPaid;
      case 'Pending':
        return t.paymentStatusPending;
      case 'Failed':
        return t.paymentStatusFailed;
      default:
        return status;
    }
  };

  const getFulfillmentBadge = (status: LatestOrderItem['fulfillmentStatus']) => {
    switch (status) {
      case 'Processing':
        return 'bg-info-soft text-info';
      case 'Shipped':
        return 'bg-info-soft text-info';
      case 'Unfulfilled':
        return 'bg-warning-soft text-warning';
      case 'Delivered':
        return 'bg-positive-soft text-positive';
      default:
        return 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]';
    }
  };

  const getFulfillmentStatusLabel = (status: LatestOrderItem['fulfillmentStatus']) => {
    switch (status) {
      case 'Processing':
        return t.fulfillmentStatusProcessing;
      case 'Shipped':
        return t.fulfillmentStatusShipped;
      case 'Unfulfilled':
        return t.fulfillmentStatusUnfulfilled;
      case 'Delivered':
        return t.fulfillmentStatusDelivered;
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex justify-between pb-6">
          <div className="h-5 w-36 rounded bg-[var(--border)]" />
          <div className="h-4 w-20 rounded bg-[var(--border)]" />
        </div>
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-full rounded bg-[var(--surface-soft)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-center justify-between pb-5">
        <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
          {t.latestOrdersTitle}
        </h2>
        <Link
          href="/orders"
          className="group inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          <span>{t.viewAllBtn}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {orderList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ShoppingBag className="h-8 w-8 text-[var(--text-tertiary)] mb-2" />
          <p className="text-[14px] font-medium text-[var(--text-secondary)]">{t.noOrdersYet}</p>
          <p className="text-[12px] text-[var(--text-tertiary)]">{t.noOrdersYetSub}</p>
        </div>
      ) : (
        <>
        <ul className="flex flex-col divide-y divide-[var(--border)] sm:hidden">
          {orderList.map((order) => (
            <li key={order.id} className="flex items-start justify-between gap-3 py-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[13.5px] font-medium text-[var(--text)]">{order.customerName}</span>
                <span className="font-mono text-[12px] text-[var(--text-tertiary)]">{order.orderNumber}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-[13.5px] font-semibold tabular-nums text-[var(--text)]">{order.totalAmount}</span>
                <span className="text-[12px] text-[var(--text-secondary)]">
                  {getFulfillmentStatusLabel(order.fulfillmentStatus)}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto no-scrollbar sm:block">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <th className="pb-3 pl-1 font-bold">{t.thOrder}</th>
                <th className="pb-3 font-bold">{t.thCustomer}</th>
                <th className="pb-3 font-bold">{t.thTotal}</th>
                <th className="pb-3 font-bold">{t.thPayment}</th>
                <th className="pb-3 pr-1 font-bold">{t.thFulfillment}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[13.5px]">
              {orderList.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[var(--surface-soft)]">
                  <td className="py-4 pl-1 font-mono font-medium text-[var(--text)]">
                    {order.orderNumber}
                  </td>
                  <td className="py-4 font-medium text-[var(--text)]">
                    {order.customerName}
                  </td>
                  <td className="py-4 font-semibold tabular-nums text-[var(--text)]">
                    {order.totalAmount}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${getPaymentBadge(
                        order.paymentStatus
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="py-4 pr-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${getFulfillmentBadge(
                        order.fulfillmentStatus
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {getFulfillmentStatusLabel(order.fulfillmentStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
