'use client';

import React from 'react';
import { Package } from 'lucide-react';
import type { ProductItem } from '../../../../../store/slices/productsSlice';

export interface ProductsTableProps {
  items: ProductItem[];
  loading?: boolean;
  viewMode: 'table' | 'grid';
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: ProductItem['status'] }) {
  const config = {
    active: { label: 'Active', dot: 'bg-[#0F6B4F]', bg: 'bg-[#E7F2ED]', text: 'text-[#0F6B4F]' },
    low_stock: { label: 'Low stock', dot: 'bg-[#B7791F]', bg: 'bg-[#FEFCBF]', text: 'text-[#B7791F]' },
    out_of_stock: { label: 'Out of stock', dot: 'bg-[#B84343]', bg: 'bg-[#FBECEC]', text: 'text-[#B84343]' },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

/* ─── Color swatch ─── */
function ColorSwatch({ color }: { color: string }) {
  // Try to interpret the color string as a CSS color
  const colorMap: Record<string, string> = {
    black: '#1a1a1a',
    white: '#f5f5f5',
    red: '#dc2626',
    blue: '#2563eb',
    green: '#16a34a',
    yellow: '#eab308',
    orange: '#ea580c',
    purple: '#9333ea',
    pink: '#ec4899',
    brown: '#92400e',
    grey: '#6b7280',
    gray: '#6b7280',
    navy: '#1e3a5f',
    beige: '#d4c5a9',
    cream: '#fffdd0',
    charcoal: '#36454f',
    camel: '#c19a6b',
    khaki: '#c3b091',
    olive: '#556b2f',
    teal: '#008080',
    burgundy: '#800020',
    coral: '#ff7f50',
    gold: '#d4af37',
    silver: '#c0c0c0',
    maroon: '#800000',
    cyan: '#00bcd4',
    mint: '#98ff98',
    lavender: '#b57edc',
    tan: '#d2b48c',
    ivory: '#fffff0',
  };

  const bg = colorMap[color.toLowerCase()] || color;
  const isLight = ['white', 'cream', 'beige', 'ivory', 'yellow', 'mint'].includes(color.toLowerCase());

  return (
    <span
      className={`inline-block h-5 w-5 rounded-full shrink-0 ${isLight ? 'border border-[var(--border-strong)]' : 'border border-transparent'}`}
      style={{ backgroundColor: bg }}
      title={color}
    />
  );
}

/* ─── Skeleton rows ─── */
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="py-3.5 pl-4"><div className="h-4 w-4 rounded bg-[var(--border)]" /></td>
          <td className="py-3.5 pl-3">
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-28 rounded bg-[var(--border)]" />
              <div className="h-3 w-20 rounded bg-[var(--surface-sunken)]" />
            </div>
          </td>
          <td className="py-3.5"><div className="h-4 w-20 rounded bg-[var(--border)]" /></td>
          <td className="py-3.5"><div className="h-4 w-20 rounded bg-[var(--border)]" /></td>
          <td className="py-3.5"><div className="h-5 w-5 rounded-full bg-[var(--border)]" /></td>
          <td className="py-3.5"><div className="h-4 w-12 rounded bg-[var(--border)]" /></td>
          <td className="py-3.5"><div className="h-4 w-10 rounded bg-[var(--border)]" /></td>
          <td className="py-3.5"><div className="h-4 w-14 rounded bg-[var(--border)]" /></td>
          <td className="py-3.5"><div className="h-5 w-16 rounded-full bg-[var(--border)]" /></td>
        </tr>
      ))}
    </>
  );
}

