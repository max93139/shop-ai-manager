'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Percent,
  Download,
  Calendar,
  Layers,
  MapPin,
  PackageCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
} from 'lucide-react';
import type { AnalyticsData } from '@shop-ai/types';
import { useTranslation } from '@/hooks/useTranslation';

const defaultAnalyticsData: AnalyticsData = {
  timeframe: '30d',
  summary: {
    totalRevenue: 284500,
    totalOrders: 142,
    aov: 2004,
    conversionRate: 88.5,
    revenueGrowth: 16.4,
    ordersGrowth: 9.2,
  },
  revenueTrend: [
    { date: '2026-09-08', label: '8 Sep', revenue: 14200, orders: 7 },
    { date: '2026-09-11', label: '11 Sep', revenue: 19800, orders: 10 },
    { date: '2026-09-14', label: '14 Sep', revenue: 22400, orders: 11 },
    { date: '2026-09-17', label: '17 Sep', revenue: 18100, orders: 9 },
    { date: '2026-09-20', label: '20 Sep', revenue: 26500, orders: 13 },
    { date: '2026-09-23', label: '23 Sep', revenue: 31200, orders: 15 },
    { date: '2026-09-26', label: '26 Sep', revenue: 24300, orders: 12 },
    { date: '2026-09-29', label: '29 Sep', revenue: 28900, orders: 14 },
    { date: '2026-10-02', label: '2 Oct', revenue: 38600, orders: 19 },
    { date: '2026-10-05', label: '5 Oct', revenue: 42100, orders: 21 },
    { date: '2026-10-07', label: '7 Oct', revenue: 48300, orders: 21 },
  ],
  categories: [
    { name: 'Outerwear', revenue: 118400, percentage: 41.6 },
    { name: 'Knitwear', revenue: 76800, percentage: 27.0 },
    { name: 'Footwear', revenue: 54100, percentage: 19.0 },
    { name: 'Accessories', revenue: 35200, percentage: 12.4 },
  ],
  topProducts: [
    { id: '1', name: 'Cashmere Oversized Coat', category: 'Outerwear', salesCount: 38, revenue: 98800 },
    { id: '2', name: 'Merino Wool Turtleneck', category: 'Knitwear', salesCount: 46, revenue: 55200 },
    { id: '3', name: 'Leather Chelsea Boots', category: 'Footwear', salesCount: 24, revenue: 48000 },
    { id: '4', name: 'Minimalist Tote Bag', category: 'Accessories', salesCount: 32, revenue: 28800 },
    { id: '5', name: 'Alpaca Blend Cardigan', category: 'Knitwear', salesCount: 18, revenue: 21600 },
  ],
  cities: [
    { city: 'Kyiv', ordersCount: 68, totalAmount: 136000 },
    { city: 'Lviv', ordersCount: 34, totalAmount: 68000 },
    { city: 'Odesa', ordersCount: 19, totalAmount: 38000 },
    { city: 'Dnipro', ordersCount: 12, totalAmount: 24000 },
    { city: 'Kharkiv', ordersCount: 9, totalAmount: 18500 },
  ],
  statusBreakdown: {
    delivered: 92,
    shipped: 24,
    processing: 14,
    paid: 8,
    pending: 4,
    cancelled: 2,
  },
};

