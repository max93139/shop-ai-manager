'use client';

import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../provider/authProvider';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

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

  const userName = user?.name || 'Maksym K.';
  const userInitials = userName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-7">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] shrink-0">
        <span>Admin</span>
        <span>/</span>
        <span className="font-semibold text-[var(--text)]">{currentTitle}</span>
      </div>

      {/* Search Box */}
      <div className="ml-3 flex flex-1 max-w-[420px] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[13px] text-[var(--text-tertiary)] transition-colors focus-within:border-[var(--accent)] focus-within:bg-[var(--surface)]">
        <Search className="h-3.7 w-3.7 shrink-0 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="w-full bg-transparent text-[13px] text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        />
        <kbd className="font-mono text-[10.5px] rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[var(--text-tertiary)]">
          ⌘K
        </kbd>
      </div>

      {/* Topbar Actions */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:border hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
        >
          <Bell className="h-4.2 w-4.2" />
          <span className="absolute right-1.75 top-1.75 h-1.5 w-1.5 rounded-full border border-[var(--surface)] bg-[var(--danger)]" />
        </button>

        <button
          type="button"
          aria-label="Help"
          className="flex h-8.5 w-8.5 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:border hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
        >
          <HelpCircle className="h-4.2 w-4.2" />
        </button>

        <div className="ml-1 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-gradient-to-br from-[#E7DFC9] to-[#CBB98A] font-['Fraunces',Georgia,serif] text-[11px] font-semibold text-[#4A3F1F]">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
