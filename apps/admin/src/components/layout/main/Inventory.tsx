'use client';

import React, { useEffect } from 'react';
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

export default function Inventory() {
  const dispatch = useAppDispatch();
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

  // Initial load: fetch filter options once
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Refetch products whenever page or filters change
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, filters]);

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-7 lg:p-8">
      <ProductsHeader totalCount={totalCount} loading={loading} />

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
