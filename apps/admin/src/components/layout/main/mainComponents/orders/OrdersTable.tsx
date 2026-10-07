'use client';

import React from 'react';
import {
  Package,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { AdminOrder, OrderStatus } from '@shop-ai/types';

export interface OrdersTableProps {
  orders: AdminOrder[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onViewOrder: (order: AdminOrder) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

export default function OrdersTable({
  orders,
  loading,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onViewOrder,
  onUpdateStatus,
}: OrdersTableProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-[#FEF6E7] text-[#B87A00] border-[#FBE3B5]',
          label: 'Pending',
          icon: <Clock className="h-3 w-3" />,
        };
      case 'PAID':
        return {
          bg: 'bg-[#E7F2ED] text-[#0F6B4F] border-[#BBE2D1]',
          label: 'Paid',
          icon: <CheckCircle2 className="h-3 w-3" />,
        };
      case 'PROCESSING':
        return {
          bg: 'bg-[#EBF2FC] text-[#1E60B5] border-[#C3DCF8]',
          label: 'Processing',
          icon: <Package className="h-3 w-3" />,
        };
      case 'SHIPPED':
        return {
          bg: 'bg-[#F2EDFB] text-[#6938B8] border-[#D9C8F5]',
          label: 'Shipped',
          icon: <Truck className="h-3 w-3" />,
        };
      case 'DELIVERED':
        return {
          bg: 'bg-[#E7F2ED] text-[#0F6B4F] border-[#BBE2D1]',
          label: 'Delivered',
          icon: <CheckCircle2 className="h-3 w-3" />,
        };
      case 'CANCELLED':
        return {
          bg: 'bg-[#FBECEC] text-[#B84343] border-[#F5C4C4]',
          label: 'Cancelled',
          icon: <AlertCircle className="h-3 w-3" />,
        };
      default:
        return {
          bg: 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border)]',
          label: status,
          icon: null,
        };
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4 animate-pulse border-b border-[var(--border)] last:border-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[var(--surface-soft)]" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 rounded bg-[var(--border)]" />
                <div className="h-3 w-20 rounded bg-[var(--surface-soft)]" />
              </div>
            </div>
            <div className="h-5 w-16 rounded bg-[var(--border)]" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-[var(--border)] bg-[var(--surface)] py-14 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-tertiary)] mb-3">
          <Package className="h-7 w-7" />
        </div>
        <h3 className="text-[16px] font-bold text-[var(--text)]">No orders found</h3>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)] max-w-sm">
          Orders placed by customers in the Telegram store will automatically appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden lg:block overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_8px_rgba(28,27,25,0.02)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)] text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              <th className="py-3.5 px-5">Order #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Delivery</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-[13px]">
            {orders.map((ord) => {
              const badge = getStatusBadge(ord.status);
              const firstItem = ord.items[0];

              return (
                <tr
                  key={ord.id}
                  className="transition-colors hover:bg-[var(--surface-soft)]/60 cursor-pointer"
                  onClick={() => onViewOrder(ord)}
                >
                  {/* Order Number */}
                  <td className="py-4 px-5 font-mono font-bold text-[var(--text)]">
                    {ord.orderNumber}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--text)]">
                        {ord.customerName}
                      </span>
                      {ord.phone && (
                        <span className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {ord.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Delivery Info */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="font-medium text-[var(--text)] truncate">
                        {ord.city || '—'}
                      </span>
                      <span className="text-[11.5px] text-[var(--text-tertiary)] truncate">
                        {ord.postOffice || 'Nova Poshta'}
                      </span>
                    </div>
                  </td>

                  {/* Items Preview */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {firstItem?.image ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.productName}
                          className="h-8 w-8 rounded-[6px] object-cover bg-[var(--surface-sunken)] border border-[var(--border)] shrink-0"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--surface-sunken)] text-[var(--text-tertiary)] shrink-0">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--text)] truncate max-w-[150px]">
                          {firstItem?.productName || 'Item'}
                        </span>
                        <span className="text-[11.5px] text-[var(--text-tertiary)]">
                          {ord.itemsCount} pc{ord.itemsCount === 1 ? '' : 's'} ({ord.items.length} sku)
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-[12px] text-[var(--text-secondary)] whitespace-nowrap">
                    {formatDate(ord.createdAt)}
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 font-bold text-[var(--text)] whitespace-nowrap">
                    {ord.totalAmount.toFixed(2)} ₴
                  </td>

                  {/* Status Dropdown / Badge */}
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateStatus(ord.id, e.target.value as OrderStatus)}
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold focus:outline-none cursor-pointer w-[110px] truncate ${badge.bg}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onViewOrder(ord)}
                      className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1 text-[12px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] transition-all"
                    >
                      <Eye className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card List View (Visible on screens < lg) */}
      <div className="flex flex-col gap-3 lg:hidden">
        {orders.map((ord) => {
          const badge = getStatusBadge(ord.status);
          const firstItem = ord.items[0];

          return (
            <div
              key={ord.id}
              onClick={() => onViewOrder(ord)}
              className="flex flex-col rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 gap-3 shadow-xs active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[13.5px] text-[var(--text)]">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[11.5px] text-[var(--text-tertiary)]">
                    {formatDate(ord.createdAt)}
                  </span>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    value={ord.status}
                    onChange={(e) => onUpdateStatus(ord.id, e.target.value as OrderStatus)}
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold focus:outline-none w-[95px] truncate ${badge.bg}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Location */}
              <div className="flex items-start justify-between text-[13px] gap-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-[var(--text)]">
                    {ord.customerName}
                  </span>
                  {ord.phone && (
                    <span className="text-[12px] text-[var(--text-tertiary)]">
                      {ord.phone}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end text-right">
                  <span className="font-medium text-[var(--text)]">
                    {ord.city || '—'}
                  </span>
                  <span className="text-[11.5px] text-[var(--text-tertiary)] max-w-[140px] truncate">
                    {ord.postOffice || '—'}
                  </span>
                </div>
              </div>

              {/* Product preview & total price */}
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-2.5">
                <div className="flex items-center gap-2">
                  {firstItem?.image ? (
                    <img
                      src={firstItem.image}
                      alt={firstItem.productName}
                      className="h-8 w-8 rounded-[6px] object-cover bg-[var(--surface-sunken)] border border-[var(--border)] shrink-0"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--surface-sunken)] text-[var(--text-tertiary)] shrink-0">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                  <span className="text-[12.5px] text-[var(--text-secondary)] font-medium">
                    {ord.itemsCount} pc{ord.itemsCount === 1 ? '' : 's'} ({ord.items.length} items)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-['Fraunces',Georgia,serif] text-[16px] font-[650] text-[var(--text)]">
                    {ord.totalAmount.toFixed(2)} ₴
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrder(ord);
                    }}
                    className="rounded-[6px] bg-[var(--surface-soft)] p-1.5 text-[var(--text)] hover:bg-[var(--border)]"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-[13px] text-[var(--text-secondary)]">
          <span>
            Showing <strong>{orders.length}</strong> of <strong>{totalCount}</strong> orders
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
