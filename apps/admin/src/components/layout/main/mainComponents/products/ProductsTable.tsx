'use client';

import React, { useState } from 'react';
import { Package, Pencil, Trash2 } from 'lucide-react';
import EditProductModal from './EditProductModal';
import { useAppDispatch } from '../../../../../store';
import {
  updateVariant,
  updateVariantStock,
  deleteVariant,
  type ProductItem,
} from '../../../../../store/slices/productsSlice';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMoney } from '@/utils/format';

export interface ProductsTableProps {
  items: ProductItem[];
  loading?: boolean;
  viewMode: 'table' | 'grid';
}

function StatusBadge({
  status,
  labels,
}: {
  status: ProductItem['status'];
  labels: { active: string; low_stock: string; out_of_stock: string };
}) {
  const config = {
    active: { label: labels.active, dot: 'bg-accent', bg: 'bg-positive-soft', text: 'text-positive' },
    low_stock: { label: labels.low_stock, dot: 'bg-[#B7791F]', bg: 'bg-warning-soft', text: 'text-warning' },
    out_of_stock: { label: labels.out_of_stock, dot: 'bg-danger', bg: 'bg-danger-soft', text: 'text-danger' },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function ColorSwatch({ color, title }: { color: string; title?: string }) {
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
      title={title || color}
    />
  );
}

function ProductImage({ images, name }: { images: string[]; name: string }) {
  const src = images?.[0];
  if (!src) {
    return (
      <div className="flex items-center justify-center bg-[var(--surface-sunken)] w-full h-full text-[var(--text-tertiary)]">
        <Package className="h-8 w-8" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
  );
}

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

function StockControl({
  item,
  titles,
}: {
  item: ProductItem;
  titles: { decrease: string; increase: string; clickToEdit: string };
}) {
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
        title={titles.decrease}
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
          title={titles.clickToEdit}
        >
          {item.stock}
        </span>
      )}
      <button
        type="button"
        onClick={() => handleUpdate(item.stock + 1)}
        className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface-soft)] text-[12px] font-bold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
        title={titles.increase}
      >
        +
      </button>
    </div>
  );
}

function PriceControl({
  item,
  title,
}: {
  item: ProductItem;
  title: string;
}) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(String(item.price));

  const handleSave = () => {
    setIsEditing(false);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0 && parsed !== item.price) {
      dispatch(updateVariant({ variantId: item.variantId, price: parsed }));
    } else {
      setVal(String(item.price));
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-0.5">
        <span className="text-[13px] font-bold text-[var(--text-secondary)]">₴</span>
        <input
          type="number"
          step="0.01"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
          autoFocus
          className="w-16 text-[13px] font-bold text-[var(--text)] bg-[var(--surface)] border border-[var(--accent)] rounded px-1.5 py-0.5 shadow-sm"
        />
      </div>
    );
  }

  return (
    <span
      onClick={() => {
        setVal(String(item.price));
        setIsEditing(true);
      }}
      className="cursor-pointer font-bold tabular-nums text-[var(--text)] hover:underline hover:text-[var(--accent)] transition-colors"
      title={title}
    >
      {formatMoney(Number(item.price))}
    </span>
  );
}

function EditButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded-sm p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] transition-colors"
    >
      <Pencil className="h-3.5 w-3.5" />
    </button>
  );
}

