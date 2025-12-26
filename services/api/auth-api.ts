/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { post, del } from './http-client';
import { setToken, setRefreshToken, removeToken } from './token-manager';
import {
  AuthResponse,
  LoginPayload,
  SignupPayload,
  SocialLoginPayload,
  User,
} from '@/types';

/**
 * Sign up a new user
 */
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  console.log('[AuthAPI] signup: Starting signup for', payload.email);

  try {
    const response = await post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, payload);

    if (response.success && response.data) {
      console.log('[AuthAPI] signup: Success, storing token');
      await setToken(response.data.token, response.data.expiresAt);
      return response.data;
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
    const response = await post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);

    if (response.success && response.data) {
      console.log('[AuthAPI] login: Success, storing token');
      await setToken(response.data.token, response.data.expiresAt);
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  } catch (error) {
    console.error('[AuthAPI] login: Error', error);
    throw error;
  }
}

/**
 * Refresh authentication token
 */
export async function refreshToken(firebaseIdToken: string): Promise<AuthResponse> {
  console.log('[AuthAPI] refreshToken: Refreshing token');

  try {
    const response = await post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      idToken: firebaseIdToken,
    });

    if (response.success && response.data) {
      console.log('[AuthAPI] refreshToken: Success, storing new token');
      await setToken(response.data.token, response.data.expiresAt);
      return response.data;
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
export async function deleteUser(): Promise<void> {
  console.log('[AuthAPI] deleteUser: Starting account deletion');

  try {
    const response = await del<void>(API_ENDPOINTS.AUTH.DELETE);

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
export async function socialLoginSync(
  payload: SocialLoginPayload
): Promise<AuthResponse> {
  console.log('[AuthAPI] socialLoginSync: Syncing', payload.provider, 'login');

  try {
    const response = await post<AuthResponse>(
      API_ENDPOINTS.AUTH.SOCIAL_SYNC,
      payload
    );

    if (response.success && response.data) {
      console.log('[AuthAPI] socialLoginSync: Success, storing token');
      await setToken(response.data.token, response.data.expiresAt);
      return response.data;
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
