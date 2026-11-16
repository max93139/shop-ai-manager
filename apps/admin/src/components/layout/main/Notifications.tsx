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

type SeedCopy = Pick<StoreNotification, 'title' | 'message' | 'timestamp' | 'actionLabel'>;

/** Ukrainian copy for the built-in notifications; the English text lives on the records themselves. */
const seedCopyUk: Record<string, SeedCopy> = {
  n1: {
    title: 'Нове замовлення (#10482)',
    message: 'Олена В. оформила замовлення на 2 товари на суму 3 800 ₴. Доставка: Нова Пошта №42, Київ.',
    timestamp: '15 хв тому',
    actionLabel: 'Відкрити замовлення',
  },
  n2: {
    title: 'Мало на складі: Cashmere Oversized Coat',
    message: 'Варіант Black / M: залишилось 2 од. Варто поповнити запас.',
    timestamp: '1 год тому',
    actionLabel: 'Перейти до складу',
  },
  n3: {
    title: 'Канал Telegram синхронізовано',
    message: 'Автоматичну синхронізацію каталогу з @shop_channel завершено. Перевірено 12 активних товарів.',
    timestamp: '3 год тому',
    actionLabel: 'Налаштування бота',
  },
  n4: {
    title: 'Оплату підтверджено (#10481)',
    message: 'Дмитро К. оплатив замовлення #10481 (1 950 ₴). Статус змінено на «В обробці».',
    timestamp: '5 год тому',
    actionLabel: 'Відкрити замовлення',
  },
  n5: {
    title: 'Мало на складі: Leather Chelsea Boots',
    message: 'Варіант Brown / 42 досяг порогу в 3 од.',
    timestamp: 'Учора',
    actionLabel: 'Перейти до складу',
  },
  n6: {
    title: 'Перевірку вебхука бота пройдено',
    message: 'Telegram-бот відповідає за 42 мс. Помилок у черзі немає.',
    timestamp: '2 дні тому',
    actionLabel: 'Налаштування бота',
  },
};

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
        <div className="mt-0.5 shrink-0 text-positive">
          <ShoppingBag className="h-4 w-4" />
        </div>
      );
    }
    if (type === 'inventory') {
      return (
        <div className="mt-0.5 shrink-0 text-warning">
          <AlertTriangle className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="mt-0.5 shrink-0 text-info">
        <Info className="h-4 w-4" />
      </div>
    );
  };

  const { t, language } = useTranslation();
  const copyOf = (item: StoreNotification): SeedCopy =>
    (language === 'uk' && seedCopyUk[item.id]) || item;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
              {t.notificationsTitle}
            </h1>
            {unreadCount > 0 && (
              <span className="text-[13px] font-medium text-[var(--accent)]">
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
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] shadow-xs transition-colors hover:text-danger hover:border-[#F7CDCD]"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.clearReadBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--border)]">
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
              className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors select-none border-b-2 -mb-[1px] ${
                isActive
                  ? 'border-[var(--text)] text-[var(--text)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-tertiary)] mb-3">
            <CheckCircle2 className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <h3 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
            {t.noNotificationsTitle}
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 max-w-[360px]">
            {t.noNotificationsDesc}
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.read && markItemAsRead(item.id)}
              className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-4 sm:px-5 transition-colors hover:bg-[var(--surface-soft)] ${
                item.read ? '' : 'cursor-pointer'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {getNotificationIcon(item.type, item.severity)}

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[14px] text-[var(--text)] ${item.read ? 'font-medium' : 'font-semibold'}`}>{copyOf(item).title}</span>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />
                    )}
                    <span className="text-[11.5px] text-[var(--text-tertiary)] font-medium">
                      {copyOf(item).timestamp}
                    </span>
                  </div>

                  <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-snug">
                    {copyOf(item).message}
                  </p>
                </div>
              </div>

              {/* Right Action & Dismiss */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.actionUrl && (
                  <Link
                    href={item.actionUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[12px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    <span>{copyOf(item).actionLabel || (language === 'uk' ? 'Відкрити' : 'View')}</span>
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
                  className="rounded-sm p-1.5 text-[var(--text-tertiary)] hover:text-danger hover:bg-danger-soft transition-colors"
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
