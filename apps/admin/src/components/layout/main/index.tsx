'use client';

import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Products from './Products';
import Categories from './Categories';
import Inventory from './Inventory';
import Orders from './Orders';
import Customers from './Customers';
import CRM from './CRM';
import TelegramBot from './TelegramBot';
import ChannelPublisher from './ChannelPublisher';
import AIAssistant from './AIAssistant';
import Notifications from './Notifications';
import Staff from './Staff';
import Settings from './Settings';
import Storage from './Storage';

interface MainProps {
  children?: ReactNode;
}

export default function Main({ children }: MainProps) {
  const pathname = usePathname();

  const renderContent = () => {
    if (children) return children;

    switch (pathname) {
      case '/':
      case '/dashboard':
        return <Dashboard />;
      case '/analytics':
        return <Analytics />;
      case '/storage':
      case '/products':
        return <Storage />;
      case '/categories':
        return <Categories />;
      case '/inventory':
        return <Inventory />;
      case '/orders':
        return <Orders />;
      case '/customers':
        return <Customers />;
      case '/crm':
        return <CRM />;
      case '/telegram-bot':
        return <TelegramBot />;
      case '/channel-publisher':
        return <ChannelPublisher />;
      case '/ai-assistant':
        return <AIAssistant />;
      case '/notifications':
        return <Notifications />;
      case '/staff':
        return <Staff />;
      case '/settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="flex-1 min-w-0 flex flex-col bg-[var(--bg)] overflow-y-auto">
      {renderContent()}
    </main>
  );
}
