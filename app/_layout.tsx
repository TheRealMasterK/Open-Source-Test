/**
 * Root Layout
 * Main app layout with providers and navigation setup
 */

import '../global.css';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@/components/providers';
import { Colors } from '@/config/theme';
import { initSentry } from '@/config/sentry.config';

// Initialize Sentry
initSentry();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

console.log('[App] Root layout initializing...');

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="offers" options={{ headerShown: false }} />
        <Stack.Screen name="trades" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="kyc" options={{ headerShown: false }} />
        <Stack.Screen name="affiliate" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      console.log('[App] Fonts loaded, hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    console.log('[App] Loading fonts...');
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  if (fontError) {
    console.error('[App] Font loading error:', fontError);
  }

  console.log('[App] Rendering root layout');

  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
