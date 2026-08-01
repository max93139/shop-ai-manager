'use client';

import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Upload } from 'lucide-react';

export interface CreateProductFormProps {
  onBack: () => void;
  onSave?: (data: any) => void;
}

interface ColorOption {
  name: string;
  hex: string;
}

const PRODUCT_TYPES = [
  { key: 'apparel', label: 'Apparel', sizeMode: 'clothing' },
  { key: 'footwear', label: 'Footwear', sizeMode: 'shoe' },
  { key: 'headwear', label: 'Headwear', sizeMode: 'onesize' },
  { key: 'accessory', label: 'Accessories (belts, bags…)', sizeMode: 'onesize' },
  { key: 'other', label: 'Other', sizeMode: 'custom' },
];

const SIZE_PRESETS: Record<string, string[]> = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoe: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  onesize: ['One size'],
  custom: [],
};

const SIZE_MODES = [
  { key: 'clothing', label: 'Clothing (XS–XXL)' },
  { key: 'shoe', label: 'Shoe size (EU)' },
  { key: 'onesize', label: 'One size' },
  { key: 'custom', label: 'Custom' },
];

const DEFAULT_COLORS: ColorOption[] = [
  { name: 'Charcoal', hex: '#2B2B2E' },
  { name: 'Camel', hex: '#7A6A54' },
];

const DEFAULT_BRANDS = ['Atelier Line', 'Maison Nord', 'Rowe & Co'];

const CATEGORIES = [
  'Outerwear',
  'Knitwear',
  'Trousers',
  'Shirts',
  'Dresses',
  'Footwear',
  'Headwear',
  'Belts',
  'Bags',
  'Accessories',
  'Other',
];

