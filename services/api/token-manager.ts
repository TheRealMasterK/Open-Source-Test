/**
 * Token Manager
 * Handles secure storage and management of authentication tokens
 */

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'qic_trader_token';
const TOKEN_EXPIRY_KEY = 'qic_trader_token_expiry';
const REFRESH_TOKEN_KEY = 'qic_trader_refresh_token';

// In-memory cache for faster access
let cachedToken: string | null = null;
let cachedExpiry: number | null = null;

// Default token expiry: 1 hour from now (in milliseconds)
const DEFAULT_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

/**
 * Store the authentication token securely
 * @param token - The authentication token
 * @param expiresAt - Optional expiry timestamp in milliseconds. If not provided, defaults to 1 hour from now.
 */
export async function setToken(token: string, expiresAt?: number): Promise<void> {
  try {
    console.log('[TokenManager] Storing token...');

    // Handle missing expiry - use default of 1 hour from now
    const expiry = expiresAt && !isNaN(expiresAt) ? expiresAt : Date.now() + DEFAULT_TOKEN_EXPIRY_MS;
    console.log('[TokenManager] Token expiry:', new Date(expiry).toISOString());

    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiry.toString());

    // Update cache
    cachedToken = token;
    cachedExpiry = expiry;

    console.log('[TokenManager] Token stored successfully');
  } catch (error) {
    console.error('[TokenManager] Error storing token:', error);
    throw error;
  }
}

/**
 * Get the stored authentication token
 */
export async function getToken(): Promise<string | null> {
  try {
    // Return cached token if available and valid
    if (cachedToken && cachedExpiry && !isTokenExpired()) {
      return cachedToken;
    }

    console.log('[TokenManager] Fetching token from secure storage...');
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const expiryStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);

    if (token && expiryStr) {
      cachedToken = token;
      cachedExpiry = parseInt(expiryStr, 10);

      // Check if expired
      if (isTokenExpired()) {
        console.log('[TokenManager] Token is expired');
        await removeToken();
        return null;
      }

      console.log('[TokenManager] Token retrieved successfully');
      return token;
    }

    console.log('[TokenManager] No token found');
    return null;
  } catch (error) {
    console.error('[TokenManager] Error getting token:', error);
    return null;
  }
}

/**
 * Remove the stored authentication token
 */
export async function removeToken(): Promise<void> {
  try {
    console.log('[TokenManager] Removing token...');
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

    // Clear cache
    cachedToken = null;
    cachedExpiry = null;

    console.log('[TokenManager] Token removed successfully');
  } catch (error) {
    console.error('[TokenManager] Error removing token:', error);
    throw error;
  }
}

/**
 * Store refresh token
 */
export async function setRefreshToken(refreshToken: string): Promise<void> {
  try {
    console.log('[TokenManager] Storing refresh token...');
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    console.log('[TokenManager] Refresh token stored successfully');
  } catch (error) {
    console.error('[TokenManager] Error storing refresh token:', error);
    throw error;
  }
}

/**
 * Get refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return refreshToken;
  } catch (error) {
    console.error('[TokenManager] Error getting refresh token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
  if (!cachedExpiry) return true;

  // Add 5 minute buffer before actual expiry
  const bufferMs = 5 * 60 * 1000;
  const isExpired = Date.now() >= cachedExpiry - bufferMs;

  if (isExpired) {
    console.log('[TokenManager] Token is expired or expiring soon');
  }

  return isExpired;
}

/**
 * Check if token is expiring soon (within buffer period)
 */
export function isTokenExpiringSoon(): boolean {
  if (!cachedExpiry) return true;

  // Check if within 10 minute window
  const bufferMs = 10 * 60 * 1000;
  return Date.now() >= cachedExpiry - bufferMs;
}

/**
 * Get token expiry time
 */
export function getTokenExpiry(): number | null {
  return cachedExpiry;
}

/**
 * Clear the in-memory cache
 */
export function clearCache(): void {
  console.log('[TokenManager] Clearing cache');
  cachedToken = null;
  cachedExpiry = null;
}

/**
 * Restore tokens from storage to cache on app start
 */
export async function restoreTokens(): Promise<boolean> {
  try {
    console.log('[TokenManager] Restoring tokens from storage...');
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('[TokenManager] Error restoring tokens:', error);
    return false;
  }
}

export default {
  setToken,
  getToken,
  removeToken,
  setRefreshToken,
  getRefreshToken,
  isTokenExpired,
  isTokenExpiringSoon,
  getTokenExpiry,
  clearCache,
  restoreTokens,
};
