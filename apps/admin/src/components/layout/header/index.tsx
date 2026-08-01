'use client';

import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../provider/authProvider';
import { getUserInitials } from '../../../utils/getUserInitials';

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
  const userInitials = getUserInitials(userName);

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

      {/* Topbar Actions */}
      <div className="ml-auto flex items-center gap-[8px]">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:border hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
        >
          <Bell className="h-[17px] w-[17px]" />
          <span className="absolute right-[7px] top-[7px] h-[6px] w-[6px] rounded-full border-[1.5px] border-[var(--surface)] bg-[var(--danger)]" />
        </button>

        <button
          type="button"
          aria-label="Help"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:border hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
        >
          <HelpCircle className="h-[17px] w-[17px]" />
        </button>

        <div className="ml-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-br from-[#E7DFC9] to-[#CBB98A] font-['Fraunces',Georgia,serif] text-[12px] font-semibold text-[#4A3F1F]">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
