/**
 * UI Slice
 * Manages UI state like theme, toasts, loading states
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface UIState {
  theme: ThemeMode;
  isOnline: boolean;
  toasts: Toast[];
  isRefreshing: boolean;
  globalLoading: boolean;
}

const initialState: UIState = {
  theme: 'system',
  isOnline: true,
  toasts: [],
  isRefreshing: false,
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      console.log('[UISlice] setTheme:', action.payload);
      state.theme = action.payload;
    },

    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      console.log('[UISlice] setOnlineStatus:', action.payload);
      state.isOnline = action.payload;
    },

    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      console.log('[UISlice] addToast:', action.payload.type, action.payload.message);
      state.toasts.push({
        id,
        ...action.payload,
      });
    },

    removeToast: (state, action: PayloadAction<string>) => {
      console.log('[UISlice] removeToast:', action.payload);
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },

    clearToasts: (state) => {
      console.log('[UISlice] clearToasts');
      state.toasts = [];
    },

    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },

    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  setTheme,
  setOnlineStatus,
  addToast,
  removeToast,
  clearToasts,
  setRefreshing,
  setGlobalLoading,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectIsOnline = (state: { ui: UIState }) => state.ui.isOnline;
export const selectToasts = (state: { ui: UIState }) => state.ui.toasts;
export const selectIsRefreshing = (state: { ui: UIState }) => state.ui.isRefreshing;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;

export default uiSlice.reducer;
