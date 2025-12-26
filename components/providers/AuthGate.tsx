/**
 * AuthGate
 * Ensures backend token is synced before rendering authenticated screens
 * Wraps the app to handle token restoration on startup
 */

import React, { useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAppDispatch } from '@/store';
import {
  setUser,
  setFirebaseUser,
  setLoading,
  setBackendToken,
  logout as logoutAction,
  selectRefreshToken,
} from '@/store/slices/authSlice';
import { useAppSelector } from '@/store';
import { Colors, FontFamily, FontSize, Spacing } from '@/config/theme';
import { getToken, getTokenExpiry, isTokenExpiringSoon, removeToken } from '@/services/api/token-manager';
import { authApi } from '@/services/api';
import { setAuthFailureCallback, resetAuthFailureCount } from '@/services/api/http-client';
import { signOut } from 'firebase/auth';

interface AuthGateProps {
  children: ReactNode;
}

/**
 * AuthGate component
 * Handles Firebase auth state and backend token synchronization
 */
export function AuthGate({ children }: AuthGateProps) {
  const dispatch = useAppDispatch();
  const storedRefreshToken = useAppSelector(selectRefreshToken);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncingToken, setIsSyncingToken] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const tokenSyncAttempted = useRef(false);

  console.log('[AuthGate] Rendering, isInitializing:', isInitializing, 'isSyncingToken:', isSyncingToken, 'hasRefreshToken:', !!storedRefreshToken);

  // Track app state for background/foreground transitions
  const appState = useRef(AppState.currentState);

  /**
   * Handle auth failure from http-client (too many 401s)
   * Clears all auth state and signs out
   */
  const handleAuthFailure = useCallback(async () => {
    console.log('[AuthGate] Auth failure triggered, logging out...');
    try {
      // Clear secure storage
      await removeToken();
      // Sign out of Firebase
      await signOut(auth);
      // Clear Redux state
      dispatch(logoutAction());
      // Reset token sync flag so we try again on next login
      tokenSyncAttempted.current = false;
      console.log('[AuthGate] Logout complete');
    } catch (error) {
      console.error('[AuthGate] Error during logout:', error);
    }
  }, [dispatch]);

  // Set up auth failure callback for http-client
  useEffect(() => {
    console.log('[AuthGate] Setting up auth failure callback');
    setAuthFailureCallback(handleAuthFailure);

    return () => {
      console.log('[AuthGate] Cleaning up auth failure callback');
      setAuthFailureCallback(() => {});
    };
  }, [handleAuthFailure]);

  /**
   * Proactive token refresh when app comes to foreground
   * Prevents 401 errors when token expired while app was in background
   */
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    console.log('[AuthGate] AppState changed:', appState.current, '->', nextAppState);

    // When app comes to foreground from background
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('[AuthGate] App resumed from background, checking token...');

      // Only refresh if we have a Firebase user and token is expiring soon
      const firebaseUser = auth.currentUser;
      if (firebaseUser && isTokenExpiringSoon() && storedRefreshToken) {
        console.log('[AuthGate] Token expiring soon, proactively refreshing with stored refresh token...');
        try {
          const response = await authApi.refreshToken(storedRefreshToken);
          if (response.token && response.expiresAt) {
            console.log('[AuthGate] Proactive token refresh SUCCESS');
            dispatch(setBackendToken({
              token: response.token,
              expiresAt: response.expiresAt,
              refreshToken: response.refreshToken,
            }));
          }
        } catch (error) {
          console.warn('[AuthGate] Proactive token refresh failed:', error);
          // Don't block - http-client will retry on 401
        }
      } else if (firebaseUser && isTokenExpiringSoon() && !storedRefreshToken) {
        console.warn('[AuthGate] Token expiring but no refresh token available - user may need to re-login');
      }
    }

    appState.current = nextAppState;
  }, [dispatch, storedRefreshToken]);

  // Set up AppState listener for proactive token refresh
  useEffect(() => {
    console.log('[AuthGate] Setting up AppState listener');
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      console.log('[AuthGate] Cleaning up AppState listener');
      subscription.remove();
    };
  }, [handleAppStateChange]);

  // Set up Firebase auth listener
  useEffect(() => {
    console.log('[AuthGate] Setting up Firebase auth listener');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthGate] Firebase auth state changed:', firebaseUser?.uid || 'null');

      if (firebaseUser) {
        // Update Redux state with Firebase user
        dispatch(
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          })
        );
        // Only dispatch serializable fields to avoid Redux warnings
        dispatch(setFirebaseUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        } as any));

        // Sync backend token (only once per session)
        if (!tokenSyncAttempted.current) {
          tokenSyncAttempted.current = true;
          await syncBackendToken();
        }
      } else {
        // User logged out
        console.log('[AuthGate] No Firebase user, clearing state');
        dispatch(setUser(null));
        dispatch(setFirebaseUser(null));
        tokenSyncAttempted.current = false;
        setSyncError(null);
      }

      dispatch(setLoading(false));
      setIsInitializing(false);
    });

    return () => {
      console.log('[AuthGate] Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);

  /**
   * Sync backend token
   * Tries to restore from storage first, then uses refresh token if available
   */
  const syncBackendToken = async (): Promise<void> => {
    console.log('[AuthGate] ========== TOKEN SYNC START ==========');
    setIsSyncingToken(true);
    setSyncError(null);

    try {
      // First check if we have a valid token in storage
      console.log('[AuthGate] Step 1: Checking SecureStore for existing token...');
      const existingToken = await getToken();

      if (existingToken) {
        console.log('[AuthGate] Step 2: Token FOUND in SecureStore');
        const expiry = getTokenExpiry();
        const expiryValue = expiry || Date.now() + 60 * 60 * 1000;
        console.log('[AuthGate] Token expires:', new Date(expiryValue).toISOString());
        console.log('[AuthGate] Step 3: Dispatching setBackendToken to Redux');
        dispatch(setBackendToken({ token: existingToken, expiresAt: expiryValue }));
        console.log('[AuthGate] ========== TOKEN SYNC SUCCESS (from storage) ==========');
        setIsSyncingToken(false);
        return;
      }

      console.log('[AuthGate] Step 2: No token in SecureStore');

      // Check if we have a refresh token in Redux to get new tokens
      if (storedRefreshToken) {
        console.log('[AuthGate] Step 3: Found refresh token in Redux, attempting refresh...');
        try {
          const response = await authApi.refreshToken(storedRefreshToken);
          console.log('[AuthGate] Backend response:', {
            hasToken: !!response.token,
            hasIdToken: !!response.idToken,
            hasRefreshToken: !!response.refreshToken,
            expiresAt: response.expiresAt,
          });

          if (response.token || response.idToken) {
            const tokenToStore = response.idToken || response.token;
            const expiryValue = response.expiresAt || Date.now() + 60 * 60 * 1000;
            console.log('[AuthGate] Step 4: Dispatching setBackendToken to Redux');
            dispatch(setBackendToken({
              token: tokenToStore,
              expiresAt: expiryValue,
              refreshToken: response.refreshToken,
            }));
            console.log('[AuthGate] ========== TOKEN SYNC SUCCESS (from backend) ==========');
          } else {
            console.warn('[AuthGate] Backend returned no token');
            setSyncError('Failed to get authentication token');
          }
        } catch (refreshError) {
          console.error('[AuthGate] Refresh token failed:', refreshError);
          // The refresh token may be expired - user needs to re-login
          setSyncError('Session expired. Please log in again.');
        }
      } else {
        // No token in storage and no refresh token - user needs to log in
        console.log('[AuthGate] Step 3: No refresh token available');
        console.log('[AuthGate] ========== TOKEN SYNC SKIPPED (no refresh token) ==========');
        // Don't set error - this is normal for first-time login flow
        // The login/signup screens will set up the tokens properly
      }
    } catch (error) {
      console.error('[AuthGate] Token sync error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Token sync failed';
      setSyncError(errorMessage);
      console.log('[AuthGate] ========== TOKEN SYNC ERROR ==========');
    } finally {
      setIsSyncingToken(false);
    }
  };

  // Show loading while initializing or syncing token
  if (isInitializing || isSyncingToken) {
    console.log('[AuthGate] Showing loading state');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        <Text style={styles.loadingText}>
          {isSyncingToken ? 'Authenticating...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  // Log sync error but don't block - let screens handle gracefully
  if (syncError) {
    console.warn('[AuthGate] Sync error occurred but proceeding:', syncError);
  }

  console.log('[AuthGate] Ready, rendering children');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.background,
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
  },
});

export default AuthGate;
