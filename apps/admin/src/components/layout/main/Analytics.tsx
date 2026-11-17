'use client';

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import type { AnalyticsData } from '@shop-ai/types';
import StatStrip from '@/components/common/StatStrip';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMoney, formatShortDate } from '@/utils/format';

type Timeframe = '7d' | '30d' | '90d' | 'all';
type ChartMetric = 'revenue' | 'orders';

const emptyAnalytics: AnalyticsData = {
  timeframe: '30d',
  summary: { totalRevenue: 0, totalOrders: 0, aov: 0, conversionRate: 0, revenueGrowth: 0, ordersGrowth: 0 },
  revenueTrend: [],
  categories: [],
  topProducts: [],
  cities: [],
  statusBreakdown: { delivered: 0, shipped: 0, processing: 0, paid: 0, pending: 0, cancelled: 0 },
};

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const panelClass = 'flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6';

function PanelHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] pb-4">
      <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">{title}</h2>
      {note && <span className="shrink-0 text-[12px] text-[var(--text-tertiary)]">{note}</span>}
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-[13px] text-[var(--text-tertiary)]">{children}</p>;
}

export default function Analytics() {
  const { t, language, translateCategory } = useTranslation();
  const tr = (uk: string, en: string) => (language === 'uk' ? uk : en);

  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [activeChartMetric, setActiveChartMetric] = useState<ChartMetric>('revenue');
  const [data, setData] = useState<AnalyticsData>(emptyAnalytics);
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${apiUrl}/orders/analytics?period=${timeframe}`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`Analytics request failed with ${res.status}`);

        const resData = await res.json();
        if (isMounted) {
          setData({
            timeframe: resData?.timeframe || timeframe,
            summary: { ...emptyAnalytics.summary, ...(resData?.summary || {}) },
            revenueTrend: resData?.revenueTrend || [],
            categories: resData?.categories || [],
            topProducts: resData?.topProducts || [],
            cities: resData?.cities || [],
            statusBreakdown: { ...emptyAnalytics.statusBreakdown, ...(resData?.statusBreakdown || {}) },
          });
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
        if (isMounted) {
          setData(emptyAnalytics);
          setFailed(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const money = (value: number) => formatMoney(value, language);

  const handleExportCSV = () => {
    const rows: Array<Array<string | number>> = [
      ['Metric', 'Value'],
      ['Total Revenue (UAH)', data.summary.totalRevenue],
      ['Total Orders', data.summary.totalOrders],
      ['Average Order Value (UAH)', data.summary.aov],
      ['Fulfillment Rate (%)', data.summary.conversionRate],
      [],
      ['Top Products', 'Category', 'Quantity Sold', 'Revenue (UAH)'],
      ...data.topProducts.map((p) => [p.name, p.category, p.salesCount, p.revenue]),
      [],
      ['City', 'Orders', 'Revenue (UAH)'],
      ...data.cities.map((c) => [c.city, c.ordersCount, c.totalAmount]),
    ];

    const csv = '﻿' + rows.map((row) => row.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `store-analytics-${timeframe}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const timeframes: Array<[Timeframe, string]> = [
    ['7d', t.timeframe7d],
    ['30d', t.timeframe30d],
    ['90d', t.timeframe90d],
    ['all', t.timeframeYear],
  ];
  const timeframeLabel = timeframes.find(([key]) => key === timeframe)?.[1] ?? '';

  const metricOf = (point: AnalyticsData['revenueTrend'][number]) =>
    activeChartMetric === 'revenue' ? point.revenue : point.orders;
  const trendMax = Math.max(...data.revenueTrend.map(metricOf), 0);
  const formatMetric = (value: number) =>
    activeChartMetric === 'revenue' ? money(value) : `${value} ${tr('замовл.', 'orders')}`;

  const statuses: Array<{ key: keyof AnalyticsData['statusBreakdown']; label: string; dot: string }> = [
    { key: 'pending', label: t.orderStatusPending, dot: 'bg-[var(--text-tertiary)]' },
    { key: 'paid', label: t.orderStatusPaid, dot: 'bg-warning' },
    { key: 'processing', label: t.orderStatusProcessing, dot: 'bg-warning' },
    { key: 'shipped', label: t.orderStatusShipped, dot: 'bg-info' },
    { key: 'delivered', label: t.orderStatusDelivered, dot: 'bg-positive' },
    { key: 'cancelled', label: t.orderStatusCancelled, dot: 'bg-danger' },
  ];
  const statusTotal = statuses.reduce((sum, s) => sum + data.statusBreakdown[s.key], 0);

  const segmentClass = (active: boolean) =>
    `rounded-sm px-3 py-1 font-medium transition-colors select-none ${
      active
        ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
        : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
    }`;

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
            {t.analyticsTitle}
          </h1>
          <p className="mt-0.5 text-[13px] sm:text-[14px] text-[var(--text-secondary)]">{t.analyticsSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md bg-[var(--surface-sunken)] p-1 text-[13px]" role="group">
            {timeframes.map(([period, label]) => (
              <button
                key={period}
                type="button"
                aria-pressed={timeframe === period}
                onClick={() => setTimeframe(period)}
                className={segmentClass(timeframe === period)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            aria-label={t.exportBtn}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-[7px] text-[13px] font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)]"
          >
            <Download className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden />
            <span className="hidden sm:inline">{t.exportBtn}</span>
          </button>
        </div>
      </div>

      {failed && (
        <p role="alert" className="rounded-md border border-[var(--border-strong)] bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {tr(
            'Не вдалося завантажити аналітику. Перевірте з’єднання із сервером і спробуйте ще раз.',
            'Analytics could not be loaded. Check the server connection and try again.'
          )}
        </p>
      )}

      <StatStrip
        loading={loading}
        items={[
          {
            label: t.kpiTotalRevenue,
            value: money(data.summary.totalRevenue),
            delta: data.summary.revenueGrowth,
            hint: tr('до попер. періоду', 'vs prev. period'),
          },
          {
            label: t.kpiTotalOrders,
            value: String(data.summary.totalOrders),
            delta: data.summary.ordersGrowth,
            hint: tr('до попер. періоду', 'vs prev. period'),
          },
          { label: t.kpiAov, value: money(data.summary.aov), hint: tr('на одне замовлення', 'per order') },
          {
            label: t.kpiConversion,
            value: `${data.summary.conversionRate}%`,
            hint: tr('оплачені та доставлені', 'paid and delivered'),
          },
        ]}
      />

      <section className={panelClass}>
        <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">{t.revenueTrendTitle}</h2>
            <p className="text-[12.5px] text-[var(--text-tertiary)]">
              {tr('Період', 'Range')}: {timeframeLabel}
            </p>
          </div>

          <div className="inline-flex self-start rounded-md bg-[var(--surface-sunken)] p-1 text-[12.5px]" role="group">
            <button
              type="button"
              aria-pressed={activeChartMetric === 'revenue'}
              onClick={() => setActiveChartMetric('revenue')}
              className={segmentClass(activeChartMetric === 'revenue')}
            >
              {tr('Виторг', 'Revenue')}
            </button>
            <button
              type="button"
              aria-pressed={activeChartMetric === 'orders'}
              onClick={() => setActiveChartMetric('orders')}
              className={segmentClass(activeChartMetric === 'orders')}
            >
              {tr('Замовлення', 'Orders')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[220px] rounded-md bg-[var(--surface-soft)]" aria-hidden />
        ) : trendMax === 0 ? (
          <div className="flex h-[220px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-[var(--border-strong)] text-center">
            <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">{t.chartNoSalesTitle}</p>
            <p className="text-[12.5px] text-[var(--text-tertiary)]">{t.chartNoSalesHint}</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto no-scrollbar">
            <div
              className="flex h-[220px] items-end gap-2 pt-7 sm:gap-3"
              style={{ minWidth: `${data.revenueTrend.length * 44}px` }}
            >
              {data.revenueTrend.map((point) => {
                const value = metricOf(point);
                const dateLabel = formatShortDate(point.date, language) || point.label;

                return (
                  <div
                    key={point.date}
                    className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    title={`${dateLabel}: ${formatMetric(value)}`}
                  >
                    <div className="pointer-events-none absolute top-0 z-20 hidden whitespace-nowrap rounded-sm bg-[var(--text)] px-2 py-1 text-[11px] font-medium text-white group-hover:block">
                      {formatMetric(value)}
                    </div>
                    <div
                      style={{ height: value > 0 ? `max(${(value / trendMax) * 100}%, 3px)` : '1px' }}
                      className={`w-full max-w-[44px] rounded-t-[3px] ${
                        value === 0
                          ? 'bg-[var(--border-strong)]'
                          : value === trendMax
                          ? 'bg-[var(--accent)]'
                          : 'bg-[var(--accent-line)] group-hover:bg-[var(--accent)]'
                      }`}
                    />
                    <span className="mt-2 w-full truncate text-center text-[11px] text-[var(--text-secondary)]">
                      {dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className={panelClass}>
          <PanelHeader title={t.salesByCategoryTitle} />
          <div className="flex flex-col gap-4 pt-4">
            {data.categories.length === 0 ? (
              <EmptyNote>{tr('Продажів за категоріями ще немає.', 'No category sales in this period.')}</EmptyNote>
            ) : (
              data.categories.map((cat) => (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="truncate font-medium text-[var(--text)]">{translateCategory(cat.name)}</span>
                    <span className="shrink-0 tabular-nums text-[var(--text-secondary)]">
                      {money(cat.revenue)}
                      <span className="ml-2 text-[var(--text-tertiary)]">{cat.percentage}%</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                    <div style={{ width: `${cat.percentage}%` }} className="h-full rounded-full bg-[var(--accent)]" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={panelClass}>
          <PanelHeader
            title={tr('Замовлення за статусами', 'Orders by status')}
            note={`${tr('Усього', 'Total')}: ${statusTotal}`}
          />
          <ul className="flex flex-col divide-y divide-[var(--border)]">
            {statuses.map((status) => {
              const count = data.statusBreakdown[status.key];
              const share = statusTotal > 0 ? Math.round((count / statusTotal) * 100) : 0;
              return (
                <li key={status.key} className="flex items-center gap-3 py-2.5 text-[13px]">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`} aria-hidden />
                  <span className="flex-1 truncate text-[var(--text)]">{status.label}</span>
                  <span className="w-10 text-right tabular-nums text-[var(--text-tertiary)]">{share}%</span>
                  <span className="w-10 text-right font-semibold tabular-nums text-[var(--text)]">{count}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className={`${panelClass} lg:col-span-2`}>
          <PanelHeader title={t.topProductsHeading} note={tr('за виторгом', 'by revenue')} />
          {data.topProducts.length === 0 ? (
            <EmptyNote>{tr('За цей період продажів не було.', 'No product sales in this period.')}</EmptyNote>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    <th className="py-2.5 pr-3 font-semibold">{t.thProduct}</th>
                    <th className="px-3 py-2.5 font-semibold">{t.thCategory}</th>
                    <th className="px-3 py-2.5 text-right font-semibold">{tr('Продано', 'Sold')}</th>
                    <th className="py-2.5 pl-3 text-right font-semibold">{t.thTotal}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {data.topProducts.map((prod, index) => (
                    <tr key={prod.id}>
                      <td className="max-w-[260px] py-3 pr-3 font-medium text-[var(--text)]">
                        <div className="flex items-baseline gap-2">
                          <span className="w-4 shrink-0 tabular-nums text-[var(--text-tertiary)]">{index + 1}</span>
                          <span className="truncate">{prod.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[var(--text-secondary)]">{translateCategory(prod.category)}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-[var(--text)]">{prod.salesCount}</td>
                      <td className="whitespace-nowrap py-3 pl-3 text-right font-semibold tabular-nums text-[var(--text)]">
                        {money(prod.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={panelClass}>
          <PanelHeader title={t.deliveryGeographyTitle} />
          {data.cities.length === 0 ? (
            <EmptyNote>{tr('Даних про доставку за цей період немає.', 'No delivery data in this period.')}</EmptyNote>
          ) : (
            <ul className="flex flex-col divide-y divide-[var(--border)]">
              {data.cities.map((cityItem) => (
                <li key={cityItem.city} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[13.5px] font-medium text-[var(--text)]">{cityItem.city}</span>
                    <span className="text-[12px] text-[var(--text-tertiary)]">
                      {cityItem.ordersCount} {tr('замовл.', 'orders')}
                    </span>
                  </div>
                  <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[var(--text)]">
                    {money(cityItem.totalAmount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
