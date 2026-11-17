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
      const cleanOrderNum = (ord.orderNumber || ord.id.slice(0, 8)).replace(/^#/, '');
      list.push({
        id: `ord-${ord.id}`,
        type: 'order',
        title: `${isUk ? 'Замовлення' : 'Order'} #${cleanOrderNum}`,
        subtitle: `${ord.customerName || 'Клієнт'} • ₴${(ord.totalAmount || 0).toLocaleString()}`,
        href: `/orders?search=${encodeURIComponent(cleanOrderNum)}`,
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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-[9vh] sm:pt-[12vh]">
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-200"
      />

      <div
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-[640px] rounded-[22px] border border-stone-200 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden transition-all duration-200"
      >
        {/* Search Input Bar */}
        <div className="flex h-[60px] items-center gap-3.5 border-b border-stone-200 px-5 bg-white">
          <Search className="h-5 w-5 shrink-0 text-[#0F6B4F]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.commandInputPlaceholder}
            className="w-full bg-transparent text-[15px] sm:text-[16px] font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none min-w-0"
          />
          {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#0F6B4F]" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd
            onClick={onClose}
            className="cursor-pointer font-mono text-[11px] font-semibold rounded-[6px] border border-stone-200 bg-stone-100 px-2 py-0.5 text-stone-600 shrink-0 hover:text-stone-900 hover:border-stone-300 transition-colors shadow-2xs"
          >
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[58vh] overflow-y-auto p-2.5 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-1 bg-white"
        >
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Search className="h-8 w-8 text-stone-400 mb-2" />
              <h4 className="font-semibold text-[15px] text-stone-900">
                {t.commandNoResultsTitle}
              </h4>
              <p className="text-[13px] text-stone-500 mt-1 max-w-[340px]">
                {t.commandNoResultsDesc}
              </p>
            </div>
          ) : (
            <>
              {/* Actions Section */}
              {filteredActions.length > 0 && (
                <div className="flex flex-col mb-1">
                  <div className="px-3.5 pt-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-stone-700">
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
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] cursor-pointer transition-all duration-100 ${
                          isSelected
                            ? 'bg-[#0F6B4F]/10 text-stone-900 ring-1 ring-[#0F6B4F]/30 shadow-xs'
                            : 'text-stone-800 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] transition-colors ${
                              isSelected
                                ? 'bg-[#0F6B4F] text-white shadow-xs'
                                : 'bg-stone-100 text-[#0F6B4F] border border-stone-200'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-semibold truncate text-stone-900 leading-snug">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="text-[12px] text-stone-500 truncate">
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? 'translate-x-0.5 text-[#0F6B4F]' : 'text-stone-400'}`} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation Pages Section */}
              {filteredPages.length > 0 && (
                <div className="flex flex-col mb-1">
                  <div className="px-3.5 pt-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-stone-700">
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
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] cursor-pointer transition-all duration-100 ${
                          isSelected
                            ? 'bg-[#0F6B4F]/10 text-stone-900 ring-1 ring-[#0F6B4F]/30 shadow-xs'
                            : 'text-stone-800 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] transition-colors ${
                              isSelected
                                ? 'bg-[#0F6B4F] text-white shadow-xs'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="text-[14px] font-semibold truncate text-stone-900">
                            {item.title}
                          </span>
                        </div>
                        {item.badge && (
                          <span className="text-[10.5px] font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
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
                <div className="flex flex-col mb-1">
                  <div className="px-3.5 pt-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-stone-700">
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
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] cursor-pointer transition-all duration-100 ${
                          isSelected
                            ? 'bg-[#0F6B4F]/10 text-stone-900 ring-1 ring-[#0F6B4F]/30 shadow-xs'
                            : 'text-stone-800 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] transition-colors ${
                              isSelected
                                ? 'bg-[#0F6B4F] text-white shadow-xs'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-semibold truncate text-stone-900 leading-snug">
                              {item.name}
                            </span>
                            <span className="text-[12px] text-stone-500 truncate">
                              SKU: {item.sku} • ₴{item.price.toLocaleString()} • {item.stock}{' '}
                              {isUk ? 'шт' : 'pcs'}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                            item.status === 'out_of_stock'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : item.status === 'low_stock'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                            ? 'В наявності'
                            : 'Active'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Orders Section */}
              {orders.length > 0 && (
                <div className="flex flex-col mb-1">
                  <div className="px-3.5 pt-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-stone-700">
                    {t.commandSectionOrders}
                  </div>
                  {orders.map((item) => {
                    const idx = flatItems.findIndex((fi) => fi.id === `ord-${item.id}`);
                    const isSelected = selectedIndex === idx;
                    const orderNum = (item.orderNumber || item.id.slice(0, 8)).replace(/^#/, '');
                    return (
                      <div
                        key={item.id}
                        data-command-index={idx}
                        onClick={() => handleSelect(flatItems[idx])}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] cursor-pointer transition-all duration-100 ${
                          isSelected
                            ? 'bg-[#0F6B4F]/10 text-stone-900 ring-1 ring-[#0F6B4F]/30 shadow-xs'
                            : 'text-stone-800 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] transition-colors ${
                              isSelected
                                ? 'bg-[#0F6B4F] text-white shadow-xs'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            <Receipt className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-semibold truncate text-stone-900 leading-snug">
                              {isUk ? 'Замовлення' : 'Order'} #{orderNum}
                            </span>
                            <span className="text-[12px] text-stone-500 truncate">
                              {item.customerName || 'Клієнт'} • ₴
                              {(item.totalAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {item.status && (
                          <span className="text-[10.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
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
        <div className="flex h-[44px] items-center justify-between border-t border-stone-200 bg-stone-50 px-4 text-[12px] text-stone-600 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="inline-flex items-center gap-1 shrink-0">
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 text-[10.5px] font-mono font-semibold text-stone-700 shadow-2xs">↑↓</kbd>
              <span>{isUk ? 'Навігація' : 'Navigate'}</span>
            </span>
            <span className="text-stone-300 shrink-0">•</span>
            <span className="inline-flex items-center gap-1 shrink-0">
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 text-[10.5px] font-mono font-semibold text-stone-700 shadow-2xs">↵</kbd>
              <span>{isUk ? 'Вибрати' : 'Select'}</span>
            </span>
            <span className="text-stone-300 shrink-0">•</span>
            <span className="inline-flex items-center gap-1 shrink-0">
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 text-[10.5px] font-mono font-semibold text-stone-700 shadow-2xs">Esc</kbd>
              <span>{isUk ? 'Закрити' : 'Close'}</span>
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-[11px] text-stone-500 uppercase tracking-wider shrink-0">
            Shop AI Spotlight
          </span>
        </div>
      </div>
    </div>
  );
}
