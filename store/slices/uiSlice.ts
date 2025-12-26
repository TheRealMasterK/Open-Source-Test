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
  theme: 'dark', // Default to dark theme
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

// Define RootState type for selectors (handles Redux Persist partial state)
type RootStateWithUI = { ui?: UIState };

// Selectors - handle potentially undefined state during rehydration
export const selectTheme = (state: RootStateWithUI): ThemeMode => state.ui?.theme ?? 'dark';
export const selectIsOnline = (state: RootStateWithUI) => state.ui?.isOnline ?? true;
export const selectToasts = (state: RootStateWithUI): Toast[] => state.ui?.toasts ?? [];
export const selectIsRefreshing = (state: RootStateWithUI) => state.ui?.isRefreshing ?? false;
export const selectGlobalLoading = (state: RootStateWithUI) => state.ui?.globalLoading ?? false;

export default uiSlice.reducer;
