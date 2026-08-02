import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

/* ─── Types ─── */
export interface ProductItem {
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  status: 'active' | 'low_stock' | 'out_of_stock';
  createdAt: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  color: string;
  size: string;
  status: 'all' | 'active' | 'low_stock' | 'out_of_stock';
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
}

export interface StatusCounts {
  all: number;
  active: number;
  low_stock: number;
  out_of_stock: number;
}

interface ProductsState {
  items: ProductItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ProductFilters;
  filterOptions: FilterOptions;
  statusCounts: StatusCounts;
  loading: boolean;
  filtersLoading: boolean;
  viewMode: 'table' | 'grid';
}

const initialState: ProductsState = {
  items: [],
  totalCount: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
  filters: {
    search: '',
    category: '',
    brand: '',
    color: '',
    size: '',
    status: 'all',
  },
  filterOptions: {
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
  },
  statusCounts: { all: 0, active: 0, low_stock: 0, out_of_stock: 0 },
  loading: false,
  filtersLoading: false,
  viewMode: 'table',
};

/* ─── Async Thunks ─── */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState }) => {
    const state = getState() as { products: ProductsState };
    const { page, limit, filters } = state.products;

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.color) params.set('color', filters.color);
    if (filters.size) params.set('size', filters.size);
    if (filters.status !== 'all') params.set('status', filters.status);

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const res = await fetch(`${apiUrl}/products?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
);

export const fetchFilterOptions = createAsyncThunk(
  'products/fetchFilterOptions',
  async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const res = await fetch(`${apiUrl}/products/filters`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch filter options');
    return res.json() as Promise<FilterOptions>;
  },
);

/* ─── Slice ─── */
export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // reset to first page on filter change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
    setViewMode: (state, action: PayloadAction<'table' | 'grid'>) => {
      state.viewMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
        state.statusCounts = action.payload.statusCounts;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchFilterOptions.pending, (state) => {
        state.filtersLoading = true;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
        state.filtersLoading = false;
      })
      .addCase(fetchFilterOptions.rejected, (state) => {
        state.filtersLoading = false;
      });
  },
});

export const { setPage, setFilters, resetFilters, setViewMode } = productsSlice.actions;
export default productsSlice.reducer;
