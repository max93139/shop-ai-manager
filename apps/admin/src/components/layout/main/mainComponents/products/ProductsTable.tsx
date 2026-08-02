'use client';

import React, { useState } from 'react';
import { Package, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../../../../store';
import {
  updateVariantStock,
  deleteVariant,
  type ProductItem,
} from '../../../../../store/slices/productsSlice';

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

/* ─── Product image thumbnail ─── */
function ProductImage({ images, name }: { images: string[]; name: string }) {
  const src = images?.[0];
  if (!src) {
    return (
      <div className="flex items-center justify-center bg-[var(--surface-sunken)] rounded-[10px] w-full aspect-[4/3] text-[var(--text-tertiary)]">
        <Package className="h-8 w-8" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-full aspect-[4/3] object-cover rounded-[10px] bg-[var(--surface-sunken)]"
      loading="lazy"
    />
  );
}

/* ─── Small thumbnail for table rows ─── */
function ProductThumb({ images, name }: { images: string[]; name: string }) {
  const src = images?.[0];
  if (!src) {
    return (
      <div className="flex items-center justify-center bg-[var(--surface-sunken)] rounded-[8px] h-10 w-10 shrink-0 text-[var(--text-tertiary)]">
        <Package className="h-4 w-4" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="h-10 w-10 object-cover rounded-[8px] bg-[var(--surface-sunken)] shrink-0"
      loading="lazy"
    />
  );
}

/* ─── Interactive Stock Control (+ / - / click edit) ─── */
function StockControl({ item }: { item: ProductItem }) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(String(item.stock));

  const handleUpdate = (newStock: number) => {
    if (newStock < 0) return;
    dispatch(updateVariantStock({ variantId: item.variantId, stock: newStock }));
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => handleUpdate(item.stock - 1)}
        disabled={item.stock <= 0}
        className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface-soft)] text-[12px] font-bold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed"
        title="Decrease stock"
      >
        -
      </button>
      {isEditing ? (
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            const parsed = parseInt(val, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed !== item.stock) {
              handleUpdate(parsed);
            } else {
              setVal(String(item.stock));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
          autoFocus
          className="w-12 text-center text-[13px] font-bold text-[var(--text)] bg-[var(--surface)] border border-[var(--accent)] rounded px-1 py-0.5"
        />
      ) : (
        <span
          onClick={() => {
            setVal(String(item.stock));
            setIsEditing(true);
          }}
          className="cursor-pointer min-w-[24px] text-center font-bold text-[var(--text)] hover:underline"
          title="Click to edit stock"
        >
          {item.stock}
        </span>
      )}
      <button
        type="button"
        onClick={() => handleUpdate(item.stock + 1)}
        className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface-soft)] text-[12px] font-bold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
        title="Increase stock"
      >
        +
      </button>
    </div>
  );
}

/* ─── Delete Button with Confirmation ─── */
function DeleteButton({ variantId, productName }: { variantId: string; productName: string }) {
  const dispatch = useAppDispatch();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    dispatch(deleteVariant(variantId));
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          className="rounded bg-[#B84343] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="p-1.5 text-[var(--text-tertiary)] transition-colors hover:text-[#B84343] rounded hover:bg-[var(--surface-soft)]"
      title={`Delete ${productName}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
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
          <td className="py-3.5 pr-4"><div className="h-4 w-6 rounded bg-[var(--border)] ml-auto" /></td>
        </tr>
      ))}
    </>
  );
}

/* ─── Grid card ─── */
function ProductCard({ item }: { item: ProductItem }) {
  return (
    <div className="flex flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <ProductImage images={item.images} name={item.name} />

      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col min-w-0 flex-1 mr-2">
            <span className="text-[14px] font-semibold text-[var(--text)] truncate">{item.name}</span>
            <span className="text-[11.5px] text-[var(--text-tertiary)] font-mono">{item.sku}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge status={item.status} />
            <DeleteButton variantId={item.variantId} productName={item.name} />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <ColorSwatch color={item.color} />
          <span className="text-[13px] text-[var(--text-secondary)]">{item.color}</span>
          <span className="text-[var(--text-tertiary)]">·</span>
          <span className="text-[13px] text-[var(--text-secondary)]">{item.size}</span>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)]">
          <div className="flex flex-col">
            <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide font-semibold mb-1">Stock</span>
            <StockControl item={item} />
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
    </div>
  );
}

export default function ProductsTable({ items, loading, viewMode }: ProductsTableProps) {
  if (loading) {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-[14px] bg-[var(--surface-soft)] border border-[var(--border)]" />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_8px_rgba(28,27,25,0.03)] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[850px]">
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
                <th className="pb-3 pt-4 font-bold">Status</th>
                <th className="pb-3 pt-4 pr-4 font-bold text-right">Actions</th>
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
        <table className="w-full text-left border-collapse min-w-[850px]">
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
              <th className="pb-3 pt-4 font-bold">Status</th>
              <th className="pb-3 pt-4 pr-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-[13.5px]">
            {items.map((item) => (
              <tr key={item.variantId} className="transition-colors hover:bg-[var(--surface-soft)]">
                {/* Checkbox */}
                <td className="py-3.5 pl-4">
                  <input type="checkbox" className="rounded border-[var(--border-strong)] accent-[var(--accent)]" />
                </td>

                {/* Product image + name + SKU */}
                <td className="py-3.5 pl-3">
                  <div className="flex items-center gap-3">
                    <ProductThumb images={item.images} name={item.name} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--text)] truncate max-w-[200px]">{item.name}</span>
                      <span className="text-[11.5px] text-[var(--text-tertiary)] font-mono">{item.sku}</span>
                    </div>
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

                {/* Stock - Interactive +/- and click to edit */}
                <td className="py-3.5 font-semibold text-[var(--text)]">
                  <StockControl item={item} />
                </td>

                {/* Price */}
                <td className="py-3.5 font-semibold text-[var(--text)]">${item.price}</td>

                {/* Status */}
                <td className="py-3.5">
                  <StatusBadge status={item.status} />
                </td>

                {/* Actions (Delete) */}
                <td className="py-3.5 pr-4 text-right">
                  <DeleteButton variantId={item.variantId} productName={item.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
