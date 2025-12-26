/**
 * AuthTokenProvider
 * Sets up token refresh callback for HTTP client
 */

import React, { useEffect, ReactNode } from 'react';
import { setTokenRefreshCallback } from '@/services/api/http-client';
import { setToken } from '@/services/api/token-manager';
import { authApi } from '@/services/api';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectRefreshToken, setBackendToken } from '@/store/slices/authSlice';

interface AuthTokenProviderProps {
  children: ReactNode;
}

/**
 * AuthTokenProvider component
 * Initializes the token refresh mechanism for API calls
 */
export function AuthTokenProvider({ children }: AuthTokenProviderProps) {
  const storedRefreshToken = useAppSelector(selectRefreshToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('[AuthTokenProvider] Setting up token refresh callback, hasRefreshToken:', !!storedRefreshToken);

    // Register the token refresh callback with HTTP client
    setTokenRefreshCallback(async () => {
      console.log('[AuthTokenProvider] Token refresh callback triggered');

      if (!storedRefreshToken) {
        console.log('[AuthTokenProvider] No refresh token available');
        throw new Error('No refresh token available - please log in again');
      }

      try {
        console.log('[AuthTokenProvider] Calling backend refresh with refresh token...');
        const response = await authApi.refreshToken(storedRefreshToken);

        if ((response.token || response.idToken) && response.expiresAt) {
          const tokenToStore = response.idToken || response.token;
          console.log('[AuthTokenProvider] Token refresh successful');

          // Store the new token in SecureStore
          await setToken(tokenToStore, response.expiresAt);

          // Update Redux state with new tokens
          dispatch(setBackendToken({
            token: tokenToStore,
            expiresAt: response.expiresAt,
            refreshToken: response.refreshToken,
          }));
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
  }, [storedRefreshToken, dispatch]);

  return <>{children}</>;
}

export default AuthTokenProvider;
