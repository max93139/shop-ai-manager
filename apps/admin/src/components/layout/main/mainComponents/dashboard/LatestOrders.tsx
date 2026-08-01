'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { LatestOrderItem } from '@shop-ai/types';

export interface LatestOrdersProps {
  orders?: LatestOrderItem[];
  loading?: boolean;
}

export default function LatestOrders({ orders, loading }: LatestOrdersProps) {
  const orderList = orders || [];

  const getPaymentBadge = (status: LatestOrderItem['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#E7F2ED] text-[#0F6B4F]';
      case 'Pending':
        return 'bg-[#FEFCBF] text-[#B7791F]';
      case 'Failed':
        return 'bg-[#FBECEC] text-[#B84343]';
      default:
        return 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]';
    }
  };

  const getFulfillmentBadge = (status: LatestOrderItem['fulfillmentStatus']) => {
    switch (status) {
      case 'Processing':
        return 'bg-[#EBF8FF] text-[#2B6CB0]';
      case 'Shipped':
        return 'bg-[#EBF4FF] text-[#3182CE]';
      case 'Unfulfilled':
        return 'bg-[#FEFCBF] text-[#B7791F]';
      case 'Delivered':
        return 'bg-[#E7F2ED] text-[#0F6B4F]';
      default:
        return 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)] animate-pulse">
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
    <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
      {/* Header: Title & Link */}
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-['Fraunces',Georgia,serif] text-[18px] sm:text-[20px] font-[650] tracking-[-0.01em] text-[var(--text)]">
          Latest orders
        </h2>
        <Link
          href="/orders"
          className="group inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Orders Table Container */}
      {orderList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ShoppingBag className="h-8 w-8 text-[var(--text-tertiary)] mb-2" />
          <p className="text-[14px] font-medium text-[var(--text-secondary)]">No orders yet</p>
          <p className="text-[12px] text-[var(--text-tertiary)]">Orders placed in store will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <th className="pb-3 pl-1 font-bold">Order</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Total</th>
                <th className="pb-3 font-bold">Payment</th>
                <th className="pb-3 pr-1 font-bold">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[13.5px]">
              {orderList.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[var(--surface-soft)]">
                  {/* Order ID */}
                  <td className="py-4 pl-1 font-mono font-bold text-[var(--text)]">
                    {order.orderNumber}
                  </td>

                  {/* Customer */}
                  <td className="py-4 font-medium text-[var(--text)]">
                    {order.customerName}
                  </td>

                  {/* Total */}
                  <td className="py-4 font-semibold text-[var(--text)]">
                    {order.totalAmount}
                  </td>

                  {/* Payment Status */}
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${getPaymentBadge(
                        order.paymentStatus
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Fulfillment Status */}
                  <td className="py-4 pr-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${getFulfillmentBadge(
                        order.fulfillmentStatus
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