export default function CreateProductForm({ onBack, onSave }: CreateProductFormProps) {
  // Product Basic State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Outerwear');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState('34');
  const [reserved, setReserved] = useState('5');

  // Type & Sizes State
  const [productType, setProductType] = useState('apparel');
  const [sizeMode, setSizeMode] = useState('clothing');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M']);
  const [customSizes, setCustomSizes] = useState<string[]>([]);
  const [showAddSizeInput, setShowAddSizeInput] = useState(false);
  const [newSizeInput, setNewSizeInput] = useState('');

  // Colors State
  const [colors, setColors] = useState<ColorOption[]>(DEFAULT_COLORS);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Charcoal']);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#7A6A54');
  const [newColorName, setNewColorName] = useState('');

  // Brand Combobox State
  const [brandOptions, setBrandOptions] = useState<string[]>(DEFAULT_BRANDS);
  const [brandQuery, setBrandQuery] = useState('');
  const [isBrandListOpen, setIsBrandListOpen] = useState(false);

  // Handlers
  const handleProductTypeChange = (typeKey: string) => {
    setProductType(typeKey);
    const targetType = PRODUCT_TYPES.find((t) => t.key === typeKey);
    const presetMode = targetType ? targetType.sizeMode : 'clothing';
    setSizeMode(presetMode);
    setSelectedSizes(presetMode === 'onesize' ? ['One size'] : []);
  };

  const handleSizeModeChange = (modeKey: string) => {
    setSizeMode(modeKey);
    setSelectedSizes(modeKey === 'onesize' ? ['One size'] : []);
  };

  const toggleSizeSelection = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAddCustomSize = () => {
    const trimmed = newSizeInput.trim();
    if (!trimmed) return;
    if (!customSizes.includes(trimmed)) {
      setCustomSizes((prev) => [...prev, trimmed]);
    }
    if (!selectedSizes.includes(trimmed)) {
      setSelectedSizes((prev) => [...prev, trimmed]);
    }
    setNewSizeInput('');
    setShowAddSizeInput(false);
  };

  const handleRemoveCustomSize = (sizeToRemove: string) => {
    setCustomSizes((prev) => prev.filter((s) => s !== sizeToRemove));
    setSelectedSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const toggleColorSelection = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleAddColorConfirm = () => {
    const nameToUse = newColorName.trim() || newColorHex;
    if (!colors.some((c) => c.name.toLowerCase() === nameToUse.toLowerCase())) {
      setColors((prev) => [...prev, { name: nameToUse, hex: newColorHex }]);
    }
    if (!selectedColors.includes(nameToUse)) {
      setSelectedColors((prev) => [...prev, nameToUse]);
    }
    setNewColorName('');
    setShowColorPicker(false);
  };

  const handleRemoveColor = (colorName: string) => {
    setColors((prev) => prev.filter((c) => c.name !== colorName));
    setSelectedColors((prev) => prev.filter((c) => c !== colorName));
  };

  const handleSelectBrand = (selectedBrand: string) => {
    setBrand(selectedBrand);
    setBrandQuery(selectedBrand);
    setIsBrandListOpen(false);
  };

  const handleAddBrand = (newBrand: string) => {
    const trimmed = newBrand.trim();
    if (!trimmed) return;
    if (!brandOptions.includes(trimmed)) {
      setBrandOptions((prev) => [...prev, trimmed]);
    }
    setBrand(trimmed);
    setBrandQuery(trimmed);
    setIsBrandListOpen(false);
  };

  // Compute size list
  const baseSizes = SIZE_PRESETS[sizeMode] || [];
  const allSizesList = [
    ...baseSizes,
    ...customSizes.filter((cs) => !baseSizes.includes(cs)),
  ];

  // Calculated Variant Count
  const variantCount = Math.max(selectedSizes.length, 1) * Math.max(selectedColors.length, 1);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-7 lg:p-8 max-w-[1200px] mx-auto w-full">
      {/* Top Header / Breadcrumbs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-[var(--text-tertiary)] mb-1">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Storage</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-[var(--text)]">
              {name.trim() || 'New product'}
            </span>
          </div>
          <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] text-[var(--text)] tracking-[-0.01em]">
            {name.trim() || 'New product'}
          </h1>
          <p className="font-mono text-[12.5px] sm:text-[13px] text-[var(--text-secondary)] mt-1">
            Draft · {category}
            {brand ? ` · ${brand}` : ''}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] shadow-sm hover:bg-[var(--surface-soft)] transition-all active:scale-95"
          >
            Publish to Telegram
          </button>
          <button
            type="button"
            onClick={() => onSave?.({ name, category, brand, price, selectedSizes, selectedColors, inStock, reserved })}
            className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all active:scale-95"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Main Grid Layout (Left: 7 cols, Right: 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
          {/* Card 1: Product Images / Hero Placeholder */}
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-[64px_1fr] gap-3">
              {/* Thumbs */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto">
                <div className="h-[60px] w-[60px] rounded-[10px] bg-[var(--surface-sunken)] border-2 border-[var(--accent)] shrink-0" />
                <div className="h-[60px] w-[60px] rounded-[10px] bg-[var(--surface-sunken)] border border-transparent shrink-0" />
                <div className="h-[60px] w-[60px] rounded-[10px] bg-[var(--surface-sunken)] border border-transparent shrink-0" />
                <div className="h-[60px] w-[60px] rounded-[10px] bg-[var(--surface-sunken)] border border-transparent shrink-0" />
              </div>
              {/* Hero Image Box */}
              <div className="aspect-square w-full rounded-[14px] bg-gradient-to-br from-[#F1EEE6] to-[#E4DFD2] flex flex-col items-center justify-center text-[var(--text-tertiary)] gap-2 cursor-pointer hover:opacity-95 transition-opacity">
                <ImageIcon className="h-10 w-10 text-[var(--text-tertiary)]" strokeWidth={1.5} />
                <span className="text-[12px] font-medium text-[var(--text-secondary)] flex items-center gap-1">
                  <Upload className="h-3.5 w-3.5" /> Upload images
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Variants — Universal Builder */}
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col">
            {/* Product Type */}
            <div>
              <h2 className="text-[15px] font-bold text-[var(--text)]">Product type</h2>
              <p className="text-[12px] text-[var(--text-tertiary)] mb-3">
                Choosing a type sets a sensible size preset below — you can still edit it freely.
              </p>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_TYPES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => handleProductTypeChange(t.key)}
                    className={`rounded-[8px] border px-3.5 py-2 text-[12.5px] font-semibold transition-all ${
                      productType === t.key
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-hover)]'
                        : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--text-tertiary)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dotted Divider */}
            <div className="my-5 h-[1px] w-full border-b border-dashed border-[var(--border-strong)]" />

            {/* Sizes Section */}
            <div>
              <h2 className="text-[15px] font-bold text-[var(--text)] mb-1">Sizes</h2>
              <p className="text-[12px] text-[var(--text-tertiary)] mb-3">
                Pick a size format, then select which sizes this product comes in.
              </p>
              {/* Segmented Control */}
              <div className="inline-flex rounded-[10px] bg-[var(--surface-sunken)] p-1 gap-1 mb-3.5 flex-wrap">
                {SIZE_MODES.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleSizeModeChange(m.key)}
                    className={`rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
                      sizeMode === m.key
                        ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Size Chips */}
              <div className="flex flex-wrap gap-2 items-center">
                {sizeMode === 'onesize' ? (
                  <button
                    type="button"
                    className="rounded-[8px] border border-[var(--accent)] bg-[var(--accent-soft)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--accent-hover)]"
                  >
                    One size
                  </button>
                ) : (
                  <>
                    {allSizesList.map((s) => {
                      const isSelected = selectedSizes.includes(s);
                      const isCustom = customSizes.includes(s);

                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSizeSelection(s)}
                          className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3.5 py-2 text-[12.5px] font-semibold transition-all ${
                            isSelected
                              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-hover)]'
                              : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--text-tertiary)]'
                          }`}
                        >
                          <span>{s}</span>
                          {isCustom && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCustomSize(s);
                              }}
                              className="text-[14px] opacity-60 hover:opacity-100"
                            >
                              ✕
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setShowAddSizeInput(!showAddSizeInput)}
                      className="rounded-[8px] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--text)] hover:border-[var(--text-tertiary)]"
                    >
                      + Add
                    </button>
                  </>
                )}
              </div>

              {/* Inline Add Custom Size Row */}
              {showAddSizeInput && sizeMode !== 'onesize' && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSize()}
                    placeholder="e.g. 56 cm, Kids M, 3XL"
                    className="max-w-[200px] rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)]"
                  >
                    Add size
                  </button>
                </div>
              )}
            </div>

            {/* Dotted Divider */}
            <div className="my-5 h-[1px] w-full border-b border-dashed border-[var(--border-strong)]" />

            {/* Colors Section */}
            <div>
              <h2 className="text-[15px] font-bold text-[var(--text)]">Colors</h2>
              <p className="text-[12px] text-[var(--text-tertiary)] mb-3">
                Any color can be added — not limited to a fixed palette.
              </p>
              <div className="flex flex-wrap gap-2.5 items-center">
                {colors.map((c) => {
                  const isSelected = selectedColors.includes(c.name);

                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColorSelection(c.name)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-hover)]'
                          : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveColor(c.name);
                        }}
                        className="opacity-50 hover:opacity-100 text-[13px]"
                      >
                        ✕
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowColorPicker(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--border-strong)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--text)] hover:border-[var(--text-tertiary)] transition-colors"
              >
                + Add color
              </button>

              {/* Color Picker Row */}
              {showColorPicker && (
                <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-0.5"
                  />
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Color name, e.g. Camel"
                    className="flex-1 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddColorConfirm}
                    className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)]"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(false)}
                    className="rounded-[var(--radius-sm)] px-2.5 py-2 text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text)]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Dotted Divider */}
            <div className="my-5 h-[1px] w-full border-b border-dashed border-[var(--border-strong)]" />

            {/* Inventory Inputs */}
            <div>
              <h2 className="text-[15px] font-bold text-[var(--text)] mb-3">Inventory</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">In stock</label>
                  <input
                    type="number"
                    value={inStock}
                    onChange={(e) => setInStock(e.target.value)}
                    className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Reserved</label>
                  <input
                    type="number"
                    value={reserved}
                    onChange={(e) => setReserved(e.target.value)}
                    className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
          {/* Details Card */}
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-[15px] font-bold text-[var(--text)]">Details</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Product name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wool Overcoat, Leather Belt, Wool Beanie"
                className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
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
                  setBrand(e.target.value);
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

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$0.00"
                className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col gap-2">
            <h2 className="text-[15px] font-bold text-[var(--text)]">Summary</h2>
            <p className="text-[12px] text-[var(--text-tertiary)] mb-2">
              Live preview of the variant matrix that will be generated.
            </p>

            <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed font-medium">
              <div>
                <strong>
                  {selectedSizes.length > 0
                    ? selectedSizes.join(' · ')
                    : '— no sizes selected —'}
                </strong>
              </div>
              <div>
                {selectedColors.length > 0
                  ? selectedColors.join(' · ')
                  : '— no colors selected —'}
              </div>
              <div className="mt-2 text-[12px] text-[var(--text-tertiary)] font-semibold">
                {variantCount} variant{variantCount === 1 ? '' : 's'} will be created
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
