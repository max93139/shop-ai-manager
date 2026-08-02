'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Search, ChevronDown, X, RotateCcw, LayoutGrid, List } from 'lucide-react';
import type { ProductFilters, FilterOptions, StatusCounts } from '../../../../../store/slices/productsSlice';

export interface ProductsFiltersProps {
  filters: ProductFilters;
  filterOptions: FilterOptions;
  statusCounts: StatusCounts;
  viewMode: 'table' | 'grid';
  onFilterChange: (partial: Partial<ProductFilters>) => void;
  onResetFilters: () => void;
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

/* ─── Small select dropdown component ─── */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] pl-3 pr-8 py-[7px] text-[13px] font-medium text-[var(--text)] shadow-sm transition-colors hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:outline-none cursor-pointer min-w-[120px]"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-tertiary)]" />
    </div>
  );
}

/* ─── Status tab pill ─── */
function StatusTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-[5px] text-[12.5px] font-semibold transition-all duration-150 ${
        active
          ? 'bg-[var(--accent)] text-white shadow-sm'
          : 'bg-[var(--surface-soft)] text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]'
      }`}
    >
      {label}
      <span
        className={`text-[11px] font-bold ${
          active ? 'text-white/80' : 'text-[var(--text-tertiary)]'
        }`}
      >
        ({count})
      </span>
    </button>
  );
}

export default function ProductsFilters({
  filters,
  filterOptions,
  statusCounts,
  viewMode,
  onFilterChange,
  onResetFilters,
  onViewModeChange,
}: ProductsFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ search: searchValue });
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue]);

  // Sync external filter changes
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const hasActiveFilters =
    filters.search || filters.category || filters.brand || filters.color || filters.size;

  return (
    <div className="flex flex-col gap-3">
      {/* Top row: Search + Dropdowns + View toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] pl-9 pr-8 py-[7px] text-[13px] text-[var(--text)] placeholder:text-[var(--text-tertiary)] shadow-sm transition-colors focus:border-[var(--accent)] focus:outline-none"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                onFilterChange({ search: '' });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text)] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterSelect
            label="All categories"
            value={filters.category}
            options={filterOptions.categories}
            onChange={(v) => onFilterChange({ category: v })}
          />
          <FilterSelect
            label="All brands"
            value={filters.brand}
            options={filterOptions.brands}
            onChange={(v) => onFilterChange({ brand: v })}
          />
          <FilterSelect
            label="All sizes"
            value={filters.size}
            options={filterOptions.sizes}
            onChange={(v) => onFilterChange({ size: v })}
          />
          <FilterSelect
            label="All colors"
            value={filters.color}
            options={filterOptions.colors}
            onChange={(v) => onFilterChange({ color: v })}
          />

          {/* Reset */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                onResetFilters();
              }}
              className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-[7px] text-[12.5px] font-medium text-[var(--text-secondary)] shadow-sm transition-all hover:text-[var(--text)] hover:border-[var(--border-strong)]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-0.5 shadow-sm ml-auto shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`rounded-[6px] p-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text)]'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`rounded-[6px] p-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text)]'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <StatusTab
          label="All"
          count={statusCounts.all}
          active={filters.status === 'all'}
          onClick={() => onFilterChange({ status: 'all' })}
        />
        <StatusTab
          label="Active"
          count={statusCounts.active}
          active={filters.status === 'active'}
          onClick={() => onFilterChange({ status: 'active' })}
        />
        <StatusTab
          label="Low stock"
          count={statusCounts.low_stock}
          active={filters.status === 'low_stock'}
          onClick={() => onFilterChange({ status: 'low_stock' })}
        />
        <StatusTab
          label="Out of stock"
          count={statusCounts.out_of_stock}
          active={filters.status === 'out_of_stock'}
          onClick={() => onFilterChange({ status: 'out_of_stock' })}
        />
      </div>
    </div>
  );
}
