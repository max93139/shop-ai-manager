'use client';

import React from 'react';
import {
  LayoutGrid,
  BarChart3,
  Tag,
  Package,
  Receipt,
  Users,
  Target,
  Bot,
  Megaphone,
  Workflow,
  Bell,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../../provider/authProvider';
import { getUserInitials } from '../../../utils/getUserInitials';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSidebarOpen } from '../../../store/slices/uiSlice';
import { translations } from '../../../utils/translations';

export default function Sidebar() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const language = useAppSelector((state) => state.ui.language);
  const t = translations[language] || translations.uk;

  const userName = user?.name || 'Maksym K.';
  const userRole = user?.role || 'Owner';
  const userInitials = getUserInitials(userName);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        aria-hidden
        onClick={() => dispatch(setSidebarOpen(false))}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[260px] shrink-0 flex-col gap-[22px] border-r border-[var(--border)] bg-[var(--surface)] p-[20px_14px] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pb-2 pt-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#148362] to-[#0B523C] text-white shadow-sm">
            <ShoppingBag className="h-[18px] w-[18px] text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-bold tracking-tight text-[var(--text)] truncate">
              Shop AI Manager
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)] -mt-[1px] truncate">
              {t.adminPanel}
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-[22px]">
          {/* Overview Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {t.overview}
            </div>
            <SidebarItem label={t.dashboard} href="/" icon={<LayoutGrid className="h-[17px] w-[17px]" />} />
            <SidebarItem label={t.analytics} href="/analytics" icon={<BarChart3 className="h-[17px] w-[17px]" />} />
          </div>

          {/* Catalog Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {t.catalog}
            </div>
            <SidebarItem
              label={t.catalogAndInventory}
              href="/inventory"
              aliases={['/storage', '/products', '/categories']}
              icon={<Package className="h-[17px] w-[17px]" />}
            />
          </div>

          {/* Sales Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {t.sales}
            </div>
            <SidebarItem label={t.orders} href="/orders" icon={<Receipt className="h-[17px] w-[17px]" />} />
          </div>

          {/* Automation Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {t.automation}
            </div>
            <SidebarItem label={t.telegramBot} href="/telegram-bot" icon={<Bot className="h-[17px] w-[17px]" />} />
            <SidebarItem
              label={t.channelPublisher}
              href="/channel-publisher"
              icon={<Megaphone className="h-[17px] w-[17px]" />}
              isComingSoon
              badge={language === 'uk' ? 'Скоро' : 'Soon'}
            />
            <SidebarItem label={t.smartAssistant} href="/ai-assistant" icon={<Workflow className="h-[17px] w-[17px]" />} />
          </div>

          {/* System Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {t.system}
            </div>
            <SidebarItem label={t.notifications} href="/notifications" icon={<Bell className="h-[17px] w-[17px]" />} />
            <SidebarItem label={t.settings} href="/settings" icon={<Settings className="h-[17px] w-[17px]" />} />
          </div>
        </nav>

        {/* Sidebar Footer User Chip */}
        <div className="mt-auto border-t border-[var(--border)] pt-[14px]">
          <div className="flex cursor-pointer items-center gap-[9px] rounded-[var(--radius-sm)] p-2 transition-colors hover:bg-[var(--surface-soft)]">
            <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E7DFC9] to-[#CBB98A] font-['Fraunces',Georgia,serif] text-[12px] font-semibold text-[#4A3F1F]">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-[13px] font-semibold text-[var(--text)]">
                {userName}
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)] capitalize">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
