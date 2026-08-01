'use client';

import React, { useState } from 'react';
import BaseModal from '../../../../../common/BaseModal';
import type { ColorOption } from './VariantBuilder';

export interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColor: (color: ColorOption) => void;
}

const PRESET_SWATCHES = [
  { name: 'Charcoal', hex: '#2B2B2E' },
  { name: 'Camel', hex: '#7A6A54' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Olive', hex: '#3B4D3A' },
  { name: 'Burgundy', hex: '#5A1E2A' },
  { name: 'Sage', hex: '#8A9A86' },
  { name: 'Sand', hex: '#D2C5B1' },
  { name: 'Rust', hex: '#9E4731' },
];

export default function AddColorModal({
  isOpen,
  onClose,
  onAddColor,
}: AddColorModalProps) {
  const [hex, setHex] = useState('#7A6A54');
  const [colorName, setColorName] = useState('');

  const handleConfirm = () => {
    const finalName = colorName.trim() || hex;
    onAddColor({ name: finalName, hex });
    setColorName('');
    onClose();
  };

  const handleSelectPreset = (preset: ColorOption) => {
    setHex(preset.hex);
    setColorName(preset.name);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add custom color"
      description="Choose a color swatch or select from popular presets."
    >
      <div className="flex flex-col gap-5 pt-1">
        {/* Color Swatch Picker */}
        <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] p-3.5">
          <label className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface)] p-0.5 shadow-sm transition-transform hover:scale-105">
            <span
              className="h-full w-full rounded-full transition-colors"
              style={{ backgroundColor: hex }}
            />
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
            />
          </label>

          <div className="flex flex-1 flex-col gap-0.5">
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Hex Code
            </label>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#000000"
              className="font-mono text-[13.5px] uppercase font-semibold text-[var(--text)] bg-transparent border-none focus:outline-none"
            />
          </div>
        </div>

        {/* Color Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">
            Color name
          </label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="e.g. Camel, Forest Green, Oat"
            className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Popular Color Presets */}
        <div>
          <label className="text-[12px] font-semibold text-[var(--text-tertiary)] mb-2 block">
            Popular presets
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_SWATCHES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] transition-colors"
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: preset.hex }}
                />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all active:scale-95"
          >
            Add color
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
