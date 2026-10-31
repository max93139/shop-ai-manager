'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
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
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Loader2,
  Clock,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface SearchProductItem {
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'low_stock' | 'out_of_stock';
}

interface SearchOrderItem {
  id: string;
  orderNumber?: string;
  customerName?: string;
  totalAmount?: number;
  status?: string;
}

interface FlatCommandItem {
  id: string;
  type: 'action' | 'page' | 'product' | 'order';
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const router = useRouter();
  const { t, isUk } = useTranslation();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<SearchProductItem[]>([]);
  const [orders, setOrders] = useState<SearchOrderItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setProducts([]);
      setOrders([]);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Debounced search for products and orders when query is typed
  useEffect(() => {
    if (!isOpen) return;
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) {
      setProducts([]);
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [prodRes, orderRes] = await Promise.allSettled([
          fetch(`${apiUrl}/products?search=${encodeURIComponent(cleanQuery)}&limit=5`, {
            headers,
            credentials: 'include',
            signal: controller.signal,
          }),
          fetch(`${apiUrl}/orders?search=${encodeURIComponent(cleanQuery)}&limit=5`, {
            headers,
            credentials: 'include',
            signal: controller.signal,
          }),
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
          const data = await prodRes.value.json();
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }

        if (orderRes.status === 'fulfilled' && orderRes.value.ok) {
          const data = await orderRes.value.json();
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Search failed', err);
        }
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  // Pages definition
  const staticPages = useMemo(
    () => [
      { id: 'p-dash', title: t.dashboard, href: '/dashboard', icon: <LayoutGrid className="h-4 w-4" /> },
      { id: 'p-inv', title: t.catalogAndInventory, href: '/inventory', icon: <Package className="h-4 w-4" /> },
      { id: 'p-ord', title: t.orders, href: '/orders', icon: <Receipt className="h-4 w-4" /> },
      { id: 'p-an', title: t.analytics, href: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'p-bot', title: t.telegramBot, href: '/telegram-bot', icon: <Bot className="h-4 w-4" /> },
      { id: 'p-ai', title: t.smartAssistant, href: '/ai-assistant', icon: <Workflow className="h-4 w-4" /> },
      { id: 'p-not', title: t.notifications, href: '/notifications', icon: <Bell className="h-4 w-4" /> },
      { id: 'p-set', title: t.settings, href: '/settings', icon: <Settings className="h-4 w-4" /> },
      {
        id: 'p-pub',
        title: t.channelPublisher,
        href: '/channel-publisher',
        icon: <Megaphone className="h-4 w-4" />,
        badge: isUk ? 'Скоро' : 'Soon',
      },
    ],
    [t, isUk]
  );

  // Quick actions definition
  const quickActions = useMemo(
    () => [
      {
        id: 'act-add-prod',
        title: t.commandActionAddProduct,
        subtitle: isUk ? 'Створити новий товар з розмірами та кольорами' : 'Create new product with variants',
        href: '/inventory?action=create',
        icon: <PlusCircle className="h-4 w-4" />,
      },
      {
        id: 'act-low-stock',
        title: t.commandActionLowStock,
        subtitle: isUk ? 'Фільтр товарів з критичним запасом на складі' : 'Filter low stock items on inventory page',
        href: '/inventory?status=low_stock',
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        id: 'act-out-stock',
        title: t.commandActionOutOfStock,
        subtitle: isUk ? 'Товари, яких немає в наявності' : 'Items currently out of stock',
        href: '/inventory?status=out_of_stock',
        icon: <Package className="h-4 w-4" />,
      },
    ],
    [t, isUk]
  );

  // Filter items according to search query
  const q = query.trim().toLowerCase();

  const filteredPages = useMemo(() => {
    if (!q) return staticPages.slice(0, 5);
    return staticPages.filter((p) => p.title.toLowerCase().includes(q));
  }, [staticPages, q]);

  const filteredActions = useMemo(() => {
    if (!q) return quickActions;
    return quickActions.filter(
      (a) => a.title.toLowerCase().includes(q) || (a.subtitle && a.subtitle.toLowerCase().includes(q))
    );
  }, [quickActions, q]);

  // Combine into flattened navigable list
  const flatItems: FlatCommandItem[] = useMemo(() => {
    const list: FlatCommandItem[] = [];

    // 1. Actions
    for (const a of filteredActions) {
      list.push({
        id: a.id,
        type: 'action',
        title: a.title,
        subtitle: a.subtitle,
        href: a.href,
        icon: a.icon,
      });
    }

    // 2. Pages
    for (const p of filteredPages) {
      list.push({
        id: p.id,
        type: 'page',
        title: p.title,
        href: p.href,
        icon: p.icon,
        badge: p.badge,
      });
    }

    // 3. Products
    for (const pr of products) {
      list.push({
        id: `prod-${pr.variantId}`,
        type: 'product',
        title: pr.name,
        subtitle: `SKU: ${pr.sku} • ₴${pr.price.toLocaleString()} • ${pr.stock} ${isUk ? 'шт' : 'pcs'}`,
        href: `/inventory?search=${encodeURIComponent(pr.name)}`,
        icon: <Package className="h-4 w-4" />,
        badge:
          pr.status === 'out_of_stock'
            ? isUk
              ? 'Немає'
              : 'Out'
            : pr.status === 'low_stock'
            ? isUk
              ? 'Мало'
              : 'Low'
            : isUk
            ? 'Активний'
            : 'Active',
      });
    }

    // 4. Orders
    for (const ord of orders) {
      const orderNum = ord.orderNumber || ord.id.slice(0, 8);
      list.push({
        id: `ord-${ord.id}`,
        type: 'order',
        title: `${isUk ? 'Замовлення' : 'Order'} #${orderNum}`,
        subtitle: `${ord.customerName || 'Клієнт'} • ₴${(ord.totalAmount || 0).toLocaleString()}`,
        href: `/orders?search=${encodeURIComponent(orderNum)}`,
        icon: <Receipt className="h-4 w-4" />,
        badge: ord.status,
      });
    }

    return list;
  }, [filteredActions, filteredPages, products, orders, isUk]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [flatItems.length, query]);

  const handleSelect = (item: FlatCommandItem) => {
    onClose();
    router.push(item.href);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = flatItems[selectedIndex];
      if (current) handleSelect(current);
    }
  };

  // Auto-scroll selected element into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-command-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-[10vh] sm:pt-[14vh]">
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-200"
      />

      <div
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-[620px] rounded-[20px] border border-white/70 bg-[var(--surface)]/90 backdrop-blur-2xl shadow-glass flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5 bg-transparent">
          <Search className="h-5 w-5 shrink-0 text-[var(--text-tertiary)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.commandInputPlaceholder}
            className="w-full bg-transparent text-[14.5px] font-medium text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:outline-none min-w-0"
          />
          {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--accent)]" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-[var(--text-tertiary)] hover:text-[var(--text)] p-0.5 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd
            onClick={onClose}
            className="cursor-pointer font-mono text-[10.5px] font-semibold rounded-[5px] border border-[var(--border)] bg-[var(--surface-soft)] px-1.5 py-0.5 text-[var(--text-tertiary)] shrink-0 hover:text-[var(--text)]"
          >
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[58vh] overflow-y-auto p-2 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-1"
        >
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Search className="h-8 w-8 text-[var(--text-tertiary)] mb-2" />
              <h4 className="font-semibold text-[14px] text-[var(--text)]">
                {t.commandNoResultsTitle}
              </h4>
              <p className="text-[12.5px] text-[var(--text-secondary)] mt-1 max-w-[340px]">
                {t.commandNoResultsDesc}
              </p>
            </div>
          ) : (
            <>
              {/* Actions Section */}
              {filteredActions.length > 0 && (
                <div className="flex flex-col">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    {t.commandSectionActions}
                  </div>
                  {filteredActions.map((item) => {
                    const idx = flatItems.findIndex((fi) => fi.id === item.id);
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={item.id}
                        data-command-index={idx}
                        onClick={() => handleSelect(flatItems[idx])}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-[12px] cursor-pointer transition-colors duration-100 ${
                          isSelected
                            ? 'bg-[var(--surface-soft)] text-[var(--text)] ring-1 ring-[var(--border)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
                              isSelected
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13.5px] font-medium truncate text-[var(--text)]">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="text-[11.5px] text-[var(--text-tertiary)] truncate">
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation Pages Section */}
              {filteredPages.length > 0 && (
                <div className="flex flex-col mt-1">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    {t.commandSectionPages}
                  </div>
                  {filteredPages.map((item) => {
                    const idx = flatItems.findIndex((fi) => fi.id === item.id);
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={item.id}
                        data-command-index={idx}
                        onClick={() => handleSelect(flatItems[idx])}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-[12px] cursor-pointer transition-colors duration-100 ${
                          isSelected
                            ? 'bg-[var(--surface-soft)] text-[var(--text)] ring-1 ring-[var(--border)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
                              isSelected
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="text-[13.5px] font-medium truncate text-[var(--text)]">
                            {item.title}
                          </span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-[var(--text-tertiary)]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Products Section */}
              {products.length > 0 && (
                <div className="flex flex-col mt-1">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    {t.commandSectionProducts}
                  </div>
                  {products.map((item) => {
                    const idx = flatItems.findIndex((fi) => fi.id === `prod-${item.variantId}`);
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={item.variantId}
                        data-command-index={idx}
                        onClick={() => handleSelect(flatItems[idx])}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-[12px] cursor-pointer transition-colors duration-100 ${
                          isSelected
                            ? 'bg-[var(--surface-soft)] text-[var(--text)] ring-1 ring-[var(--border)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
                              isSelected
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]'
                            }`}
                          >
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13.5px] font-medium truncate text-[var(--text)]">
                              {item.name}
                            </span>
                            <span className="text-[11.5px] text-[var(--text-tertiary)] truncate">
                              SKU: {item.sku} • ₴{item.price.toLocaleString()} • {item.stock}{' '}
                              {isUk ? 'шт' : 'pcs'}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            item.status === 'out_of_stock'
                              ? 'bg-[#FDF1F1] text-[#B84343]'
                              : item.status === 'low_stock'
                              ? 'bg-[#FEF6E9] text-[#965A1A]'
                              : 'bg-[#EAF5EF] text-[#0F6B4F]'
                          }`}
                        >
                          {item.status === 'out_of_stock'
                            ? isUk
                              ? 'Немає'
                              : 'Out'
                            : item.status === 'low_stock'
                            ? isUk
                              ? 'Мало'
                              : 'Low'
                            : isUk
                            ? 'Активний'
                            : 'Active'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Orders Section */}
              {orders.length > 0 && (
                <div className="flex flex-col mt-1">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    {t.commandSectionOrders}
                  </div>
                  {orders.map((item) => {
                    const idx = flatItems.findIndex((fi) => fi.id === `ord-${item.id}`);
                    const isSelected = selectedIndex === idx;
                    const orderNum = item.orderNumber || item.id.slice(0, 8);
                    return (
                      <div
                        key={item.id}
                        data-command-index={idx}
                        onClick={() => handleSelect(flatItems[idx])}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-[12px] cursor-pointer transition-colors duration-100 ${
                          isSelected
                            ? 'bg-[var(--surface-soft)] text-[var(--text)] ring-1 ring-[var(--border)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
                              isSelected
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]'
                            }`}
                          >
                            <Receipt className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13.5px] font-medium truncate text-[var(--text)]">
                              {isUk ? 'Замовлення' : 'Order'} #{orderNum}
                            </span>
                            <span className="text-[11.5px] text-[var(--text-tertiary)] truncate">
                              {item.customerName || 'Клієнт'} • ₴
                              {(item.totalAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {item.status && (
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--surface-sunken)] text-[var(--text-tertiary)]">
                            {item.status}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Apple-style Footer Shortcut Bar */}
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-soft)]/80 backdrop-blur-md px-4 py-2.5 text-[11.5px] text-[var(--text-tertiary)]">
          <span>{t.commandFooterShortcuts}</span>
          <span className="hidden sm:inline font-medium text-[var(--text-secondary)]">
            Shop AI Spotlight
          </span>
        </div>
      </div>
    </div>
  );
}
