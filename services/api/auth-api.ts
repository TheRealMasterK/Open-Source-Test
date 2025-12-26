/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { post, del } from './http-client';
import { setToken, removeToken } from './token-manager';
import { AuthResponse, LoginPayload, SignupPayload, SocialLoginPayload } from '@/types';

/**
 * Normalize auth response to handle snake_case from backend
 */
function normalizeAuthResponse(data: Record<string, unknown>): AuthResponse {
  // Handle snake_case from backend
  const expiresAt = (data.expiresAt ?? data.expires_at ?? data.exp ?? undefined) as number | undefined;
  const token = (data.token ?? data.access_token ?? data.accessToken) as string;
  const idToken = (data.idToken ?? data.id_token) as string | undefined;
  const refreshToken = (data.refreshToken ?? data.refresh_token) as string | undefined;

  // Normalize user object - backend uses 'uid', frontend uses 'id'
  const backendUser = data.user as Record<string, unknown> | undefined;
  const user = backendUser ? {
    id: (backendUser.id || backendUser.uid || backendUser.userId) as string,
    email: backendUser.email as string,
    displayName: (backendUser.displayName || backendUser.display_name || null) as string | null,
    photoURL: (backendUser.photoURL || backendUser.photo_url || null) as string | null,
    emailVerified: (backendUser.emailVerified ?? backendUser.email_verified ?? false) as boolean,
  } : undefined;

  // Calculate expiresAt if not provided (1 hour default for Firebase tokens)
  let finalExpiresAt = expiresAt;
  if (!finalExpiresAt && data.expiresIn) {
    finalExpiresAt = Date.now() + parseInt(String(data.expiresIn), 10) * 1000;
  }

  console.log('[AuthAPI] Normalized response:', {
    hasToken: !!token,
    hasIdToken: !!idToken,
    hasRefreshToken: !!refreshToken,
    userId: user?.id,
    expiresAt: finalExpiresAt,
  });

  return {
    user: user as AuthResponse['user'],
    token,
    idToken,
    refreshToken,
    expiresAt: finalExpiresAt || Date.now() + 3600000, // Default 1 hour
  };
}

/**
 * Sign up a new user
 */
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  console.log('[AuthAPI] signup: Starting signup for', payload.email);

  try {
    const response = await post<Record<string, unknown>>(API_ENDPOINTS.AUTH.SIGNUP, payload);

    if (response.success && response.data) {
      console.log('[AuthAPI] signup: Success, storing token');
      const normalized = normalizeAuthResponse(response.data);
      // Store the ID token (for API calls), not the custom token (which is for Firebase sign-in)
      const apiToken = normalized.idToken || normalized.token;
      await setToken(apiToken, normalized.expiresAt || undefined);
      console.log('[AuthAPI] signup: Stored API token, hasRefreshToken:', !!normalized.refreshToken);
      return normalized;
    }

    throw new Error(response.message || 'Signup failed');
  } catch (error) {
    console.error('[AuthAPI] signup: Error', error);
    throw error;
  }
}

/**
 * Log in an existing user
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  console.log('[AuthAPI] login: Starting login for', payload.email);

  try {
    const response = await post<Record<string, unknown>>(API_ENDPOINTS.AUTH.LOGIN, payload);

    if (response.success && response.data) {
      console.log('[AuthAPI] login: Success, storing token');
      const normalized = normalizeAuthResponse(response.data);
      // Store the ID token (for API calls), not the custom token (which is for Firebase sign-in)
      const apiToken = normalized.idToken || normalized.token;
      await setToken(apiToken, normalized.expiresAt || undefined);
      console.log('[AuthAPI] login: Stored API token, hasRefreshToken:', !!normalized.refreshToken);
      return normalized;
    }

    throw new Error(response.message || 'Login failed');
  } catch (error) {
    console.error('[AuthAPI] login: Error', error);
    throw error;
  }
}

/**
 * Refresh authentication token using Firebase refresh token
 * @param firebaseRefreshToken - The Firebase refresh token (NOT the ID token)
 */
export async function refreshToken(firebaseRefreshToken: string): Promise<AuthResponse> {
  console.log('[AuthAPI] refreshToken: Refreshing token with Firebase refresh token');

  if (!firebaseRefreshToken) {
    console.error('[AuthAPI] refreshToken: No refresh token provided');
    throw new Error('Refresh token is required');
  }

  try {
    const response = await post<Record<string, unknown>>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken: firebaseRefreshToken,
    });

    if (response.success && response.data) {
      console.log('[AuthAPI] refreshToken: Success, storing new token');
      const normalized = normalizeAuthResponse(response.data);
      await setToken(normalized.token, normalized.expiresAt || undefined);
      return normalized;
    }

    throw new Error(response.message || 'Token refresh failed');
  } catch (error) {
    console.error('[AuthAPI] refreshToken: Error', error);
    throw error;
  }
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<void> {
  console.log('[AuthAPI] deleteUser: Starting account deletion for user:', userId);

  if (!userId) {
    console.error('[AuthAPI] deleteUser: No userId provided');
    throw new Error('User ID is required for account deletion');
  }

  try {
    const response = await del<void>(API_ENDPOINTS.AUTH.DELETE(userId));

    if (response.success) {
      console.log('[AuthAPI] deleteUser: Success, clearing tokens');
      await removeToken();
      return;
    }

    throw new Error(response.message || 'Account deletion failed');
  } catch (error) {
    console.error('[AuthAPI] deleteUser: Error', error);
    throw error;
  }
}

/**
 * Sync social login with backend
 */
export async function socialLoginSync(payload: SocialLoginPayload): Promise<AuthResponse> {
  console.log('[AuthAPI] socialLoginSync: Syncing', payload.provider, 'login');

  try {
    const response = await post<Record<string, unknown>>(API_ENDPOINTS.AUTH.SOCIAL_SYNC, payload);

    if (response.success && response.data) {
      console.log('[AuthAPI] socialLoginSync: Success, storing token');
      const normalized = normalizeAuthResponse(response.data);
      await setToken(normalized.token, normalized.expiresAt || undefined);
      return normalized;
    }

    throw new Error(response.message || 'Social login sync failed');
  } catch (error) {
    console.error('[AuthAPI] socialLoginSync: Error', error);
    throw error;
  }
}

/**
 * Logout - clear tokens
 */
export async function logout(): Promise<void> {
  console.log('[AuthAPI] logout: Clearing tokens');

  try {
    await removeToken();
    console.log('[AuthAPI] logout: Success');
  } catch (error) {
    console.error('[AuthAPI] logout: Error', error);
    throw error;
  }
}

export default {
  signup,
  login,
  refreshToken,
  deleteUser,
  socialLoginSync,
  logout,
};
