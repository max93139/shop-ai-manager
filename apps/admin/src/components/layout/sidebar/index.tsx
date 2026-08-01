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

export default function Sidebar() {
  const { user } = useAuth();

  const userName = user?.name || 'Maksym K.';
  const userRole = user?.role || 'Owner';
  const userInitials = userName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="sticky top-0 flex h-screen w-[246px] shrink-0 flex-col gap-[22px] border-r border-[var(--border)] bg-[var(--surface)] p-5 pb-5 pt-5 overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-2 pb-2 pt-1">
        <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-[9px] bg-[var(--text)] text-white shadow-sm">
          <ShoppingBag className="h-3.7 w-3.7 text-white" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="font-['Fraunces',Georgia,serif] text-[17px] font-[650] leading-tight text-[var(--text)]">
            Admin Panel
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)] -mt-0.5">
            Store Operations
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex flex-col gap-[22px]">
        {/* Overview Group */}
        <div className="flex flex-col gap-0.5">
          <div className="px-2.5 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            Overview
          </div>
          <SidebarItem label="Dashboard" href="/" icon={<LayoutGrid />} />
          <SidebarItem label="Analytics" href="/analytics" icon={<BarChart3 />} />
        </div>

        {/* Catalog Group */}
        <div className="flex flex-col gap-0.5">
          <div className="px-2.5 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            Catalog
          </div>
          <SidebarItem label="Products" href="/products" icon={<Tag />} count={248} />
          <SidebarItem label="Categories" href="/categories" icon={<Layers />} />
          <SidebarItem label="Inventory" href="/inventory" icon={<Package />} count={6} />
        </div>

        {/* Sales Group */}
        <div className="flex flex-col gap-0.5">
          <div className="px-2.5 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            Sales
          </div>
          <SidebarItem label="Orders" href="/orders" icon={<Receipt />} count={14} />
          <SidebarItem label="Customers" href="/customers" icon={<Users />} />
          <SidebarItem label="CRM" href="/crm" icon={<Target />} />
        </div>

        {/* Automation Group */}
        <div className="flex flex-col gap-0.5">
          <div className="px-2.5 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            Automation
          </div>
          <SidebarItem label="Telegram Bot" href="/telegram-bot" icon={<Bot />} />
          <SidebarItem label="Channel Publisher" href="/channel-publisher" icon={<Megaphone />} />
          <SidebarItem label="AI Assistant" href="/ai-assistant" icon={<Sparkles />} />
        </div>

        {/* System Group */}
        <div className="flex flex-col gap-0.5">
          <div className="px-2.5 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            System
          </div>
          <SidebarItem label="Notifications" href="/notifications" icon={<Bell />} count={3} />
          <SidebarItem label="Staff" href="/staff" icon={<UserCheck />} />
          <SidebarItem label="Settings" href="/settings" icon={<Settings />} />
        </div>
      </nav>

      {/* Sidebar Footer User Chip */}
      <div className="mt-auto border-t border-[var(--border)] pt-3.5">
        <div className="flex cursor-pointer items-center gap-2.25 rounded-[var(--radius-sm)] p-2 transition-colors hover:bg-[var(--surface-soft)]">
          <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E7DFC9] to-[#CBB98A] font-['Fraunces',Georgia,serif] text-[12px] font-semibold text-[#4A3F1F]">
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
  );
}
