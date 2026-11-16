'use client';

import React, { useState, useRef, useEffect } from 'react';
import AddColorModal from './AddColorModal';
import { useTranslation } from '@/hooks/useTranslation';

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
  sizeStocks: Record<string, number>;
  onProductTypeChange: (typeKey: string) => void;
  onSizeModeChange: (modeKey: string) => void;
  onSelectedSizesChange: (sizes: string[] | ((prev: string[]) => string[])) => void;
  onCustomSizesChange: (sizes: string[] | ((prev: string[]) => string[])) => void;
  onColorsChange: (colors: ColorOption[] | ((prev: ColorOption[]) => ColorOption[])) => void;
  onSelectedColorsChange: (colors: string[] | ((prev: string[]) => string[])) => void;
  onSizeStocksChange: (
    stocks: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;
}

const SIZE_PRESETS: Record<string, string[]> = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoe: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  onesize: ['One size'],
  custom: [],
};

export default function VariantBuilder({
  productType,
  sizeMode,
  selectedSizes,
  customSizes,
  colors,
  selectedColors,
  sizeStocks,
  onProductTypeChange,
  onSizeModeChange,
  onSelectedSizesChange,
  onCustomSizesChange,
  onColorsChange,
  onSelectedColorsChange,
  onSizeStocksChange,
}: VariantBuilderProps) {
  const { t, isUk, translateColor } = useTranslation();
  const [showAddSizeInput, setShowAddSizeInput] = useState(false);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [bulkStockInput, setBulkStockInput] = useState('');

  const productTypes = [
    { key: 'apparel', label: isUk ? 'Одяг' : 'Apparel', sizeMode: 'clothing' },
    { key: 'footwear', label: isUk ? 'Взуття' : 'Footwear', sizeMode: 'shoe' },
    { key: 'headwear', label: isUk ? 'Головні убори' : 'Headwear', sizeMode: 'onesize' },
    { key: 'accessory', label: isUk ? 'Аксесуари (ремені, сумки…)' : 'Accessories (belts, bags…)', sizeMode: 'onesize' },
    { key: 'other', label: isUk ? 'Інше' : 'Other', sizeMode: 'custom' },
  ];

  const sizeModes = [
    { key: 'clothing', label: isUk ? 'Одяг (XS–XXL)' : 'Clothing (XS–XXL)' },
    { key: 'shoe', label: isUk ? 'Розмір взуття (EU)' : 'Shoe size (EU)' },
    { key: 'onesize', label: isUk ? 'Один розмір' : 'One size' },
    { key: 'custom', label: isUk ? 'Власний' : 'Custom' },
  ];

  const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false);

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
    onSelectedColorsChange((prev) => {
      const isSelected = prev.includes(colorName);
      return isSelected
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName];
    });
  };

  const handleAddColorFromModal = (newColor: ColorOption) => {
    if (!colors.some((c) => c.name.toLowerCase() === newColor.name.toLowerCase())) {
      onColorsChange((prev) => [...prev, newColor]);
    }
    if (!selectedColors.includes(newColor.name)) {
      onSelectedColorsChange((prev) => [...prev, newColor.name]);
    }
  };

  const handleRemoveColor = (colorName: string) => {
    onColorsChange((prev) => prev.filter((c) => c.name !== colorName));
    onSelectedColorsChange((prev) => prev.filter((c) => c !== colorName));
  };

  // Helper to read stock value for a size (and optional color)
  const getStockForSize = (size: string, colorName?: string): number => {
    if (colorName) {
      const variantKey = `${colorName}:::${size}`;
      if (variantKey in sizeStocks) return sizeStocks[variantKey];
      return selectedColors.length <= 1 ? (sizeStocks[size] ?? 0) : 0;
    }
    return sizeStocks[size] ?? 0;
  };

  // Stock Change Handler
  const handleStockValueChange = (size: string, value: string, colorName?: string) => {
    const parsed = parseInt(value, 10);
    const num = isNaN(parsed) ? 0 : Math.max(0, parsed);

    onSizeStocksChange((prev) => {
      const updated = { ...prev };
      if (colorName) {
        updated[`${colorName}:::${size}`] = num;
        const colorsList = selectedColors.length > 0 ? selectedColors : [colorName];
        const aggregatedStock = colorsList.reduce((sum, c) => {
          const key = `${c}:::${size}`;
          return sum + (key in updated ? (updated[key] ?? 0) : (prev[key] ?? 0));
        }, 0);
        updated[size] = aggregatedStock;
      } else {
        updated[size] = num;
      }
      return updated;
    });
  };

  // Bulk Apply Stock to all selected sizes
  const handleApplyBulkStock = () => {
    const parsed = parseInt(bulkStockInput, 10);
    const num = isNaN(parsed) ? 0 : Math.max(0, parsed);

    onSizeStocksChange((prev) => {
      const updated = { ...prev };
      for (const s of selectedSizes) {
        if (selectedColors.length > 0) {
          for (const c of selectedColors) {
            updated[`${c}:::${s}`] = num;
          }
          updated[s] = num * selectedColors.length;
        } else {
          updated[s] = num;
        }
      }
      return updated;
    });
    setBulkStockInput('');
  };

  const baseSizes = SIZE_PRESETS[sizeMode] || [];
  const allSizesList = [
    ...baseSizes,
    ...customSizes.filter((cs) => !baseSizes.includes(cs)),
  ];

  // Calculate Total Stock Sum
  const effectiveColors = selectedColors.length > 0 ? selectedColors : ['Standard'];
  const effectiveSizes = selectedSizes.length > 0 ? selectedSizes : (sizeMode === 'onesize' ? ['One size'] : []);

  const totalStockSum = selectedColors.length > 1
    ? effectiveColors.reduce((acc, col) => {
        return acc + effectiveSizes.reduce((sAcc, sz) => sAcc + getStockForSize(sz, col), 0);
      }, 0)
    : effectiveSizes.reduce((acc, sz) => acc + getStockForSize(sz), 0);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col select-none">
      {/* Add Color Modal */}
      <AddColorModal
        isOpen={isAddColorModalOpen}
        onClose={() => setIsAddColorModalOpen(false)}
        onAddColor={handleAddColorFromModal}
      />

      {/* Product Type */}
      <div>
        <h2 className="text-[15px] font-bold text-[var(--text)]">
          {isUk ? 'Тип товару' : 'Product type'}
        </h2>
        <p className="text-[12px] text-[var(--text-tertiary)] mb-3">
          {isUk
            ? 'Вибір типу встановлює шаблон розмірів — ви можете вільно редагувати його.'
            : 'Choosing a type sets a sensible size preset below — you can still edit it freely.'}
        </p>
        <div className="flex flex-wrap gap-2">
          {productTypes.map((t) => (
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
        <h2 className="text-[15px] font-bold text-[var(--text)] mb-1">
          {t.sizesSectionTitle}
        </h2>
        <p className="text-[12px] text-[var(--text-tertiary)] mb-3">
          {isUk
            ? 'Оберіть формат розмірів та натискайте або проводьте для вибору кількох.'
            : 'Pick a size format, then select or swipe across sizes to toggle multiple at once.'}
        </p>
        {/* Segmented Control */}
        <div className="inline-flex rounded-md bg-[var(--surface-sunken)] p-1 gap-1 mb-3.5 flex-wrap">
          {sizeModes.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => onSizeModeChange(m.key)}
              className={`rounded-sm px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
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
              {isUk ? 'Один розмір' : 'One size'}
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
                {isUk ? '+ Додати' : '+ Add'}
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
              placeholder={isUk ? 'напр. 56 см, Kids M, 3XL' : 'e.g. 56 cm, Kids M, 3XL'}
              className="max-w-[200px] rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomSize}
              className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)]"
            >
              {t.addCustomSizeBtn}
            </button>
          </div>
        )}
      </div>

      {/* Dotted Divider */}
      <div className="my-5 h-[1px] w-full border-b border-dashed border-[var(--border-strong)]" />

      {/* Colors Section */}
      <div>
        <h2 className="text-[15px] font-bold text-[var(--text)]">{t.colorsSectionTitle}</h2>
        <p className="text-[12px] text-[var(--text-tertiary)] mb-3">
          {isUk
            ? 'Можна додати будь-який колір без обмежень палітри.'
            : 'Any color can be added — not limited to a fixed palette.'}
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
                <span>{translateColor(c.name)}</span>
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
          onClick={() => setIsAddColorModalOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--border-strong)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--text)] hover:border-[var(--text-tertiary)] transition-colors"
        >
          {t.addColorBtn}
        </button>
      </div>

      {/* Dotted Divider */}
      <div className="my-5 h-[1px] w-full border-b border-dashed border-[var(--border-strong)]" />

      {/* Inventory Section (Per-Size Stock Inputs) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-[15px] font-bold text-[var(--text)]">{t.stockPerSizeTitle}</h2>
          <span className="text-[12px] font-semibold text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-1 rounded-full">
            {isUk ? `Разом: ${totalStockSum} од. на складі` : `Total: ${totalStockSum} in stock`}
          </span>
        </div>
        <p className="text-[12px] text-[var(--text-tertiary)] mb-3.5">
          {isUk
            ? 'Вкажіть кількість в наявності для кожного обраного розміру.'
            : 'Specify quantity in stock for each selected size.'}
        </p>

        {/* Quick Bulk Stock Fill Toolbar */}
        {effectiveSizes.length > 1 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-2.5">
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              {isUk ? 'Встановити всім розмірам:' : 'Set all sizes to:'}
            </span>
            <input
              type="number"
              min="0"
              placeholder={isUk ? 'напр. 5' : 'e.g. 5'}
              value={bulkStockInput}
              onChange={(e) => setBulkStockInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyBulkStock()}
              className="w-20 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1 text-center text-[12.5px] font-semibold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyBulkStock}
              className="rounded-sm bg-[var(--accent)] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[var(--accent-hover)] transition-all"
            >
              {t.applyBtn}
            </button>
          </div>
        )}

        {effectiveSizes.length === 0 ? (
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-[13px] text-[var(--text-tertiary)]">
            {isUk
              ? 'Оберіть хоча б один розмір вище, щоб вказати залишок.'
              : 'Select at least one size above to specify stock quantity.'}
          </div>
        ) : selectedColors.length > 1 ? (
          /* Multi-color Matrix: Grouped by Selected Color */
          <div className="flex flex-col gap-4">
            {selectedColors.map((colorName) => {
              const matchedColorObj = colors.find((c) => c.name === colorName);
              const hexVal = matchedColorObj?.hex || '#000000';

              return (
                <div
                  key={colorName}
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3.5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: hexVal }}
                    />
                    <span className="text-[13px] font-bold text-[var(--text)]">
                      {translateColor(colorName)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {effectiveSizes.map((sz) => {
                      const stockVal = getStockForSize(sz, colorName);
                      return (
                        <div
                          key={sz}
                          className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 min-w-0"
                        >
                          <span className="flex h-8 min-w-[32px] shrink-0 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--surface-sunken)] px-1.5 text-[12.5px] font-bold text-[var(--text)]">
                            {sz}
                          </span>
                          <div className="relative flex-1 min-w-0">
                            <input
                              type="number"
                              min="0"
                              value={stockVal === 0 ? '' : stockVal}
                              placeholder="0"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleStockValueChange(sz, e.target.value, colorName)
                              }
                              className="w-full rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] py-1 pl-2 pr-7 text-center text-[13px] font-semibold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                            />
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[var(--text-tertiary)]">
                              {isUk ? 'шт' : 'pcs'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Color or Default Color: Direct Grid of Size Inputs */
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {effectiveSizes.map((sz) => {
              const primaryColor = selectedColors[0];
              const stockVal = getStockForSize(sz, primaryColor);

              return (
                <div
                  key={sz}
                  className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-2 min-w-0"
                >
                  <span className="flex h-8 min-w-[34px] shrink-0 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--surface)] px-1.5 text-[13px] font-bold text-[var(--text)] shadow-xs">
                    {sz}
                  </span>

                  <div className="relative flex-1 min-w-0">
                    <input
                      type="number"
                      min="0"
                      value={stockVal === 0 ? '' : stockVal}
                      placeholder="0"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        handleStockValueChange(sz, e.target.value, primaryColor)
                      }
                      className="w-full rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] py-1 pl-2 pr-7 text-center text-[13px] font-semibold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[var(--text-tertiary)]">
                      {isUk ? 'шт' : 'pcs'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