function DeleteButton({
  variantId,
  productName,
  labels,
}: {
  variantId: string;
  productName: string;
  labels: { delete: string; cancel: string; tooltip: string };
}) {
  const dispatch = useAppDispatch();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    dispatch(deleteVariant(variantId));
  };

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] transition-colors"
        >
          {labels.cancel}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded bg-danger px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm hover:bg-red-700 transition-colors"
        >
          {labels.delete}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="p-1.5 text-[var(--text-tertiary)] transition-colors hover:text-danger rounded hover:bg-[var(--surface-soft)]"
      title={`${labels.tooltip} ${productName}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

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

function ProductCard({
  item,
  onEdit,
}: {
  item: ProductItem;
  onEdit: (item: ProductItem) => void;
}) {
  const { t, translateCategory, translateColor } = useTranslation();

  const statusLabels = {
    active: t.statusActive,
    low_stock: t.statusLowStock,
    out_of_stock: t.statusOutOfStock,
  };

  const actionLabels = {
    delete: t.actionDelete,
    cancel: t.actionCancel,
    tooltip: t.deleteTooltip,
  };

  const stockTitles = {
    decrease: t.decreaseStock,
    increase: t.increaseStock,
    clickToEdit: t.clickToEditStock,
  };

  return (
    <div className="group flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      <div className="relative w-full aspect-[4/3] bg-[var(--surface-sunken)] overflow-hidden">
        <ProductImage images={item.images} name={item.name} />
        <div className="absolute top-2.5 left-2.5 z-10">
          <StatusBadge status={item.status} labels={statusLabels} />
        </div>
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center bg-white/90 rounded-lg p-0.5 shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
          <EditButton onClick={() => onEdit(item)} label={t.actionEdit} />
          <DeleteButton variantId={item.variantId} productName={item.name} labels={actionLabels} />
        </div>
      </div>

      <div className="flex flex-col p-4 gap-3 flex-1 justify-between">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[14.5px] font-semibold text-[var(--text)] line-clamp-2 leading-snug">
            {item.name}
          </span>
          <span className="text-[11.5px] text-[var(--text-tertiary)] font-mono">
            {item.sku}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--surface-soft)] px-2 py-1">
            <ColorSwatch color={item.color} title={translateColor(item.color)} />
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              {translateColor(item.color)}
            </span>
          </div>
          <span className="inline-flex items-center rounded-md bg-[var(--surface-soft)] px-2 py-1 text-[12px] font-semibold text-[var(--text-secondary)]">
            {item.size}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)]">
          <div className="flex flex-col">
            <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide font-semibold mb-1">
              {t.thStock}
            </span>
            <StockControl item={item} titles={stockTitles} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide font-semibold mb-1">
              {t.thPrice}
            </span>
            <PriceControl item={item} title={t.clickToEditPrice} />
          </div>
        </div>

        <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
          <span className="font-medium truncate max-w-[140px]">{translateCategory(item.category)}</span>
          {item.brand && (
            <span className="font-semibold text-[var(--text-tertiary)] truncate max-w-[100px]">{item.brand}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsTable({ items, loading, viewMode }: ProductsTableProps) {
  const { t, translateCategory, translateColor } = useTranslation();
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const editModal = <EditProductModal item={editing} onClose={() => setEditing(null)} />;

  const statusLabels = {
    active: t.statusActive,
    low_stock: t.statusLowStock,
    out_of_stock: t.statusOutOfStock,
  };

  const actionLabels = {
    delete: t.actionDelete,
    cancel: t.actionCancel,
    tooltip: t.deleteTooltip,
  };

  const stockTitles = {
    decrease: t.decreaseStock,
    increase: t.increaseStock,
    clickToEdit: t.clickToEditStock,
  };

  if (loading) {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-lg bg-[var(--surface-soft)] border border-[var(--border)]" />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <th className="pb-3 pt-4 pl-4 w-10" />
                <th className="pb-3 pt-4 pl-3 font-bold">{t.thProduct}</th>
                <th className="pb-3 pt-4 font-bold">{t.thCategory}</th>
                <th className="pb-3 pt-4 font-bold">{t.thBrand}</th>
                <th className="pb-3 pt-4 font-bold">{t.thColor}</th>
                <th className="pb-3 pt-4 font-bold">{t.thSize}</th>
                <th className="pb-3 pt-4 font-bold">{t.thStock}</th>
                <th className="pb-3 pt-4 font-bold">{t.thPrice}</th>
                <th className="pb-3 pt-4 font-bold">{t.thStatus}</th>
                <th className="pb-3 pt-4 pr-4 font-bold text-right">{t.thActions}</th>
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
        <p className="text-[15px] font-medium text-[var(--text-secondary)]">{t.noProductsFound}</p>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">{t.noProductsFoundSub}</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard key={item.variantId} item={item} onEdit={setEditing} />
        ))}
        {editModal}
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              <th className="pb-3 pt-4 pl-4 w-10">
                <input type="checkbox" className="rounded border-[var(--border-strong)] accent-[var(--accent)]" />
              </th>
              <th className="pb-3 pt-4 pl-3 font-bold">{t.thProduct}</th>
              <th className="pb-3 pt-4 font-bold">{t.thCategory}</th>
              <th className="pb-3 pt-4 font-bold">{t.thBrand}</th>
              <th className="pb-3 pt-4 font-bold">{t.thColor}</th>
              <th className="pb-3 pt-4 font-bold">{t.thSize}</th>
              <th className="pb-3 pt-4 font-bold">{t.thStock}</th>
              <th className="pb-3 pt-4 font-bold">{t.thPrice}</th>
              <th className="pb-3 pt-4 font-bold">{t.thStatus}</th>
              <th className="pb-3 pt-4 pr-4 font-bold text-right">{t.thActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-[13.5px]">
            {items.map((item) => (
              <tr key={item.variantId} className="transition-colors hover:bg-[var(--surface-soft)]">
                <td className="py-3.5 pl-4">
                  <input type="checkbox" className="rounded border-[var(--border-strong)] accent-[var(--accent)]" />
                </td>

                <td className="py-3.5 pl-3">
                  <div className="flex items-center gap-3">
                    <ProductThumb images={item.images} name={item.name} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--text)] truncate max-w-[200px]">{item.name}</span>
                      <span className="text-[11.5px] text-[var(--text-tertiary)] font-mono">{item.sku}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 text-[var(--text-secondary)]">{translateCategory(item.category)}</td>
                <td className="py-3.5 text-[var(--text-secondary)]">{item.brand || '—'}</td>

                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <ColorSwatch color={item.color} title={translateColor(item.color)} />
                    <span className="text-[var(--text-secondary)] hidden lg:inline">{translateColor(item.color)}</span>
                  </div>
                </td>

                <td className="py-3.5 text-[var(--text-secondary)]">{item.size}</td>

                <td className="py-3.5 font-semibold text-[var(--text)]">
                  <StockControl item={item} titles={stockTitles} />
                </td>

                <td className="py-3.5 font-semibold text-[var(--text)]">
                  <PriceControl item={item} title={t.clickToEditPrice} />
                </td>

                <td className="py-3.5">
                  <StatusBadge status={item.status} labels={statusLabels} />
                </td>

                <td className="py-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <EditButton onClick={() => setEditing(item)} label={t.actionEdit} />
                    <DeleteButton variantId={item.variantId} productName={item.name} labels={actionLabels} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editModal}
    </div>
  );
}
