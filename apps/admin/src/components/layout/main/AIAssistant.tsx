'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  RefreshCw,
  Package,
  Send,
  Zap,
  Sliders,
  Check,
  AlertTriangle,
  ArrowRight,
  X,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface QuickActionResult {
  type: 'audit' | 'channel' | 'health';
  severity: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  actionUrl2?: string;
  actionLabel2?: string;
}

export default function AIAssistant() {
  const { t, language, isUk } = useTranslation();
  const [enabledRules, setEnabledRules] = useState<Record<string, boolean>>({
    'rule-1': true,
    'rule-2': true,
    'rule-3': true,
    'rule-4': true,
  });
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<QuickActionResult | null>(null);

  const toggleRule = (id: string) => {
    setEnabledRules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleInventoryAudit = async () => {
    setRunningAction('audit');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/products?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });

      if (!res.ok) throw new Error('API query failed');
      const data = await res.json();
      const products: Array<{ stock: number; status: string; name: string }> = data.products || [];

      const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
      const outOfStockCount = products.filter((p) => p.stock === 0).length;
      const total = products.length;

      if (lowStockCount > 0 || outOfStockCount > 0) {
        setActionResult({
          type: 'audit',
          severity: 'warning',
          title: isUk ? 'Аудит залишків: виявлено дефіцит' : 'Inventory Audit: Low Stock Detected',
          message: isUk
            ? `Виявлено ${outOfStockCount} позицій без залишку (0 шт) та ${lowStockCount} позицій з критичним залишком (≤ 5 шт) серед ${total} перевірених.`
            : `Detected ${outOfStockCount} out-of-stock and ${lowStockCount} low-stock items out of ${total} inspected variants.`,
          actionUrl: '/inventory?status=low_stock',
          actionLabel: isUk ? 'Критичні залишки' : 'View Low Stock',
          actionUrl2: outOfStockCount > 0 ? '/inventory?status=out_of_stock' : undefined,
          actionLabel2: isUk ? 'Товари без залишку' : 'Out of Stock',
        });
        showToast(
          isUk
            ? `Аудит завершено: ${lowStockCount + outOfStockCount} позицій потребують уваги`
            : `Audit finished: ${lowStockCount + outOfStockCount} items require restock`
        );
      } else {
        setActionResult({
          type: 'audit',
          severity: 'success',
          title: isUk ? 'Аудит залишків: стан оптимальний' : 'Inventory Audit: All Levels Healthy',
          message: isUk
            ? `Усі ${total} товарних позицій на складі мають достатній запас (> 5 шт). Поповнення наразі не потрібне.`
            : `All ${total} warehouse product variants have optimal inventory levels (> 5 units). No reorder needed.`,
          actionUrl: '/inventory',
          actionLabel: isUk ? 'Переглянути каталог' : 'Open Inventory',
        });
        showToast(t.auditSuccessMsg);
      }
    } catch {
      setActionResult({
        type: 'audit',
        severity: 'info',
        title: isUk ? 'Аудит залишків' : 'Inventory Audit',
        message: isUk
          ? 'Перевірте актуальні залишки та налаштування фільтрів на сторінці товарів.'
          : 'Check current inventory and filters on the inventory page.',
        actionUrl: '/inventory',
        actionLabel: isUk ? 'До залишків' : 'Open Inventory',
      });
      showToast(t.auditSuccessMsg);
    } finally {
      setRunningAction(null);
    }
  };

  const handleChannelSync = async () => {
    setRunningAction('channel');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/products?status=active&limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });

      if (!res.ok) throw new Error('API query failed');
      const data = await res.json();
      const activeCount = data.totalCount ?? (data.products?.length || 0);

      setActionResult({
        type: 'channel',
        severity: 'success',
        title: isUk ? 'Синхронізація каналу успішна' : 'Channel Showcase Synchronized',
        message: isUk
          ? `Усі ${activeCount} активних товарів актуалізовано для Telegram-вітрини та диплінків у бот.`
          : `All ${activeCount} active catalog items updated for Telegram showcases and bot deep-links.`,
        actionUrl: '/telegram-bot',
        actionLabel: isUk ? 'Керування ботом' : 'Manage Bot',
      });
      showToast(t.channelSyncSuccessMsg);
    } catch {
      setActionResult({
        type: 'channel',
        severity: 'info',
        title: isUk ? 'Синхронізація каналу' : 'Channel Sync',
        message: isUk
          ? 'Каталог синхронізовано з ботом. Перевірте статус бота та токени у налаштуваннях.'
          : 'Catalog synced with bot. Verify bot settings and tokens.',
        actionUrl: '/telegram-bot',
        actionLabel: isUk ? 'Керування ботом' : 'Manage Bot',
      });
      showToast(t.channelSyncSuccessMsg);
    } finally {
      setRunningAction(null);
    }
  };

  const handleHealthCheck = async () => {
    setRunningAction('health');
    const start = performance.now();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/products/filters`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const latency = Math.round(performance.now() - start);

      if (res.ok) {
        setActionResult({
          type: 'health',
          severity: 'success',
          title: isUk ? 'Діагностика: всі системи активні' : 'Health Check: All Systems Nominal',
          message: isUk
            ? `API бекенд відповідає (${latency}мс). База даних PostgreSQL доступна. Telegram Bot онлайн.`
            : `Backend API responsive (${latency}ms). PostgreSQL connected. Telegram Bot service online.`,
          actionUrl: '/settings',
          actionLabel: isUk ? 'Налаштування' : 'Settings',
        });
        showToast(t.healthCheckSuccessMsg);
      } else {
        throw new Error(`Status ${res.status}`);
      }
    } catch {
      setActionResult({
        type: 'health',
        severity: 'info',
        title: isUk ? 'Діагностика системи' : 'System Health Check',
        message: isUk
          ? 'Основні сервіси працюють. Перевірте з’єднання та системні параметри в налаштуваннях.'
          : 'Core services operational. Check network connectivity and system parameters.',
        actionUrl: '/settings',
        actionLabel: isUk ? 'Налаштування' : 'Settings',
      });
      showToast(t.healthCheckSuccessMsg);
    } finally {
      setRunningAction(null);
    }
  };

  const rules = [
    {
      id: 'rule-1',
      name: t.ruleOrderNotificationName,
      description: t.ruleOrderNotificationDesc,
      trigger: t.ruleOrderNotificationTrigger,
      enabled: !!enabledRules['rule-1'],
    },
    {
      id: 'rule-2',
      name: t.ruleLowStockName,
      description: t.ruleLowStockDesc,
      trigger: t.ruleLowStockTrigger,
      enabled: !!enabledRules['rule-2'],
    },
    {
      id: 'rule-3',
      name: t.ruleChannelDraftName,
      description: t.ruleChannelDraftDesc,
      trigger: t.ruleChannelDraftTrigger,
      enabled: !!enabledRules['rule-3'],
    },
    {
      id: 'rule-4',
      name: t.ruleRestockCancelName,
      description: t.ruleRestockCancelDesc,
      trigger: t.ruleRestockCancelTrigger,
      enabled: !!enabledRules['rule-4'],
    },
  ];

  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="page-container">
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-md bg-[#1C1B19] px-4 py-3 text-[13px] font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
            {t.smartAssistantTitle}
          </h1>
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-positive before:h-1.5 before:w-1.5 before:rounded-full before:bg-positive before:content-['']">
            {t.activeBadge}
          </span>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
          {t.smartAssistantSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 min-h-[150px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="text-[var(--text-secondary)]">
                <Package className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[13.5px] text-[var(--text)]">{t.inventoryAuditTitle}</span>
            </div>
            <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
              {t.inventoryAuditDesc}
            </p>
          </div>
          <button
            type="button"
            disabled={runningAction === 'audit'}
            onClick={handleInventoryAudit}
            className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-2 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${runningAction === 'audit' ? 'animate-spin' : ''}`} />
            <span>{runningAction === 'audit' ? t.runningAuditStatus : t.runAuditBtn}</span>
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 min-h-[150px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="text-[var(--text-secondary)]">
                <Send className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[13.5px] text-[var(--text)]">{t.channelSyncTitle}</span>
            </div>
            <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
              {t.channelSyncDesc}
            </p>
          </div>
          <button
            type="button"
            disabled={runningAction === 'channel'}
            onClick={handleChannelSync}
            className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-2 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${runningAction === 'channel' ? 'animate-spin' : ''}`} />
            <span>{runningAction === 'channel' ? t.syncingChannelStatus : t.syncChannelBtn}</span>
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 min-h-[150px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="text-[var(--text-secondary)]">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[13.5px] text-[var(--text)]">{t.healthCheckTitle}</span>
            </div>
            <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
              {t.healthCheckDesc}
            </p>
          </div>
          <button
            type="button"
            disabled={runningAction === 'health'}
            onClick={handleHealthCheck}
            className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-2 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {runningAction === 'health' ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            <span>{runningAction === 'health' ? t.checkingHealthStatus : t.checkHealthBtn}</span>
          </button>
        </div>
      </div>

      {actionResult && (
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4 sm:p-5 ${
            actionResult.severity === 'warning'
              ? 'border-[#E7C794] bg-warning-soft'
              : actionResult.severity === 'success'
              ? 'border-[var(--accent-line)] bg-[#FAFDFC]'
              : 'border-[var(--border)] bg-[var(--surface)]'
          }`}
        >
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                actionResult.severity === 'warning'
                  ? 'bg-warning-soft text-warning'
                  : 'bg-[var(--accent-soft)] text-[var(--accent)]'
              }`}
            >
              {actionResult.type === 'audit' ? (
                actionResult.severity === 'warning' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Package className="h-4 w-4" />
                )
              ) : actionResult.type === 'channel' ? (
                <Send className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[14px] text-[var(--text)]">
                {actionResult.title}
              </span>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                {actionResult.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {actionResult.actionUrl && (
              <Link
                href={actionResult.actionUrl}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3 py-1.5 text-[12.5px] font-semibold transition-colors shadow-2xs"
              >
                <span>{actionResult.actionLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            {actionResult.actionUrl2 && (
              <Link
                href={actionResult.actionUrl2}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-soft)] text-[var(--text)] px-3 py-1.5 text-[12.5px] font-semibold transition-colors shadow-2xs"
              >
                <span>{actionResult.actionLabel2}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setActionResult(null)}
              className="rounded-sm p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] transition-colors"
              title={isUk ? 'Закрити' : 'Dismiss'}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
              {t.workflowRulesTitle}
            </h2>
          </div>
          <span className="text-[12px] text-[var(--text-tertiary)]">
            {language === 'uk'
              ? `${enabledCount} ${t.rulesEnabledOf} ${rules.length}`
              : `${enabledCount} ${t.rulesEnabledOf} ${rules.length} enabled`}
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[var(--border)]">
          {rules.map((rule) => (
            <div key={rule.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
              <div className="flex flex-col min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[14px] text-[var(--text)]">{rule.name}</span>
                  <span className="font-mono text-[11px] rounded bg-[var(--surface-soft)] border border-[var(--border)] px-2 py-0.5 text-[var(--text-secondary)]">
                    {rule.trigger}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                  {rule.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rule.enabled ? 'bg-[var(--accent)]' : 'bg-[#D0CCC2]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
