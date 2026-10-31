'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShoppingBag,
  Info,
  Check,
  Trash2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import type { StoreNotification } from '@shop-ai/types';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

const initialNotifications: StoreNotification[] = [
  {
    id: 'n1',
    title: 'New Order Received (#10482)',
    message: 'Customer Olena V. placed an order for 2 items totaling ₴3,800. Delivery to Nova Poshta #42, Kyiv.',
    type: 'order',
    severity: 'success',
    read: false,
    timestamp: '15m ago',
    actionUrl: '/orders',
    actionLabel: 'View Order',
  },
  {
    id: 'n2',
    title: 'Low Stock Alert: Cashmere Oversized Coat',
    message: 'Variant Black / M is down to 2 units in stock. Reorder recommended before stock depletion.',
    type: 'inventory',
    severity: 'warning',
    read: false,
    timestamp: '1h ago',
    actionUrl: '/inventory',
    actionLabel: 'Check Inventory',
  },
  {
    id: 'n3',
    title: 'Telegram Channel Broadcast Synchronized',
    message: 'Automated catalog sync to @shop_channel completed successfully. 12 active products verified.',
    type: 'system',
    severity: 'info',
    read: false,
    timestamp: '3h ago',
    actionUrl: '/telegram-bot',
    actionLabel: 'Bot Settings',
  },
  {
    id: 'n4',
    title: 'Payment Confirmed (#10481)',
    message: 'Payment for order #10481 (₴1,950) was confirmed by customer Dmytro K. Status set to Processing.',
    type: 'order',
    severity: 'success',
    read: true,
    timestamp: '5h ago',
    actionUrl: '/orders',
    actionLabel: 'View Order',
  },
  {
    id: 'n5',
    title: 'Low Stock Alert: Leather Chelsea Boots',
    message: 'Variant Brown / 42 has reached the threshold of 3 units.',
    type: 'inventory',
    severity: 'warning',
    read: true,
    timestamp: 'Yesterday',
    actionUrl: '/inventory',
    actionLabel: 'Check Inventory',
  },
  {
    id: 'n6',
    title: 'Bot Webhook Health Check Passed',
    message: 'Telegram Bot polling and webhook respond within 42ms. Zero queued errors.',
    type: 'system',
    severity: 'info',
    read: true,
    timestamp: '2 days ago',
    actionUrl: '/telegram-bot',
    actionLabel: 'Bot Settings',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<StoreNotification[]>(initialNotifications);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'order' | 'inventory' | 'system'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('store_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications(initialNotifications);
      }
    }
  }, []);

  const saveNotifications = (newList: StoreNotification[]) => {
    setNotifications(newList);
    try {
      localStorage.setItem('store_notifications', JSON.stringify(newList));
    } catch (err) {
      console.error('Failed to persist notifications:', err);
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const markItemAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredList = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getNotificationIcon = (type: StoreNotification['type'], severity: StoreNotification['severity']) => {
    if (type === 'order') {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF5EF] text-[#0F6B4F]">
          <ShoppingBag className="h-4 w-4" />
        </div>
      );
    }
    if (type === 'inventory') {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#FEF6E9] text-[#965A1A]">
          <AlertTriangle className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF2F9] text-[#1E5F8B]">
        <Info className="h-4 w-4" />
      </div>
    );
  };

  const { t, language } = useTranslation();

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8 max-w-[1100px] w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.02em] text-[var(--text)]">
              {t.notificationsTitle}
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[12px] font-semibold text-white">
                {unreadCount} {language === 'uk' ? 'нових' : 'new'}
              </span>
            )}
          </div>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
            {t.notificationsSubtitle}
          </p>
        </div>

        {/* Global Actions */}
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

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAllNotifications}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] shadow-xs transition-colors hover:text-[#B84343] hover:border-[#F7CDCD]"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.clearReadBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--border)]">
        {[
          { key: 'all', label: t.filterAll, count: notifications.length },
          { key: 'unread', label: t.filterUnread, count: unreadCount },
          { key: 'order', label: t.filterOrders, count: notifications.filter((n) => n.type === 'order').length },
          { key: 'inventory', label: t.filterInventory, count: notifications.filter((n) => n.type === 'inventory').length },
          { key: 'system', label: t.filterSystem, count: notifications.filter((n) => n.type === 'system').length },
        ].map((tab) => {
          const isActive = filterType === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key as any)}
              className={`inline-flex items-center gap-2 rounded-t-[8px] px-3.5 py-2 text-[13px] font-semibold transition-all select-none border-b-2 -mb-[1px] ${
                isActive
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-soft)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[11px] font-mono ${
                  isActive
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-tertiary)] mb-3">
            <CheckCircle2 className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <h3 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
            {t.noNotificationsTitle}
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 max-w-[360px]">
            {t.noNotificationsDesc}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.read && markItemAsRead(item.id)}
              className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-[16px] border p-4 sm:p-4.5 transition-all duration-150 cursor-pointer ${
                item.read
                  ? 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-soft)]'
                  : 'border-[var(--accent-line)] bg-[#FAFDFC] hover:bg-[#F3FAF6] shadow-[0_2px_10px_rgba(15,107,79,0.05)]'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {getNotificationIcon(item.type, item.severity)}

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[14px] text-[var(--text)]">{item.title}</span>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />
                    )}
                    <span className="text-[11.5px] text-[var(--text-tertiary)] font-medium">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Right Action & Dismiss */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.actionUrl && (
                  <Link
                    href={item.actionUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[12px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    <span>{item.actionLabel || 'View'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}

                <button
                  type="button"
                  title="Delete notification"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  className="rounded-[6px] p-1.5 text-[var(--text-tertiary)] hover:text-[#B84343] hover:bg-[#FDF1F1] transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
