'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import BaseModal from '@/components/common/BaseModal';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchFilterOptions, fetchProducts, type ProductItem } from '@/store/slices/productsSlice';
import { useTranslation } from '@/hooks/useTranslation';
import { toCompressedDataUrl } from '@/utils/images';

const MAX_IMAGES = 5;

export interface EditProductModalProps {
  item: ProductItem | null;
  onClose: () => void;
}

/** Edits the fields shared by every variant of a product: name, category, brand and photos. */
export default function EditProductModal({ item, onClose }: EditProductModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.products.filterOptions?.categories ?? []);
  const brands = useAppSelector((state) => state.products.filterOptions?.brands ?? []);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    setName(item.name);
    setCategory(item.category);
    setBrand(item.brand);
    setImages(item.images ?? []);
    setError(null);
  }, [item]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls].slice(0, MAX_IMAGES));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (!name.trim() || !category.trim()) {
      setError(t.editProductRequired);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/products/${item.productId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          brand: brand.trim(),
          images: await Promise.all(images.map((url) => toCompressedDataUrl(url))),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError((Array.isArray(body?.message) ? body.message[0] : body?.message) || t.editProductFailed);
        return;
      }
      dispatch(fetchProducts());
      dispatch(fetchFilterOptions());
      onClose();
    } catch {
      setError(t.editProductFailed);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none';

  return (
    <BaseModal
      isOpen={Boolean(item)}
      onClose={onClose}
      title={t.editProductTitle}
      description={t.editProductDesc}
      maxWidthClass="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-name" className="text-[12.5px] font-semibold text-[var(--text)]">{t.productNameLabel}</label>
          <input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-category" className="text-[12.5px] font-semibold text-[var(--text)]">{t.categoryLabel}</label>
            <input id="edit-category" list="edit-category-options" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
            <datalist id="edit-category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-brand" className="text-[12.5px] font-semibold text-[var(--text)]">{t.brandLabel}</label>
            <input id="edit-brand" list="edit-brand-options" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} />
            <datalist id="edit-brand-options">
              {brands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-[var(--text)]">
            {t.editProductPhotos} ({images.length}/{MAX_IMAGES})
          </span>
          <div className="flex flex-wrap gap-2">
            {images.map((src, idx) => (
              <div key={`${idx}-${src.slice(-16)}`} className="relative h-16 w-16 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-sunken)]">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={t.editProductRemovePhoto}
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute right-0.5 top-0.5 rounded-full bg-[var(--surface)] p-0.5 text-[var(--text-secondary)] shadow-xs hover:text-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                aria-label={t.editProductAddPhoto}
                className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-[var(--border-strong)] text-[var(--text-tertiary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <ImagePlus className="h-5 w-5" />
              </button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
        </div>

        {error && <p className="rounded-[var(--radius-sm)] bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[13px] font-medium text-[var(--text)] hover:bg-[var(--surface-soft)]"
          >
            {t.actionCancel}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {saving ? '...' : t.saveBtn}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