/* ─── Grid card ─── */
function ProductCard({ item }: { item: ProductItem }) {
  return (
    <div className="flex flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-semibold text-[var(--text)] truncate">{item.name}</span>
          <span className="text-[11.5px] text-[var(--text-tertiary)] font-mono">{item.sku}</span>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <ColorSwatch color={item.color} />
        <span className="text-[13px] text-[var(--text-secondary)]">{item.color}</span>
        <span className="text-[var(--text-tertiary)]">·</span>
        <span className="text-[13px] text-[var(--text-secondary)]">{item.size}</span>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)]">
        <div className="flex flex-col">
          <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide font-semibold">Stock</span>
          <span className="text-[14px] font-bold text-[var(--text)]">{item.stock}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide font-semibold">Price</span>
          <span className="text-[14px] font-bold text-[var(--text)]">${item.price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-[var(--border)]">
        {item.brand && (
          <>
            <span className="text-[12px] text-[var(--text-secondary)] font-medium">{item.brand}</span>
            <span className="text-[var(--text-tertiary)]">·</span>
          </>
        )}
        <span className="text-[12px] text-[var(--text-secondary)]">{item.category}</span>
      </div>
    </div>
  );
}

export default function ProductsTable({ items, loading, viewMode }: ProductsTableProps) {
  if (loading) {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[180px] rounded-[14px] bg-[var(--surface-soft)] border border-[var(--border)]" />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_8px_rgba(28,27,25,0.03)] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <th className="pb-3 pt-4 pl-4 w-10" />
                <th className="pb-3 pt-4 pl-3 font-bold">Product</th>
                <th className="pb-3 pt-4 font-bold">Category</th>
                <th className="pb-3 pt-4 font-bold">Brand</th>
                <th className="pb-3 pt-4 font-bold">Color</th>
                <th className="pb-3 pt-4 font-bold">Size</th>
                <th className="pb-3 pt-4 font-bold">Stock</th>
                <th className="pb-3 pt-4 font-bold">Price</th>
                <th className="pb-3 pt-4 pr-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <TableSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        <Package className="h-10 w-10 text-[var(--text-tertiary)] mb-3" />
        <p className="text-[15px] font-medium text-[var(--text-secondary)]">No products found</p>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard key={item.variantId} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_8px_rgba(28,27,25,0.03)] overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              <th className="pb-3 pt-4 pl-4 w-10">
                <input type="checkbox" className="rounded border-[var(--border-strong)] accent-[var(--accent)]" />
              </th>
              <th className="pb-3 pt-4 pl-3 font-bold">Product</th>
              <th className="pb-3 pt-4 font-bold">Category</th>
              <th className="pb-3 pt-4 font-bold">Brand</th>
              <th className="pb-3 pt-4 font-bold">Color</th>
              <th className="pb-3 pt-4 font-bold">Size</th>
              <th className="pb-3 pt-4 font-bold">Stock</th>
              <th className="pb-3 pt-4 font-bold">Price</th>
              <th className="pb-3 pt-4 pr-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-[13.5px]">
            {items.map((item) => (
              <tr key={item.variantId} className="transition-colors hover:bg-[var(--surface-soft)]">
                {/* Checkbox */}
                <td className="py-3.5 pl-4">
                  <input type="checkbox" className="rounded border-[var(--border-strong)] accent-[var(--accent)]" />
                </td>

                {/* Product name + SKU */}
                <td className="py-3.5 pl-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[var(--text)] truncate max-w-[200px]">{item.name}</span>
                    <span className="text-[11.5px] text-[var(--text-tertiary)] font-mono">{item.sku}</span>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 text-[var(--text-secondary)]">{item.category}</td>

                {/* Brand */}
                <td className="py-3.5 text-[var(--text-secondary)]">{item.brand || '—'}</td>

                {/* Color */}
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <ColorSwatch color={item.color} />
                    <span className="text-[var(--text-secondary)] hidden lg:inline">{item.color}</span>
                  </div>
                </td>

                {/* Size */}
                <td className="py-3.5 text-[var(--text-secondary)]">{item.size}</td>

                {/* Stock */}
                <td className="py-3.5 font-semibold text-[var(--text)]">{item.stock}</td>

                {/* Price */}
                <td className="py-3.5 font-semibold text-[var(--text)]">${item.price}</td>

                {/* Status */}
                <td className="py-3.5 pr-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
