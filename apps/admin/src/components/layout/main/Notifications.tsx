'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, ExternalLink, ShoppingBag, Trash2 } from 'lucide-react';
import type { NotificationsResponse, StoreNotification } from '@shop-ai/types';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMoney, formatRelativeTime } from '@/utils/format';

type FilterKey = 'all' | 'unread' | 'order' | 'inventory';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function api(path: string, method = 'GET') {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${apiUrl}${path}`, {
    method,
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

const isOrder = (n: StoreNotification) => n.kind === 'NEW_ORDER';

export default function Notifications() {
  const { t, language } = useTranslation();
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterType, setFilterType] = useState<FilterKey>('all');

  const load = useCallback(async () => {
    try {
      const data: NotificationsResponse = await api('/notifications');
      setNotifications(data.notifications);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (path: string, method: string, optimistic: (list: StoreNotification[]) => StoreNotification[]) => {
    setNotifications(optimistic);
    try {
      await api(path, method);
    } catch {
      await load();
    }
  };

  const markItemAsRead = (id: string) =>
    run(`/notifications/${id}/read`, 'PATCH', (list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllAsRead = () =>
    run('/notifications/read-all', 'PATCH', (list) => list.map((n) => ({ ...n, read: true })));
  const deleteNotification = (id: string) =>
    run(`/notifications/${id}`, 'DELETE', (list) => list.filter((n) => n.id !== id));
  const clearRead = () => run('/notifications/read', 'DELETE', (list) => list.filter((n) => !n.read));

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.length - unreadCount;

  const filteredList = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'order') return isOrder(n);
    if (filterType === 'inventory') return !isOrder(n);
    return true;
  });

  const copyOf = (item: StoreNotification) => {
    if (item.kind === 'NEW_ORDER') {
      return {
        title: fill(t.notifNewOrderTitle, { number: item.data.orderNumber }),
        message:
          fill(t.notifNewOrderMessage, {
            customer: item.data.customerName || '—',
            items: item.data.itemsCount,
            total: formatMoney(item.data.total, language),
          }) + (item.data.city ? ` · ${item.data.city}` : ''),
        actionUrl: '/orders',
        actionLabel: t.notifOpenOrder,
      };
    }
    return {
      title: fill(item.kind === 'OUT_OF_STOCK' ? t.notifOutOfStockTitle : t.notifLowStockTitle, {
        product: item.data.productName,
      }),
      message: fill(t.notifStockMessage, {
        color: item.data.color,
        size: item.data.size,
        stock: item.data.stock,
      }),
      actionUrl: '/inventory',
      actionLabel: t.notifOpenInventory,
    };
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
              {t.notificationsTitle}
            </h1>
            {unreadCount > 0 && (
              <span className="text-[13px] font-medium text-[var(--accent)]">
                {unreadCount} {t.notifNewCount}
              </span>
            )}
          </div>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
            {t.notificationsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-medium text-[var(--text)] shadow-xs transition-colors hover:bg-[var(--surface-soft)]"
            >
              <Check className="h-4 w-4 text-[var(--accent)]" />
              <span>{t.markAllAsReadBtn}</span>
            </button>
          )}

          {readCount > 0 && (
            <button
              type="button"
              onClick={clearRead}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] shadow-xs transition-colors hover:text-danger hover:border-[#F7CDCD]"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.clearReadBtn}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--border)]">
        {(
          [
            { key: 'all', label: t.filterAll, count: notifications.length },
            { key: 'unread', label: t.filterUnread, count: unreadCount },
            { key: 'order', label: t.filterOrders, count: notifications.filter(isOrder).length },
            { key: 'inventory', label: t.filterInventory, count: notifications.filter((n) => !isOrder(n)).length },
          ] as const
        ).map((tab) => {
          const isActive = filterType === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors select-none border-b-2 -mb-[1px] ${
                isActive
                  ? 'border-[var(--text)] text-[var(--text)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
                  isActive ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {t.notifLoadFailed}
        </p>
      )}

      {loading ? (
        <div className="h-40 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]" />
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-tertiary)] mb-3">
            <CheckCircle2 className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <h3 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">{t.noNotificationsTitle}</h3>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 max-w-[360px]">{t.noNotificationsDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          {filteredList.map((item) => {
            const copy = copyOf(item);
            return (
              <div
                key={item.id}
                onClick={() => !item.read && markItemAsRead(item.id)}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-4 sm:px-5 transition-colors hover:bg-[var(--surface-soft)] ${
                  item.read ? '' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className={`mt-0.5 shrink-0 ${isOrder(item) ? 'text-positive' : 'text-warning'}`}>
                    {isOrder(item) ? <ShoppingBag className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[14px] text-[var(--text)] ${item.read ? 'font-medium' : 'font-semibold'}`}>
                        {copy.title}
                      </span>
                      {!item.read && <span className="h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />}
                      <span className="text-[11.5px] text-[var(--text-tertiary)] font-medium">
                        {formatRelativeTime(item.createdAt, language)}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-snug">{copy.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    href={copy.actionUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[12px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    <span>{copy.actionLabel}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    type="button"
                    title={t.notifDelete}
                    aria-label={t.notifDelete}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                    className="rounded-sm p-1.5 text-[var(--text-tertiary)] hover:text-danger hover:bg-danger-soft transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
