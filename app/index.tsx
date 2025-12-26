/**
 * Entry Point
 * Handles initial navigation based on auth state
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  selectIsAuthenticated,
  selectIsLoading,
  setUser,
  setLoading,
  setFirebaseUser,
} from '@/store/slices/authSlice';
import { Colors } from '@/config/theme';
import { useAuth } from '@/hooks/auth/useAuth';

export default function Index() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const { syncBackendToken } = useAuth();
  const [isTokenSyncing, setIsTokenSyncing] = useState(false);
  const [tokenSynced, setTokenSynced] = useState(false);

  console.log('[Index] Rendering, isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'tokenSynced:', tokenSynced);

  useEffect(() => {
    console.log('[Index] Setting up auth listener');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Index] Auth state changed:', firebaseUser?.uid || 'null');

      if (firebaseUser) {
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

        // Sync backend token before completing auth flow
        console.log('[Index] Firebase user found, syncing backend token...');
        setIsTokenSyncing(true);
        try {
          const tokenResult = await syncBackendToken();
          console.log('[Index] Token sync result:', tokenResult);
          setTokenSynced(true);
        } catch (error) {
          console.error('[Index] Token sync error:', error);
          // Still proceed even if token sync fails - user can retry
          setTokenSynced(true);
        } finally {
          setIsTokenSyncing(false);
        }
      } else {
        dispatch(setUser(null));
        dispatch(setFirebaseUser(null));
        setTokenSynced(false);
      }

      dispatch(setLoading(false));
    });

    return () => {
      console.log('[Index] Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch, syncBackendToken]);

  // Show loading spinner while checking auth or syncing token
  if (isLoading || isTokenSyncing) {
    console.log('[Index] Showing loading spinner, isLoading:', isLoading, 'isTokenSyncing:', isTokenSyncing);
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  // Redirect based on auth state - wait for token sync before going to tabs
  if (isAuthenticated && tokenSynced) {
    console.log('[Index] Redirecting to tabs (token synced)');
    return <Redirect href="/(tabs)" />;
  }

  // If authenticated but token not synced yet, keep waiting
  if (isAuthenticated && !tokenSynced) {
    console.log('[Index] Waiting for token sync...');
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  console.log('[Index] Redirecting to login');
  return <Redirect href="/(auth)/login" />;
}
