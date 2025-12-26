/**
 * AuthGate
 * Ensures backend token is synced before rendering authenticated screens
 * Wraps the app to handle token restoration on startup
 */

import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAppDispatch } from '@/store';
import {
  setUser,
  setFirebaseUser,
  setLoading,
  setBackendToken,
} from '@/store/slices/authSlice';
import { Colors, FontFamily, FontSize, Spacing } from '@/config/theme';
import { getToken, getTokenExpiry } from '@/services/api/token-manager';
import { authApi } from '@/services/api';

interface AuthGateProps {
  children: ReactNode;
}

/**
 * AuthGate component
 * Handles Firebase auth state and backend token synchronization
 */
export function AuthGate({ children }: AuthGateProps) {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncingToken, setIsSyncingToken] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const tokenSyncAttempted = useRef(false);

  console.log('[AuthGate] Rendering, isInitializing:', isInitializing, 'isSyncingToken:', isSyncingToken);

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
        dispatch(setFirebaseUser(firebaseUser));

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
   * Tries to restore from storage first, then fetches from backend
   */
  const syncBackendToken = async (): Promise<void> => {
    console.log('[AuthGate] Starting backend token sync...');
    setIsSyncingToken(true);
    setSyncError(null);

    try {
      // First check if we have a valid token in storage
      const existingToken = await getToken();
      if (existingToken) {
        console.log('[AuthGate] Token restored from secure storage');
        // IMPORTANT: Also update Redux with the restored token
        const expiry = getTokenExpiry();
        if (expiry) {
          console.log('[AuthGate] Setting restored token in Redux, expires:', new Date(expiry).toISOString());
          dispatch(setBackendToken({ token: existingToken, expiresAt: expiry }));
        }
        setIsSyncingToken(false);
        return;
      }

      // No stored token - get fresh one from backend using Firebase ID token
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        console.warn('[AuthGate] No Firebase user during token sync');
        setIsSyncingToken(false);
        return;
      }

      console.log('[AuthGate] Getting Firebase ID token...');
      const idToken = await firebaseUser.getIdToken(true);

      console.log('[AuthGate] Calling backend /auth/refresh-token...');
      const response = await authApi.refreshToken(idToken);

      if (response.token && response.expiresAt) {
        console.log('[AuthGate] Backend token sync SUCCESS');
        dispatch(setBackendToken({ token: response.token, expiresAt: response.expiresAt }));
      } else {
        console.warn('[AuthGate] Backend returned no token');
        setSyncError('Failed to get authentication token');
      }
    } catch (error) {
      console.error('[AuthGate] Token sync error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Token sync failed';
      setSyncError(errorMessage);
      // Don't block the app - let user retry via pull-to-refresh on screens
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
