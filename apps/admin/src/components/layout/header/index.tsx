'use client';

import React from 'react';
import { Search, LogOut, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../provider/authProvider';
import { useAppDispatch, useAppSelector } from '../../../store';
import { toggleSidebar } from '../../../store/slices/uiSlice';
import { translations } from '../../../utils/translations';

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const t = translations[language] || translations.uk;

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
      case '/dashboard':
        return t.dashboard;
      case '/analytics':
        return t.analytics;
      case '/storage':
      case '/products':
        return t.storage;
      case '/inventory':
        return t.inventory;
      case '/orders':
        return t.orders;
      case '/customers':
        return t.customers;
      case '/crm':
        return t.crm;
      case '/telegram-bot':
        return t.telegramBot;
      case '/channel-publisher':
        return t.channelPublisher;
      case '/ai-assistant':
        return t.smartAssistant;
      case '/notifications':
        return t.notifications;
      case '/settings':
        return t.settings;
      default:
        return t.dashboard;
    }
  };

  const currentTitle = getPageTitle(pathname || '/');

  return (
    <header className="sticky top-0 z-10 flex h-[64px] shrink-0 items-center gap-[12px] sm:gap-[16px] border-b border-[var(--border)] bg-[var(--surface)] px-[14px] sm:px-[20px] lg:px-[28px]">
      {/* Mobile Sidebar Toggle */}
      <button
        type="button"
        onClick={() => dispatch(toggleSidebar())}
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)] lg:hidden"
        aria-label="Toggle Navigation"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {/* Breadcrumbs - Hidden on mobile (< md) to give full space to Search */}
      <div className="hidden md:flex items-center gap-[6px] text-[13px] text-[var(--text-tertiary)] shrink-0">
        <span>{t.adminBreadcrumb}</span>
        <span>/</span>
        <span className="font-semibold text-[var(--text)]">{currentTitle}</span>
      </div>

      {/* Search Box */}
      <div className="flex flex-1 max-w-[420px] items-center gap-[8px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] px-[10px] sm:px-[12px] py-[8px] text-[13px] text-[var(--text-tertiary)] transition-colors focus-within:border-[var(--accent)] focus-within:bg-[var(--surface)]">
        <Search className="h-[15px] w-[15px] shrink-0 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className="w-full bg-transparent text-[13px] text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:outline-none min-w-0"
        />
        <kbd className="hidden sm:inline-block font-mono text-[10.5px] rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-[5px] py-[1px] text-[var(--text-tertiary)] shrink-0">
          ⌘K
        </kbd>
      </div>

      {/* Topbar Actions / Logout */}
      <div className="ml-auto flex items-center shrink-0">
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-[7px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 sm:px-3 py-[7px] text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
        >
          <LogOut className="h-[15px] w-[15px] text-[var(--text-secondary)]" />
          <span className="hidden sm:inline">{t.logout}</span>
        </button>
      </div>
    </header>
  );
}
