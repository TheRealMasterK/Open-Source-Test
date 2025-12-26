/**
 * Auth Slice
 * Manages authentication state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User as FirebaseUser } from 'firebase/auth';
import { User, AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  backendToken: null,
  tokenExpiresAt: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      console.log('[AuthSlice] setUser:', action.payload?.id || 'null');
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setFirebaseUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      console.log('[AuthSlice] setFirebaseUser:', action.payload?.uid || 'null');
      // Store only serializable data
      if (action.payload) {
        state.firebaseUser = {
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
          emailVerified: action.payload.emailVerified,
        } as unknown as FirebaseUser;
      } else {
        state.firebaseUser = null;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      console.log('[AuthSlice] setError:', action.payload);
      state.error = action.payload;
      state.isLoading = false;
    },

    setBackendToken: (
      state,
      action: PayloadAction<{ token: string; expiresAt: number; refreshToken?: string } | null>
    ) => {
      console.log('[AuthSlice] setBackendToken:', action.payload ? 'token set' : 'cleared');
      if (action.payload) {
        state.backendToken = action.payload.token;
        state.tokenExpiresAt = action.payload.expiresAt;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
          console.log('[AuthSlice] refreshToken stored');
        }
      } else {
        state.backendToken = null;
        state.tokenExpiresAt = null;
        state.refreshToken = null;
      }
    },

    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      console.log('[AuthSlice] setRefreshToken:', action.payload ? 'set' : 'cleared');
      state.refreshToken = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      console.log('[AuthSlice] logout');
      state.user = null;
      state.firebaseUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.backendToken = null;
      state.tokenExpiresAt = null;
      state.refreshToken = null;
    },
  },
});

export const {
  setUser,
  setFirebaseUser,
  setLoading,
  setError,
  setBackendToken,
  setRefreshToken,
  clearError,
  logout,
} = authSlice.actions;

// Define RootState type for selectors (handles Redux Persist partial state)
type RootStateWithAuth = { auth?: AuthState };

// Selectors - handle potentially undefined state during rehydration
export const selectUser = (state: RootStateWithAuth) => state.auth?.user ?? null;
export const selectFirebaseUser = (state: RootStateWithAuth) => state.auth?.firebaseUser ?? null;

/**
 * Check if user is truly authenticated - must have user AND valid token
 * This prevents API calls when token is missing but user data persists
 */
export const selectIsAuthenticated = (state: RootStateWithAuth): boolean => {
  if (!state.auth) return false;

  const hasUser = state.auth.isAuthenticated && !!state.auth.user;
  const hasToken = !!state.auth.backendToken;
  const tokenNotExpired = !state.auth.tokenExpiresAt || state.auth.tokenExpiresAt > Date.now();

  const isAuth = hasUser && hasToken && tokenNotExpired;

  // Log when there's a mismatch for debugging
  if (state.auth.isAuthenticated && !isAuth) {
    console.warn('[AuthSlice] Auth state mismatch - user exists but token missing/expired', {
      hasUser,
      hasToken,
      tokenNotExpired,
    });
  }

  return isAuth;
};

export const selectIsLoading = (state: RootStateWithAuth) => state.auth?.isLoading ?? true;
export const selectAuthError = (state: RootStateWithAuth) => state.auth?.error ?? null;
export const selectBackendToken = (state: RootStateWithAuth) => state.auth?.backendToken ?? null;
export const selectTokenExpiresAt = (state: RootStateWithAuth) => state.auth?.tokenExpiresAt ?? null;
export const selectRefreshToken = (state: RootStateWithAuth) => state.auth?.refreshToken ?? null;

export default authSlice.reducer;
