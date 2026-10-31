'use client';

import React, { useState, useEffect } from 'react';
import { Search, LogOut, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../provider/authProvider';
import { useAppDispatch, useAppSelector } from '../../../store';
import { toggleSidebar } from '../../../store/slices/uiSlice';
import { translations } from '../../../utils/translations';
import CommandPaletteModal from '../../common/CommandPaletteModal';

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const t = translations[language] || translations.uk;

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
      case '/dashboard':
        return t.dashboard;
      case '/analytics':
        return t.analytics;
      case '/storage':
      case '/products':
      case '/categories':
      case '/inventory':
        return t.catalogAndInventory;
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
    <>
      <header className="sticky top-0 z-10 flex h-[64px] shrink-0 items-center gap-[12px] sm:gap-[16px] border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-[14px] sm:px-[20px] lg:px-[28px]">
        {/* Mobile Sidebar Toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)] lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-[6px] text-[13px] text-[var(--text-tertiary)] shrink-0">
          <span>{t.adminBreadcrumb}</span>
          <span>/</span>
          <span className="font-semibold text-[var(--text)]">{currentTitle}</span>
        </div>

        {/* Spotlight Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex flex-1 max-w-[380px] items-center justify-between gap-[10px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] px-[11px] sm:px-[13px] py-[7px] text-[13px] text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-sunken)] transition-all cursor-pointer group text-left shadow-2xs"
          aria-label={t.commandTriggerText}
        >
          <div className="flex items-center gap-[8px] min-w-0">
            <Search className="h-[15px] w-[15px] shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors" />
            <span className="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] truncate transition-colors">
              {t.commandTriggerText}
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center font-mono text-[10.5px] font-semibold rounded-[5px] border border-[var(--border)] bg-[var(--surface)] px-[5.5px] py-[1px] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] shadow-2xs shrink-0">
            ⌘K
          </kbd>
        </button>

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

      {/* Apple-style Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
