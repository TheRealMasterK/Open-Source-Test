/**
 * AuthTokenProvider
 * Sets up token refresh callback for HTTP client
 */

import React, { useEffect, ReactNode } from 'react';
import { auth } from '@/config/firebase';
import { setTokenRefreshCallback } from '@/services/api/http-client';
import { setToken } from '@/services/api/token-manager';
import { authApi } from '@/services/api';

interface AuthTokenProviderProps {
  children: ReactNode;
}

/**
 * AuthTokenProvider component
 * Initializes the token refresh mechanism for API calls
 */
export function AuthTokenProvider({ children }: AuthTokenProviderProps) {
  useEffect(() => {
    console.log('[AuthTokenProvider] Setting up token refresh callback');

    // Register the token refresh callback with HTTP client
    setTokenRefreshCallback(async () => {
      console.log('[AuthTokenProvider] Token refresh callback triggered');

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        console.log('[AuthTokenProvider] No Firebase user for token refresh');
        throw new Error('No authenticated user');
      }

      try {
        // Get fresh Firebase ID token
        console.log('[AuthTokenProvider] Getting Firebase ID token...');
        const idToken = await firebaseUser.getIdToken(true);

        // Sync with backend
        console.log('[AuthTokenProvider] Calling backend refresh...');
        const response = await authApi.refreshToken(idToken);

        if (response.token && response.expiresAt) {
          console.log('[AuthTokenProvider] Token refresh successful');
          // Token is already stored by authApi.refreshToken, but let's ensure
          await setToken(response.token, response.expiresAt);
        } else {
          throw new Error('Invalid token response');
        }
      } catch (error) {
        console.error('[AuthTokenProvider] Token refresh failed:', error);
        throw error;
      }
    });

    return () => {
      console.log('[AuthTokenProvider] Cleaning up token refresh callback');
    };
  }, []);

  return <>{children}</>;
}

export default AuthTokenProvider;
