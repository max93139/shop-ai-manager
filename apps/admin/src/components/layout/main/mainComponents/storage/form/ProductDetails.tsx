'use client';

import React, { useState } from 'react';

export interface ProductDetailsProps {
  name: string;
  category: string;
  brand: string;
  price: string;
  brandOptions: string[];
  categories: string[];
  onNameChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onBrandChange: (val: string) => void;
  onPriceChange: (val: string) => void;
  onAddBrandOption: (brandName: string) => void;
}

export default function ProductDetails({
  name,
  category,
  brand,
  price,
  brandOptions,
  categories,
  onNameChange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onAddBrandOption,
}: ProductDetailsProps) {
  const [brandQuery, setBrandQuery] = useState(brand);
  const [isBrandListOpen, setIsBrandListOpen] = useState(false);

  const handleSelectBrand = (selectedBrand: string) => {
    onBrandChange(selectedBrand);
    setBrandQuery(selectedBrand);
    setIsBrandListOpen(false);
  };

  const handleAddBrand = (newBrand: string) => {
    const trimmed = newBrand.trim();
    if (!trimmed) return;
    onAddBrandOption(trimmed);
    onBrandChange(trimmed);
    setBrandQuery(trimmed);
    setIsBrandListOpen(false);
  };

  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-[15px] font-bold text-[var(--text)]">Details</h2>

      {/* Product Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Product name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Wool Overcoat, Leather Belt, Wool Beanie"
          className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Combobox */}
      <div className="flex flex-col gap-1.5 relative">
        <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Brand</label>
        <input
          type="text"
          value={brandQuery}
          onFocus={() => setIsBrandListOpen(true)}
          onChange={(e) => {
            setBrandQuery(e.target.value);
            onBrandChange(e.target.value);
            setIsBrandListOpen(true);
          }}
          placeholder="Search or add a brand…"
          className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />

        {/* Combobox Dropdown List */}
        {isBrandListOpen && (
          <div className="absolute top-[100%] left-0 right-0 z-20 mt-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden max-h-48 overflow-y-auto">
            {brandOptions
              .filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()))
              .map((b) => (
                <div
                  key={b}
                  onClick={() => handleSelectBrand(b)}
                  className="px-3 py-2 text-[13px] text-[var(--text)] hover:bg-[var(--surface-soft)] cursor-pointer flex justify-between items-center"
                >
                  <span>{b}</span>
                </div>
              ))}
            {brandQuery.trim() &&
              !brandOptions.some((b) => b.toLowerCase() === brandQuery.trim().toLowerCase()) && (
                <div
                  onClick={() => handleAddBrand(brandQuery)}
                  className="px-3 py-2 text-[13px] font-semibold text-[var(--accent-hover)] hover:bg-[var(--surface-soft)] cursor-pointer border-t border-[var(--border)]"
                >
                  + Add "{brandQuery}" as new brand
                </div>
              )}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Price</label>
        <input
          type="text"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="$0.00"
          className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}
