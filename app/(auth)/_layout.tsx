/**
 * Auth Layout
 * Layout for authentication screens
 */

import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/common/useTheme';

export default function AuthLayout() {
  const { colors, isDark } = useTheme();

  console.log('[AuthLayout] Rendering, isDark:', isDark);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
    </Stack>
  );
}
