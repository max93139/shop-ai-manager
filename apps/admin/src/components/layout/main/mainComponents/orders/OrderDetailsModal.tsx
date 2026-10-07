'use client';

import React, { useState } from 'react';
import {
  Package,
  User,
  Phone,
  MapPin,
  Truck,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import BaseModal from '../../../../common/BaseModal';
import { OrderStatus, type AdminOrder } from '@shop-ai/types';

export interface OrderDetailsModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteOrder,
}: OrderDetailsModalProps) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [ttnInput, setTtnInput] = useState(order?.ttn || '');
  const [currentTtn, setCurrentTtn] = useState(order?.ttn || '');
  const [isSavingTtn, setIsSavingTtn] = useState(false);

  if (!order) return null;

  const handleSaveTtn = async () => {
    if (!ttnInput.trim()) return;
    try {
      setIsSavingTtn(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/nova-poshta/orders/${order.id}/ttn`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ttn: ttnInput.trim() }),
      });
      if (res.ok) {
        setCurrentTtn(ttnInput.trim());
        order.ttn = ttnInput.trim();
        await onUpdateStatus(order.id, OrderStatus.SHIPPED);
      }
    } catch (err) {
      console.error('Failed to save TTN:', err);
    } finally {
      setIsSavingTtn(false);
    }
  };

  const handleGenerateTtn = async () => {
    try {
      setIsSavingTtn(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/nova-poshta/orders/${order.id}/create-ttn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ttn) {
          setCurrentTtn(data.ttn);
          setTtnInput(data.ttn);
          order.ttn = data.ttn;
          await onUpdateStatus(order.id, OrderStatus.SHIPPED);
        }
      }
    } catch (err) {
      console.error('Failed to generate TTN:', err);
    } finally {
      setIsSavingTtn(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setUpdating(true);
      await onUpdateStatus(order.id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      try {
        setDeleting(true);
        await onDeleteOrder(order.id);
        onClose();
      } finally {
        setDeleting(false);
      }
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-[#FEF6E7] text-[#B87A00] border-[#FBE3B5]',
          label: 'Pending',
          icon: <Clock className="h-3.5 w-3.5" />,
        };
      case 'PAID':
        return {
          bg: 'bg-[#E7F2ED] text-[#0F6B4F] border-[#BBE2D1]',
          label: 'Paid',
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        };
      case 'PROCESSING':
        return {
          bg: 'bg-[#EBF2FC] text-[#1E60B5] border-[#C3DCF8]',
          label: 'Processing',
          icon: <Package className="h-3.5 w-3.5" />,
        };
      case 'SHIPPED':
        return {
          bg: 'bg-[#F2EDFB] text-[#6938B8] border-[#D9C8F5]',
          label: 'Shipped',
          icon: <Truck className="h-3.5 w-3.5" />,
        };
      case 'DELIVERED':
        return {
          bg: 'bg-[#E7F2ED] text-[#0F6B4F] border-[#BBE2D1]',
          label: 'Delivered',
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        };
      case 'CANCELLED':
        return {
          bg: 'bg-[#FBECEC] text-[#B84343] border-[#F5C4C4]',
          label: 'Cancelled',
          icon: <AlertCircle className="h-3.5 w-3.5" />,
        };
      default:
        return {
          bg: 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border)]',
          label: status,
          icon: null,
        };
    }
  };

  const badge = getStatusBadge(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      description={`Created on ${formattedDate}`}
      maxWidthClass="max-w-3xl"
    >
      <div className="flex flex-col gap-6 pt-2 select-none">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] p-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-semibold text-[var(--text-secondary)]">
              Current Status:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[12px] font-bold ${badge.bg}`}
            >
              {badge.icon}
              <span>{badge.label}</span>
            </span>
          </div>

          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[var(--text-tertiary)]">
              Change status:
            </span>
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1 text-[12.5px] font-semibold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none disabled:opacity-50"
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

        {/* Customer & Delivery Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Details */}
          <div className="flex flex-col gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--text)] border-b border-[var(--border)] pb-2">
              <User className="h-4 w-4 text-[var(--accent)]" />
              <span>Customer Details</span>
            </div>

            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-tertiary)]">Name:</span>
                <span className="font-semibold text-[var(--text)]">{order.customerName}</span>
              </div>

              {order.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-tertiary)]">Phone:</span>
                  <a
                    href={`tel:${order.phone}`}
                    className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] hover:underline"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{order.phone}</span>
                  </a>
                </div>
              )}

              {order.telegramId && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-tertiary)]">Telegram ID:</span>
                  <span className="font-mono text-[12px] text-[var(--text-secondary)]">
                    {order.telegramId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="flex flex-col gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--text)] border-b border-[var(--border)] pb-2">
              <Truck className="h-4 w-4 text-[var(--accent)]" />
              <span>Delivery & Shipping</span>
            </div>

            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-tertiary)]">Carrier:</span>
                <span className="font-semibold text-[var(--text)]">Нова Пошта (Nova Poshta)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--text-tertiary)]">City:</span>
                <span className="font-semibold text-[var(--text)]">{order.city || '—'}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-[var(--text-tertiary)] shrink-0">Branch:</span>
                <span className="font-semibold text-[var(--text)] text-right max-w-[200px]">
                  {order.postOffice || '—'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--border)]">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-tertiary)]">ТТН (Накладна):</span>
                  {currentTtn ? (
                    <a
                      href={`https://tracking.novaposhta.ua/#/uk/cargo/${currentTtn}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono font-bold text-[12px] text-[#0F6B4F] hover:underline"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      <span>{currentTtn}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-[12px] text-[var(--text-tertiary)]">Не згенеровано</span>
                  )}
                </div>

                {!currentTtn && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="text"
                      placeholder="Введіть ТТН або натисніть Створити"
                      value={ttnInput}
                      onChange={(e) => setTtnInput(e.target.value)}
                      className="flex-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-sunken)] px-2.5 py-1 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                    <button
                      type="button"
                      disabled={isSavingTtn || !ttnInput.trim()}
                      onClick={handleSaveTtn}
                      className="rounded-[6px] bg-[var(--accent)] px-2.5 py-1 text-[11.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {isSavingTtn ? '...' : 'Зберегти'}
                    </button>
                    <button
                      type="button"
                      disabled={isSavingTtn}
                      onClick={handleGenerateTtn}
                      className="rounded-[6px] border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-50"
                    >
                      Створити
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[14px] font-bold text-[var(--text)] flex items-center justify-between">
            <span>Ordered Items ({order.itemsCount} pcs)</span>
            <span className="text-[12px] font-semibold text-[var(--text-tertiary)]">
              {order.items.length} unique variant{order.items.length === 1 ? '' : 's'}
            </span>
          </h3>

          <div className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)]">
            <div className="divide-y divide-[var(--border)]">
              {order.items.map((item) => {
                const itemTotal = item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-12 w-12 rounded-[8px] object-cover bg-[var(--surface-sunken)] border border-[var(--border)] shrink-0"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[var(--surface-sunken)] text-[var(--text-tertiary)] border border-[var(--border)] shrink-0">
                          <Package className="h-5 w-5" />
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="text-[13.5px] font-bold text-[var(--text)] truncate">
                          {item.productName}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--text-secondary)] mt-0.5">
                          <span>Color: <strong>{item.color}</strong></span>
                          <span>•</span>
                          <span>Size: <strong>{item.size}</strong></span>
                          {item.sku && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                                {item.sku}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-15 sm:pl-0">
                      <span className="text-[12.5px] font-medium text-[var(--text-secondary)]">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                      <span className="text-[14px] font-bold text-[var(--text)] min-w-[70px] text-right">
                        ${itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Footer */}
            <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <span className="text-[14px] font-bold text-[var(--text)]">Total Amount:</span>
              <span className="font-['Fraunces',Georgia,serif] text-[20px] font-[650] text-[var(--text)]">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[#F5C4C4] bg-[#FBECEC] px-3.5 py-2 text-[12.5px] font-semibold text-[#B84343] hover:bg-[#F8DADA] transition-all disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{deleting ? 'Deleting…' : 'Delete order'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
