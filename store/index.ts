/**
 * Redux Store Configuration
 * Configures the store with slices, middleware, and persistence
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import offerReducer from './slices/offerSlice';
import walletReducer from './slices/walletSlice';

// Typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  offer: offerReducer,
  wallet: walletReducer,
});

// Persist config
const persistConfig = {
  key: 'qic-trader-root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'ui', 'offer'], // Only persist these reducers
  blacklist: ['wallet'], // Don't persist wallet (fetch fresh on load)
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore Firebase user object which contains non-serializable data
        ignoredActionPaths: ['payload.firebaseUser', 'auth.firebaseUser'],
        ignoredPaths: ['auth.firebaseUser'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export slices
export * from './slices';

console.log('[Store] Redux store initialized');
