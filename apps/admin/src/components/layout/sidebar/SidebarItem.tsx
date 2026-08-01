'use client';

import React, { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '../../../store';
import { setSidebarOpen } from '../../../store/slices/uiSlice';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: ReactNode;
  count?: number | string;
}

export default function SidebarItem({ label, href, icon, count }: SidebarItemProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      onClick={() => dispatch(setSidebarOpen(false))}
      className={`group flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-[13.5px] font-medium transition-colors duration-150 ${
        isActive
          ? 'bg-[var(--accent-soft)] text-[var(--accent-hover)] font-semibold'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]'
      }`}
    >
      <span className={`h-4 w-4 shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={`ml-auto font-mono text-[11px] px-1.5 py-0.5 rounded-full ${
            isActive
              ? 'bg-white text-[var(--accent)]'
              : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
