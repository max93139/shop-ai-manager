'use client';

import React from 'react';
import {
  LayoutGrid,
  BarChart3,
  Tag,
  Layers,
  Package,
  Receipt,
  Users,
  Target,
  Bot,
  Megaphone,
  Sparkles,
  Bell,
  UserCheck,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../../provider/authProvider';
import { getUserInitials } from '../../../utils/getUserInitials';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSidebarOpen } from '../../../store/slices/uiSlice';

export default function Sidebar() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

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
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[246px] shrink-0 flex-col gap-[22px] border-r border-[var(--border)] bg-[var(--surface)] p-[20px_12px] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-[10px] px-2 pb-2 pt-1">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--text)] text-white shadow-sm">
            <ShoppingBag className="h-[15px] w-[15px] text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-['Fraunces',Georgia,serif] text-[17px] font-[650] leading-tight text-[var(--text)]">
              Admin Panel
            </span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)] -mt-[2px]">
              Store Operations
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-[22px]">
          {/* Overview Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Overview
            </div>
            <SidebarItem label="Dashboard" href="/" icon={<LayoutGrid className="h-[17px] w-[17px]" />} />
            <SidebarItem label="Analytics" href="/analytics" icon={<BarChart3 className="h-[17px] w-[17px]" />} />
          </div>

          {/* Catalog Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Catalog
            </div>
            <SidebarItem label="Products" href="/products" icon={<Tag className="h-[17px] w-[17px]" />} count={248} />
            <SidebarItem label="Categories" href="/categories" icon={<Layers className="h-[17px] w-[17px]" />} />
            <SidebarItem label="Inventory" href="/inventory" icon={<Package className="h-[17px] w-[17px]" />} count={6} />
          </div>

          {/* Sales Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Sales
            </div>
            <SidebarItem label="Orders" href="/orders" icon={<Receipt className="h-[17px] w-[17px]" />} count={14} />
            <SidebarItem label="Customers" href="/customers" icon={<Users className="h-[17px] w-[17px]" />} />
            <SidebarItem label="CRM" href="/crm" icon={<Target className="h-[17px] w-[17px]" />} />
          </div>

          {/* Automation Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Automation
            </div>
            <SidebarItem label="Telegram Bot" href="/telegram-bot" icon={<Bot className="h-[17px] w-[17px]" />} />
            <SidebarItem label="Channel Publisher" href="/channel-publisher" icon={<Megaphone className="h-[17px] w-[17px]" />} />
            <SidebarItem label="AI Assistant" href="/ai-assistant" icon={<Sparkles className="h-[17px] w-[17px]" />} />
          </div>

          {/* System Group */}
          <div className="flex flex-col gap-[1px]">
            <div className="px-[10px] pb-[6px] pt-[10px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              System
            </div>
            <SidebarItem label="Notifications" href="/notifications" icon={<Bell className="h-[17px] w-[17px]" />} count={3} />
            <SidebarItem label="Staff" href="/staff" icon={<UserCheck className="h-[17px] w-[17px]" />} />
            <SidebarItem label="Settings" href="/settings" icon={<Settings className="h-[17px] w-[17px]" />} />
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
