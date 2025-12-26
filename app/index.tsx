/**
 * Entry Point
 * Handles initial navigation based on auth state
 * Note: Token sync is handled by AuthGate in AppProviders
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectIsLoading } from '@/store/slices/authSlice';
import { Colors } from '@/config/theme';

export default function Index() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  console.log('[Index] Rendering, isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Show loading spinner while checking auth
  if (isLoading) {
    console.log('[Index] Showing loading spinner');
    return (
      <View className="flex-1 items-center justify-center bg-background">
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
