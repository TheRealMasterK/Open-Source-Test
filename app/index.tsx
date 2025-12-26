/**
 * Entry Point
 * Handles initial navigation based on auth state
 */

import React, { useEffect } from 'react';
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

export default function Index() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  console.log('[Index] Rendering, isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('[Index] Setting up auth listener');

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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
      } else {
        dispatch(setUser(null));
        dispatch(setFirebaseUser(null));
      }

      dispatch(setLoading(false));
    });

    return () => {
      console.log('[Index] Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);

  // Show loading spinner while checking auth
  if (isLoading) {
    console.log('[Index] Showing loading spinner');
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  // Redirect based on auth state
  if (isAuthenticated) {
    console.log('[Index] Redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  }

  console.log('[Index] Redirecting to login');
  return <Redirect href="/(auth)/login" />;
}