export default function Analytics() {
  const { t, language } = useTranslation();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeChartMetric, setActiveChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const [data, setData] = useState<AnalyticsData>(defaultAnalyticsData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${apiUrl}/orders/analytics?period=${timeframe}`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (res.ok) {
          const resData = await res.json();
          if (isMounted && resData) {
            setData({
              timeframe: resData.timeframe || timeframe,
              summary: {
                totalRevenue: resData.summary?.totalRevenue ?? 0,
                totalOrders: resData.summary?.totalOrders ?? 0,
                aov: resData.summary?.aov ?? 0,
                conversionRate: resData.summary?.conversionRate ?? 0,
                revenueGrowth: resData.summary?.revenueGrowth ?? 0,
                ordersGrowth: resData.summary?.ordersGrowth ?? 0,
              },
              revenueTrend:
                resData.revenueTrend && resData.revenueTrend.length > 0
                  ? resData.revenueTrend
                  : defaultAnalyticsData.revenueTrend,
              categories: resData.categories || [],
              topProducts: resData.topProducts || [],
              cities: resData.cities || [],
              statusBreakdown: resData.statusBreakdown || defaultAnalyticsData.statusBreakdown,
            });
          }
        }
      } catch (err) {
        console.warn('Using baseline analytics store data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const formatCurrency = (val: number) => {
    return `₴${val.toLocaleString('uk-UA')}`;
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Revenue', formatCurrency(data.summary.totalRevenue)],
      ['Total Orders', data.summary.totalOrders.toString()],
      ['Average Order Value', formatCurrency(data.summary.aov)],
      ['Fulfillment Rate', `${data.summary.conversionRate}%`],
      [],
      ['Top Products', 'Category', 'Quantity Sold', 'Revenue'],
      ...data.topProducts.map((p) => [p.name, p.category, p.salesCount.toString(), formatCurrency(p.revenue)]),
      [],
      ['City', 'Orders', 'Revenue'],
      ...data.cities.map((c) => [c.city, c.ordersCount.toString(), formatCurrency(c.totalAmount)]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + csvRows.map((row) => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `store-analytics-${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const trendMax = Math.max(
    ...data.revenueTrend.map((t) => (activeChartMetric === 'revenue' ? t.revenue : t.orders)),
    1
  );

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8 max-w-[1400px] w-full mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[var(--text)]">
            {t.analyticsTitle}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
            {t.analyticsSubtitle}
          </p>
        </div>

        {/* Controls: Timeframe & Export */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-1 text-[13px]">
            {(['7d', '30d', '90d', 'all'] as const).map((period) => {
              const label =
                period === '7d'
                  ? t.timeframe7d
                  : period === '30d'
                  ? t.timeframe30d
                  : period === '90d'
                  ? t.timeframe90d
                  : t.timeframeYear;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => setTimeframe(period)}
                  className={`rounded-[6px] px-3 py-1 font-medium transition-colors select-none ${
                    timeframe === period
                      ? 'bg-[var(--accent)] text-white shadow-xs font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] shadow-xs transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t.exportBtn}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="flex flex-col justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{t.kpiTotalRevenue}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="my-3 font-sans text-[26px] sm:text-[28px] font-bold tracking-tight tabular-nums text-[var(--text)]">
            {loading ? '...' : formatCurrency(data.summary.totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] flex-wrap">
            {data.summary.revenueGrowth >= 0 ? (
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#0F6B4F]">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{data.summary.revenueGrowth}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#B84343]">
                <ArrowDownRight className="h-3.5 w-3.5" />
                {data.summary.revenueGrowth}%
              </span>
            )}
            <span className="text-[var(--text-tertiary)]">{language === 'uk' ? 'до мин. періоду' : 'vs prev period'}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_2px_8px_rgba(28,27,25,0.03)] min-h-[148px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{t.kpiTotalOrders}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EBF2F9] text-[#1E5F8B]">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="my-3 font-sans text-[26px] sm:text-[28px] font-bold tracking-tight tabular-nums text-[var(--text)]">
            {loading ? '...' : data.summary.totalOrders}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] flex-wrap">
            {data.summary.ordersGrowth >= 0 ? (
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#0F6B4F]">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{data.summary.ordersGrowth}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#B84343]">
                <ArrowDownRight className="h-3.5 w-3.5" />
                {data.summary.ordersGrowth}%
              </span>
            )}
            <span className="text-[var(--text-tertiary)]">{language === 'uk' ? 'до мин. періоду' : 'vs prev period'}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_2px_8px_rgba(28,27,25,0.03)] min-h-[148px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{t.kpiAov}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F4F1EA] text-[#63553A]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="my-3 font-sans text-[26px] sm:text-[28px] font-bold tracking-tight tabular-nums text-[var(--text)]">
            {loading ? '...' : formatCurrency(data.summary.aov)}
          </div>
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="text-[var(--text-tertiary)]">{language === 'uk' ? 'Середній чек замовлення' : 'Avg order value'}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_2px_8px_rgba(28,27,25,0.03)] min-h-[148px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{t.kpiConversion}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EAF5EF] text-[#0F6B4F]">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="my-3 font-sans text-[26px] sm:text-[28px] font-bold tracking-tight tabular-nums text-[var(--text)]">
            {loading ? '...' : `${data.summary.conversionRate}%`}
          </div>
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="text-[var(--text-tertiary)]">{language === 'uk' ? 'Оплачені та доставлені' : 'Delivered & paid'}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[var(--text)]">
              {t.revenueTrendTitle}
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)]">
              {language === 'uk'
                ? `Динаміка показників за обраний період (${timeframe.toUpperCase()})`
                : `Interactive timeline for selected range (${timeframe.toUpperCase()})`}
            </p>
          </div>

          <div className="inline-flex rounded-[8px] bg-[var(--surface-soft)] p-1 text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveChartMetric('revenue')}
              className={`rounded-[6px] px-3 py-1 transition-colors ${
                activeChartMetric === 'revenue'
                  ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {language === 'uk' ? 'Виторг (₴)' : 'Revenue (₴)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric('orders')}
              className={`rounded-[6px] px-3 py-1 transition-colors ${
                activeChartMetric === 'orders'
                  ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {language === 'uk' ? 'Кількість замовлень' : 'Order Count'}
            </button>
          </div>
        </div>

        {/* Dynamic Bars */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
          <div className="flex h-[200px] sm:h-[230px] items-end justify-between gap-2 sm:gap-3 pt-6 pb-2 min-w-[500px] sm:min-w-0">
            {data.revenueTrend.map((point) => {
              const currentVal = activeChartMetric === 'revenue' ? point.revenue : point.orders;
              const heightPercent = trendMax > 0 ? Math.max(12, Math.round((currentVal / trendMax) * 100)) : 15;
              const isHighest = currentVal === trendMax;

              return (
                <div key={point.date} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-10 z-20 hidden rounded-[6px] bg-[var(--text)] px-2.5 py-1 text-[11px] font-medium text-white shadow-md group-hover:block whitespace-nowrap transition-all">
                    <span className="font-semibold">{point.label}</span>: {activeChartMetric === 'revenue' ? formatCurrency(point.revenue) : `${point.orders} orders`}
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[42px] rounded-t-[7px] transition-all duration-300 ${
                      isHighest
                        ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
                        : 'bg-[#DCD8CF] hover:bg-[#C9C3B6]'
                    }`}
                  />

                  {/* Day Label */}
                  <span className="mt-2 text-[11px] font-medium text-[var(--text-secondary)] truncate">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Categories Breakdown & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Categories Distribution */}
        <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="text-[17px] font-bold tracking-tight text-[var(--text)]">
                {t.salesByCategoryTitle}
              </h3>
            </div>
            <span className="text-[12px] text-[var(--text-tertiary)]">
              {data.categories.length} {language === 'uk' ? 'активних категорій' : 'active groups'}
            </span>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            {data.categories.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-[var(--text-tertiary)]">
                {language === 'uk' ? 'Продажів за категоріями не зафіксовано.' : 'No category sales recorded in this period.'}
              </p>
            ) : (
              data.categories.map((cat) => (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[var(--text)]">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-secondary)]">{formatCurrency(cat.revenue)}</span>
                      <span className="font-mono text-[11.5px] font-semibold text-[var(--text-tertiary)]">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--surface-soft)] overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fulfillment Status Funnel */}
        <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="text-[17px] font-bold tracking-tight text-[var(--text)]">
                {language === 'uk' ? 'Статуси виконання замовлень' : 'Order Fulfillment Status'}
              </h3>
            </div>
            <span className="text-[12px] text-[var(--text-tertiary)]">{language === 'uk' ? 'Життєвий цикл' : 'Real-time lifecycle'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            <div className="flex flex-col p-3 rounded-[12px] bg-[#EAF5EF] border border-[#BFDDD0]">
              <span className="text-[11.5px] font-semibold uppercase text-[#0F6B4F]">{t.orderStatusDelivered}</span>
              <span className="font-sans text-[22px] font-bold tabular-nums text-[#0F6B4F] mt-1">
                {data.statusBreakdown.delivered}
              </span>
              <span className="text-[11px] text-[#0F6B4F]/80">{language === 'uk' ? 'Виконано' : 'Completed orders'}</span>
            </div>

            <div className="flex flex-col p-3 rounded-[12px] bg-[#EBF2F9] border border-[#BDD6EC]">
              <span className="text-[11.5px] font-semibold uppercase text-[#1E5F8B]">{t.orderStatusShipped}</span>
              <span className="font-sans text-[22px] font-bold tabular-nums text-[#1E5F8B] mt-1">
                {data.statusBreakdown.shipped}
              </span>
              <span className="text-[11px] text-[#1E5F8B]/80">{language === 'uk' ? 'В дорозі' : 'In transit'}</span>
            </div>

            <div className="flex flex-col p-3 rounded-[12px] bg-[#FEF6E9] border border-[#F5DCB7]">
              <span className="text-[11.5px] font-semibold uppercase text-[#965A1A]">{t.orderStatusProcessing}</span>
              <span className="font-sans text-[22px] font-bold tabular-nums text-[#965A1A] mt-1">
                {data.statusBreakdown.processing}
              </span>
              <span className="text-[11px] text-[#965A1A]/80">{language === 'uk' ? 'Комплектується' : 'Being packed'}</span>
            </div>

            <div className="flex flex-col p-3 rounded-[12px] bg-[#F4F1EA] border border-[#DDD7C9]">
              <span className="text-[11.5px] font-semibold uppercase text-[#544B36]">{t.orderStatusPaid}</span>
              <span className="font-sans text-[22px] font-bold tabular-nums text-[#544B36] mt-1">
                {data.statusBreakdown.paid}
              </span>
              <span className="text-[11px] text-[#544B36]/80">{language === 'uk' ? 'Очікує пакування' : 'Awaiting packing'}</span>
            </div>

            <div className="flex flex-col p-3 rounded-[12px] bg-[#F8F7F5] border border-[var(--border)]">
              <span className="text-[11.5px] font-semibold uppercase text-[var(--text-secondary)]">{t.orderStatusPending}</span>
              <span className="font-sans text-[22px] font-bold tabular-nums text-[var(--text)] mt-1">
                {data.statusBreakdown.pending}
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)]">{language === 'uk' ? 'Нові замовлення' : 'New checkouts'}</span>
            </div>

            <div className="flex flex-col p-3 rounded-[12px] bg-[#FDF1F1] border border-[#F7CDCD]">
              <span className="text-[11.5px] font-semibold uppercase text-[#B84343]">{t.orderStatusCancelled}</span>
              <span className="font-sans text-[22px] font-bold tabular-nums text-[#B84343] mt-1">
                {data.statusBreakdown.cancelled}
              </span>
              <span className="text-[11px] text-[#B84343]/80">{language === 'uk' ? 'Скасовано' : 'Returned/declined'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Top Selling Products & Delivery Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Top Selling Products (2 columns wide) */}
        <div className="lg:col-span-2 flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <h3 className="text-[17px] font-bold tracking-tight text-[var(--text)]">
              {t.topProductsHeading}
            </h3>
            <span className="text-[12px] text-[var(--text-tertiary)]">
              {language === 'uk' ? 'За обсягом виторгу' : 'By revenue generated'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] mt-2">
              <thead>
                <tr className="border-b border-[var(--border)] text-[11px] font-semibold uppercase text-[var(--text-tertiary)] tracking-wider">
                  <th className="py-2.5 pl-1">{t.thProduct}</th>
                  <th className="py-2.5 px-3">{t.thCategory}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'uk' ? 'Продано' : 'Sold'}</th>
                  <th className="py-2.5 pr-1 text-right">{t.thTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data.topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[13px] text-[var(--text-tertiary)]">
                      {language === 'uk' ? 'Дані продажів відсутні за цей період.' : 'No product sales recorded in this period.'}
                    </td>
                  </tr>
                ) : (
                  data.topProducts.map((prod, index) => (
                    <tr key={prod.id} className="hover:bg-[var(--surface-soft)] transition-colors">
                      <td className="py-3 pl-1 font-medium text-[var(--text)] flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface-soft)] font-mono text-[11px] text-[var(--text-secondary)] font-bold">
                          {index + 1}
                        </span>
                        <span className="truncate max-w-[200px] sm:max-w-none">{prod.name}</span>
                      </td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">{prod.category}</td>
                      <td className="py-3 px-3 text-right font-medium text-[var(--text)]">{prod.salesCount}</td>
                      <td className="py-3 pr-1 text-right font-semibold text-[var(--accent)]">
                        {formatCurrency(prod.revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Geography Breakdown */}
        <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="text-[17px] font-bold tracking-tight text-[var(--text)]">
                {t.deliveryGeographyTitle}
              </h3>
            </div>
            <span className="text-[12px] text-[var(--text-tertiary)]">
              {language === 'uk' ? 'За містами доставки' : 'By destination'}
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[var(--border)] pt-1">
            {data.cities.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-[var(--text-tertiary)]">
                {language === 'uk' ? 'Дані доставки відсутні за цей період.' : 'No delivery hub data recorded in this period.'}
              </p>
            ) : (
              data.cities.map((cityItem) => (
                <div key={cityItem.city} className="flex items-center justify-between py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[13.5px] text-[var(--text)]">{cityItem.city}</span>
                    <span className="text-[11.5px] text-[var(--text-tertiary)]">
                      {cityItem.ordersCount} {language === 'uk' ? 'замовлень доставлено' : 'orders shipped'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[13px] text-[var(--text)]">
                      {formatCurrency(cityItem.totalAmount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
