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
      action: PayloadAction<{ token: string; expiresAt: number } | null>
    ) => {
      console.log('[AuthSlice] setBackendToken:', action.payload ? 'token set' : 'cleared');
      if (action.payload) {
        state.backendToken = action.payload.token;
        state.tokenExpiresAt = action.payload.expiresAt;
      } else {
        state.backendToken = null;
        state.tokenExpiresAt = null;
      }
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
    },
  },
});

export const {
  setUser,
  setFirebaseUser,
  setLoading,
  setError,
  setBackendToken,
  clearError,
  logout,
} = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectFirebaseUser = (state: { auth: AuthState }) => state.auth.firebaseUser;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectBackendToken = (state: { auth: AuthState }) => state.auth.backendToken;
export const selectTokenExpiresAt = (state: { auth: AuthState }) => state.auth.tokenExpiresAt;

export default authSlice.reducer;
