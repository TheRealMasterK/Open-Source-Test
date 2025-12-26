/**
 * App Providers
 * Wraps the app with all necessary providers
 */

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';
import { store, persistor } from '@/store';
import { Colors } from '@/config/theme';
import { AuthTokenProvider } from './AuthTokenProvider';
import { AuthGate } from './AuthGate';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Loading component for PersistGate
 */
function LoadingFallback() {
  console.log('[AppProviders] Showing loading fallback');
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
    </View>
  );
}

/**
 * AppProviders component
 * Wraps children with Redux Provider, PersistGate, React Query, Auth Gate, and Auth Token Provider
 * Order: Redux -> PersistGate -> QueryClient -> AuthGate (token sync) -> AuthTokenProvider (refresh callback) -> Children
 */
export function AppProviders({ children }: AppProvidersProps) {
  console.log('[AppProviders] Rendering providers');

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AuthGate>
            <AuthTokenProvider>{children}</AuthTokenProvider>
          </AuthGate>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default AppProviders;
