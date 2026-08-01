'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/products':
        return 'Products';
      case '/categories':
        return 'Categories';
      case '/inventory':
        return 'Inventory';
      case '/orders':
        return 'Orders';
      case '/customers':
        return 'Customers';
      case '/crm':
        return 'CRM';
      case '/telegram-bot':
        return 'Telegram Bot';
      case '/channel-publisher':
        return 'Channel Publisher';
      case '/ai-assistant':
        return 'AI Assistant';
      case '/notifications':
        return 'Notifications';
      case '/staff':
        return 'Staff';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const currentTitle = getPageTitle(pathname || '/');

  return (
    <header className="sticky top-0 z-10 flex h-[64px] shrink-0 items-center gap-[16px] border-b border-[var(--border)] bg-[var(--surface)] px-[28px]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-[6px] text-[13px] text-[var(--text-tertiary)] shrink-0">
        <span>Admin</span>
        <span>/</span>
        <span className="font-semibold text-[var(--text)]">{currentTitle}</span>
      </div>

      {/* Search Box */}
      <div className="ml-[12px] flex flex-1 max-w-[420px] items-center gap-[8px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] px-[12px] py-[8px] text-[13px] text-[var(--text-tertiary)] transition-colors focus-within:border-[var(--accent)] focus-within:bg-[var(--surface)]">
        <Search className="h-[15px] w-[15px] shrink-0 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="w-full bg-transparent text-[13px] text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        />
        <kbd className="font-mono text-[10.5px] rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-[5px] py-[1px] text-[var(--text-tertiary)]">
          ⌘K
        </kbd>
      </div>
    </header>
  );
}
