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

export interface TelegramBotData {
  botStatus: {
    handle: string;
    uptime: string;
    messagesToday: number;
    activeChats: number;
    isOnline: boolean;
  };
  connectedChannel: {
    name: string;
    handle: string;
    subscribersCount: string;
    isConnected: boolean;
  };
  queueStatus: {
    pendingPosts: number;
    scheduledToday: number;
    failedCount: number;
  };
  recentOrders: RecentOrderItem[];
}

export default function TelegramBot() {
  const [data, setData] = useState<TelegramBotData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBotData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${apiUrl}/telegram/stats`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (res.ok) {
          const stats = await res.json();
          if (isMounted) setData(stats);
        }
      } catch (err) {
        console.error('Failed to fetch Telegram Bot stats from backend API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBotData();

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
          <BotStatusCard
            handle={data?.botStatus?.handle}
            uptime={data?.botStatus?.uptime}
            messagesToday={data?.botStatus?.messagesToday}
            activeChats={data?.botStatus?.activeChats}
            isOnline={data?.botStatus?.isOnline}
          />

          <ConnectedChannelCard
            channelName={data?.connectedChannel?.name}
            channelHandle={data?.connectedChannel?.handle}
            subscribersCount={data?.connectedChannel?.subscribersCount}
            isConnected={data?.connectedChannel?.isConnected}
          />

          <QueueStatusCard
            pendingPosts={data?.queueStatus?.pendingPosts}
            scheduledToday={data?.queueStatus?.scheduledToday}
            failedCount={data?.queueStatus?.failedCount}
          />
        </div>

        {/* Right Column (Recent Ordered Products) */}
        <div className="lg:col-span-5 flex flex-col">
          <RecentOrderedProductsCard
            orders={data?.recentOrders || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
