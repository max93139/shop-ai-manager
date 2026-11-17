import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'uk' | 'en';
}

const getInitialLanguage = (): 'uk' | 'en' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('shop_manager_language');
    if (saved === 'uk' || saved === 'en') return saved;
  }
  return 'uk';
};

const initialState: UiState = {
  sidebarOpen: false,
  theme: 'light',
  language: getInitialLanguage(),
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'uk' | 'en'>) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('shop_manager_language', action.payload);
      }
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
