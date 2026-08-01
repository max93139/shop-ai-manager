'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface VariantBuilderProps {
  productType: string;
  sizeMode: string;
  selectedSizes: string[];
  customSizes: string[];
  colors: ColorOption[];
  selectedColors: string[];
  inStock: string;
  reserved: string;
  onProductTypeChange: (typeKey: string) => void;
  onSizeModeChange: (modeKey: string) => void;
  onSelectedSizesChange: (sizes: string[] | ((prev: string[]) => string[])) => void;
  onCustomSizesChange: (sizes: string[] | ((prev: string[]) => string[])) => void;
  onColorsChange: (colors: ColorOption[] | ((prev: ColorOption[]) => ColorOption[])) => void;
  onSelectedColorsChange: (colors: string[] | ((prev: string[]) => string[])) => void;
  onInStockChange: (val: string) => void;
  onReservedChange: (val: string) => void;
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

export default function VariantBuilder({
  productType,
  sizeMode,
  selectedSizes,
  customSizes,
  colors,
  selectedColors,
  inStock,
  reserved,
  onProductTypeChange,
  onSizeModeChange,
  onSelectedSizesChange,
  onCustomSizesChange,
  onColorsChange,
  onSelectedColorsChange,
  onInStockChange,
  onReservedChange,
}: VariantBuilderProps) {
  const [showAddSizeInput, setShowAddSizeInput] = useState(false);
  const [newSizeInput, setNewSizeInput] = useState('');

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#7A6A54');
  const [newColorName, setNewColorName] = useState('');

  // Pointer / Drag Swipe Selection for Size Chips
  const [isSwipingSizes, setIsSwipingSizes] = useState(false);
  const swipeModeRef = useRef<'select' | 'deselect'>('select');

  useEffect(() => {
    const stopSwipe = () => setIsSwipingSizes(false);
    window.addEventListener('pointerup', stopSwipe);
    window.addEventListener('mouseup', stopSwipe);
    window.addEventListener('touchend', stopSwipe);
    return () => {
      window.removeEventListener('pointerup', stopSwipe);
      window.removeEventListener('mouseup', stopSwipe);
      window.removeEventListener('touchend', stopSwipe);
    };
  }, []);

  const startSizeSwipe = (size: string) => {
    setIsSwipingSizes(true);
    const isCurrentlySelected = selectedSizes.includes(size);
    const mode = isCurrentlySelected ? 'deselect' : 'select';
    swipeModeRef.current = mode;

    if (mode === 'select') {
      onSelectedSizesChange((prev) => (prev.includes(size) ? prev : [...prev, size]));
    } else {
      onSelectedSizesChange((prev) => prev.filter((s) => s !== size));
    }
  };

  const handleSizePointerOver = (size: string) => {
    if (!isSwipingSizes) return;
    const mode = swipeModeRef.current;
    if (mode === 'select') {
      onSelectedSizesChange((prev) => (prev.includes(size) ? prev : [...prev, size]));
    } else {
      onSelectedSizesChange((prev) => prev.filter((s) => s !== size));
    }
  };

  const handleTouchMoveSizeGrid = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwipingSizes) return;
    const touch = e.touches[0];
    if (!touch) return;
    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
    const sizeAttr =
      targetEl?.getAttribute('data-size') ||
      targetEl?.closest('[data-size]')?.getAttribute('data-size');
    if (sizeAttr) {
      handleSizePointerOver(sizeAttr);
    }
  };

  const handleAddCustomSize = () => {
    const trimmed = newSizeInput.trim();
    if (!trimmed) return;
    if (!customSizes.includes(trimmed)) {
      onCustomSizesChange((prev) => [...prev, trimmed]);
    }
    if (!selectedSizes.includes(trimmed)) {
      onSelectedSizesChange((prev) => [...prev, trimmed]);
    }
    setNewSizeInput('');
    setShowAddSizeInput(false);
  };

  const handleRemoveCustomSize = (sizeToRemove: string) => {
    onCustomSizesChange((prev) => prev.filter((s) => s !== sizeToRemove));
    onSelectedSizesChange((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const toggleColorSelection = (colorName: string) => {
    onSelectedColorsChange((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleAddColorConfirm = () => {
    const nameToUse = newColorName.trim() || newColorHex;
    if (!colors.some((c) => c.name.toLowerCase() === nameToUse.toLowerCase())) {
      onColorsChange((prev) => [...prev, { name: nameToUse, hex: newColorHex }]);
    }
    if (!selectedColors.includes(nameToUse)) {
      onSelectedColorsChange((prev) => [...prev, nameToUse]);
    }
    setNewColorName('');
    setShowColorPicker(false);
  };

  const handleRemoveColor = (colorName: string) => {
    onColorsChange((prev) => prev.filter((c) => c.name !== colorName));
    onSelectedColorsChange((prev) => prev.filter((c) => c !== colorName));
  };

  const baseSizes = SIZE_PRESETS[sizeMode] || [];
  const allSizesList = [
    ...baseSizes,
    ...customSizes.filter((cs) => !baseSizes.includes(cs)),
  ];

  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col select-none">
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
              onClick={() => onProductTypeChange(t.key)}
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
          Pick a size format, then select or swipe across sizes to toggle multiple at once.
        </p>
        {/* Segmented Control */}
        <div className="inline-flex rounded-[10px] bg-[var(--surface-sunken)] p-1 gap-1 mb-3.5 flex-wrap">
          {SIZE_MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => onSizeModeChange(m.key)}
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

        {/* Size Chips Grid */}
        <div
          onTouchMove={handleTouchMoveSizeGrid}
          className="flex flex-wrap gap-2 items-center touch-none select-none"
        >
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
                    data-size={s}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      startSizeSwipe(s);
                    }}
                    onPointerOver={() => handleSizePointerOver(s)}
                    className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3.5 py-2 text-[12.5px] font-semibold transition-all select-none ${
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
            <label className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface)] p-0.5 shadow-sm transition-transform hover:scale-105">
              <span
                className="h-full w-full rounded-full transition-colors"
                style={{ backgroundColor: newColorHex }}
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
            </label>
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
              onChange={(e) => onInStockChange(e.target.value)}
              className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">Reserved</label>
            <input
              type="number"
              value={reserved}
              onChange={(e) => onReservedChange(e.target.value)}
              className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
