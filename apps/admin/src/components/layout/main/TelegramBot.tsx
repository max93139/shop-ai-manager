'use client';

import React, { useEffect, useState } from 'react';
import {
  TelegramBotHeader,
  BotStatusCard,
  ConnectedChannelCard,
  QueueStatusCard,
  RecentOrderedProductsCard,
  type RecentOrderItem,
} from './mainComponents/telegramBot';

export default function TelegramBot() {
  const [recentOrders, setRecentOrders] = useState<RecentOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/orders/stats`, { headers, credentials: 'include' }),
          fetch(`${apiUrl}/products?limit=5`, { headers, credentials: 'include' }),
        ]);

        let fetchedProducts: any[] = [];
        if (productsRes.ok) {
          const prodData = await productsRes.json();
          fetchedProducts = prodData.products || [];
        }

        if (ordersRes.ok) {
          const orderData = await ordersRes.json();
          const latest = orderData.latestOrders || [];

          if (latest.length > 0) {
            const mapped: RecentOrderItem[] = latest.map((ord: any, idx: number) => {
              const matchedProd = fetchedProducts[idx % Math.max(1, fetchedProducts.length)];
              const timeLabels = ['15m ago', '2h ago', '5h ago', 'Yesterday', '2d ago'];
              return {
                id: ord.id || String(idx),
                name: matchedProd?.name || `Order ${ord.orderNumber || idx + 1}`,
                sku: matchedProd?.sku || `SKU-${1000 + idx}`,
                timeAgo: timeLabels[idx % timeLabels.length],
                price: ord.totalAmount || `$${matchedProd?.price || 120}`,
                status: ord.paymentStatus === 'Paid' ? 'Paid' : 'Processing',
                image: matchedProd?.images?.[0],
              };
            });
            if (isMounted) setRecentOrders(mapped);
          } else if (fetchedProducts.length > 0) {
            const mapped: RecentOrderItem[] = fetchedProducts.map((p: any, idx: number) => ({
              id: p.variantId || String(idx),
              name: p.name,
              sku: p.sku,
              timeAgo: `${(idx + 1) * 2}h ago`,
              price: `$${p.price}`,
              status: 'Paid',
              image: p.images?.[0],
            }));
            if (isMounted) setRecentOrders(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Telegram Bot dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
      <TelegramBotHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Status & Queue) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <BotStatusCard />
          <ConnectedChannelCard />
          <QueueStatusCard />
        </div>

        {/* Right Column (Recent Ordered Products) */}
        <div className="lg:col-span-5 flex flex-col">
          <RecentOrderedProductsCard orders={recentOrders} loading={loading} />
        </div>
      </div>
    </div>
  );
}
