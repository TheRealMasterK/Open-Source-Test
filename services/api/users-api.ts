/**
 * Users API Service
 * Handles user profile and settings API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { get, put, post } from './http-client';
import {
  UserProfile,
  UserSettings,
  UserRating,
  UpdateProfilePayload,
  UpdateSettingsPayload,
  RateUserPayload,
  TopTrader,
  TopTradersParams,
  PaginatedResponse,
} from '@/types';

/**
 * Get user profile
 */
export async function getProfile(userId?: string): Promise<UserProfile> {
  console.log('[UsersAPI] getProfile: Fetching profile for', userId || 'current user');

  try {
    const url = userId ? API_ENDPOINTS.USERS.BY_ID(userId) : API_ENDPOINTS.USERS.PROFILE;

    const response = await get<UserProfile>(url);

    if (response.success && response.data) {
      console.log('[UsersAPI] getProfile: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch profile');
  } catch (error) {
    console.error('[UsersAPI] getProfile: Error', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  console.log('[UsersAPI] updateProfile: Updating profile');

  try {
    const response = await put<UserProfile>(API_ENDPOINTS.USERS.PROFILE, payload);

    if (response.success && response.data) {
      console.log('[UsersAPI] updateProfile: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to update profile');
  } catch (error) {
    console.error('[UsersAPI] updateProfile: Error', error);
    throw error;
  }
}

/**
 * Get user settings
 */
export async function getSettings(): Promise<UserSettings> {
  console.log('[UsersAPI] getSettings: Fetching settings');

  try {
    const response = await get<UserSettings>(API_ENDPOINTS.USERS.SETTINGS);

    if (response.success && response.data) {
      console.log('[UsersAPI] getSettings: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch settings');
  } catch (error) {
    console.error('[UsersAPI] getSettings: Error', error);
    throw error;
  }
}

/**
 * Update user settings
 */
export async function updateSettings(payload: UpdateSettingsPayload): Promise<UserSettings> {
  console.log('[UsersAPI] updateSettings: Updating settings');

  try {
    const response = await put<UserSettings>(API_ENDPOINTS.USERS.SETTINGS, payload);

    if (response.success && response.data) {
      console.log('[UsersAPI] updateSettings: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to update settings');
  } catch (error) {
    console.error('[UsersAPI] updateSettings: Error', error);
    throw error;
  }
}

/**
 * Get user ratings
 */
export async function getRatings(userId: string): Promise<PaginatedResponse<UserRating>> {
  console.log('[UsersAPI] getRatings: Fetching ratings for', userId);

  try {
    const response = await get<PaginatedResponse<UserRating>>(API_ENDPOINTS.USERS.RATINGS(userId));

    if (response.success && response.data) {
      console.log('[UsersAPI] getRatings: Found', response.data.data.length, 'ratings');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch ratings');
  } catch (error) {
    console.error('[UsersAPI] getRatings: Error', error);
    throw error;
  }
}

/**
 * Rate a user
 */
export async function rateUser(userId: string, payload: RateUserPayload): Promise<UserRating> {
  console.log('[UsersAPI] rateUser: Rating user', userId, 'with', payload.rating, 'stars');

  try {
    const response = await post<UserRating>(API_ENDPOINTS.USERS.RATE(userId), payload);

    if (response.success && response.data) {
      console.log('[UsersAPI] rateUser: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to rate user');
  } catch (error) {
    console.error('[UsersAPI] rateUser: Error', error);
    throw error;
  }
}

/**
 * Get top traders
 */
export async function getTopTraders(params?: TopTradersParams): Promise<TopTrader[]> {
  console.log('[UsersAPI] getTopTraders: Fetching top traders', params);

  try {
    const response = await get<TopTrader[]>(API_ENDPOINTS.USERS.TOP_TRADERS, { params });

    if (response.success && response.data) {
      console.log('[UsersAPI] getTopTraders: Found', response.data.length, 'traders');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch top traders');
  } catch (error) {
    console.error('[UsersAPI] getTopTraders: Error', error);
    throw error;
  }
}

export default {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  getRatings,
  rateUser,
  getTopTraders,
};
