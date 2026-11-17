'use client';

import React, { useEffect, useState } from 'react';
import { toCompressedDataUrl } from '@/utils/images';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchProducts,
  fetchFilterOptions,
  setPage,
  setFilters,
  resetFilters,
  setViewMode,
} from '../../../store/slices/productsSlice';
import {
  ProductsHeader,
  ProductsFilters,
  ProductsTable,
  ProductsPagination,
} from './mainComponents/products';
import { CreateProductForm } from './mainComponents/storage';

export default function Inventory() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);

  const {
    items,
    totalCount,
    page,
    limit,
    totalPages,
    filters,
    filterOptions,
    statusCounts,
    loading,
    viewMode,
  } = useAppSelector((state) => state.products);

  // Sync URL query params with product filters or creation mode
  useEffect(() => {
    const statusParam = searchParams.get('status') as any;
    const searchParam = searchParams.get('search');
    const actionParam = searchParams.get('action');
    const modeParam = searchParams.get('mode');

    if (actionParam === 'create' || modeParam === 'create') {
      setIsCreating(true);
    }

    if (statusParam || searchParam) {
      dispatch(
        setFilters({
          ...(statusParam && ['all', 'active', 'low_stock', 'out_of_stock'].includes(statusParam)
            ? { status: statusParam }
            : {}),
          ...(searchParam ? { search: searchParam } : {}),
        })
      );
    }
  }, [searchParams, dispatch]);

  // Initial load: fetch filter options once
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Refetch products whenever page or filters change
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, filters]);


  const handleSaveProduct = async (formData: any) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let images: string[] = [];
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        const converted = await Promise.all(
          formData.imageUrls.slice(0, 5).map((url: string) => toCompressedDataUrl(url)),
        );
        images = converted.filter(Boolean);
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: formData.price,
        selectedSizes: formData.selectedSizes,
        selectedColors: formData.selectedColors,
        sizeStocks: formData.sizeStocks,
        variantStocks: formData.sizeStocks,
        colorStocks: formData.colorStocks,
        images,
      };

      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCreating(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('shop_ai_storage_mode');
          localStorage.removeItem('shop_ai_create_product_draft');
        }
        const action = searchParams.get('action');
        const mode = searchParams.get('mode');
        if (action || mode) {
          router.replace(pathname || '/inventory', { scroll: false });
        }
        dispatch(fetchProducts());
        dispatch(fetchFilterOptions());
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to save product to database');
      }
    } catch (err) {
      console.error('Error saving product to DB:', err);
      alert('Network error while saving product');
    }
  };

  const handleBackFromCreate = () => {
    setIsCreating(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shop_ai_storage_mode');
    }
    const action = searchParams.get('action');
    const mode = searchParams.get('mode');
    if (action || mode) {
      router.replace(pathname || '/inventory', { scroll: false });
    }
  };

  if (isCreating) {
    return (
      <div className="flex flex-col w-full">
        <CreateProductForm onBack={handleBackFromCreate} onSave={handleSaveProduct} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProductsHeader
        totalCount={totalCount}
        loading={loading}
        onAddItem={() => setIsCreating(true)}
      />

      <ProductsFilters
        filters={filters}
        filterOptions={filterOptions}
        statusCounts={statusCounts}
        viewMode={viewMode}
        onFilterChange={(partial) => dispatch(setFilters(partial))}
        onResetFilters={() => dispatch(resetFilters())}
        onViewModeChange={(mode) => dispatch(setViewMode(mode))}
      />

      <ProductsTable items={items} loading={loading} viewMode={viewMode} />

      {!loading && totalCount > 0 && (
        <ProductsPagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      )}
    </div>
  );
}
