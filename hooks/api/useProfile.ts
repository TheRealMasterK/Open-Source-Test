/**
 * useProfile Hook
 * React Query hooks for user profile operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { usersApi } from '@/services/api';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import {
  UpdateProfilePayload,
  UpdateSettingsPayload,
  RateUserPayload,
  TopTradersParams,
  API_ERROR_CODES,
} from '@/types';

// Don't retry on auth errors
const shouldRetry = (failureCount: number, error: unknown) => {
  const apiError = error as { code?: string };
  if (apiError?.code === API_ERROR_CODES.UNAUTHORIZED || apiError?.code === API_ERROR_CODES.FORBIDDEN) {
    console.log('[useProfile] Not retrying due to auth error');
    return false;
  }
  return failureCount < 2;
};

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  profile: (userId?: string) => (userId ? [...profileKeys.all, userId] : profileKeys.all),
  settings: () => [...profileKeys.all, 'settings'] as const,
  ratings: (userId: string) => [...profileKeys.all, 'ratings', userId] as const,
  topTraders: (params?: TopTradersParams) => [...profileKeys.all, 'top-traders', params] as const,
};

/**
 * Get user profile
 * Only fetches own profile when authenticated (viewing other profiles is public)
 */
export function useProfile(userId?: string, options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // If no userId, we're fetching own profile which requires auth
  // If userId provided, it's a public profile view
  const enabled = options?.enabled ?? (userId ? true : isAuthenticated);

  return useQuery({
    queryKey: profileKeys.profile(userId),
    queryFn: () => {
      console.log('[useProfile] Fetching profile', userId ? `for ${userId}` : '(own)');
      return usersApi.getProfile(userId);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Get user settings
 * Only fetches when authenticated
 */
export function useSettings(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: profileKeys.settings(),
    queryFn: () => {
      console.log('[useSettings] Fetching settings');
      return usersApi.getSettings();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Get user ratings (public endpoint)
 */
export function useRatings(userId: string) {
  return useQuery({
    queryKey: profileKeys.ratings(userId),
    queryFn: () => {
      console.log('[useRatings] Fetching ratings for', userId);
      return usersApi.getRatings(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get top traders (public endpoint)
 */
export function useTopTraders(params?: TopTradersParams) {
  return useQuery({
    queryKey: profileKeys.topTraders(params),
    queryFn: () => {
      console.log('[useTopTraders] Fetching top traders');
      return usersApi.getTopTraders(params);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => usersApi.updateProfile(payload),
    onSuccess: (data) => {
      console.log('[useUpdateProfile] Success');
      queryClient.setQueryData(profileKeys.profile(), data);
    },
    onError: (error) => {
      console.error('[useUpdateProfile] Error:', error);
    },
  });
}

/**
 * Update settings mutation
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => usersApi.updateSettings(payload),
    onSuccess: (data) => {
      console.log('[useUpdateSettings] Success');
      queryClient.setQueryData(profileKeys.settings(), data);
    },
    onError: (error) => {
      console.error('[useUpdateSettings] Error:', error);
    },
  });
}

/**
 * Rate user mutation
 */
export function useRateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: RateUserPayload }) =>
      usersApi.rateUser(userId, payload),
    onSuccess: (_, variables) => {
      console.log('[useRateUser] Success');
      queryClient.invalidateQueries({
        queryKey: profileKeys.ratings(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(variables.userId),
      });
    },
    onError: (error) => {
      console.error('[useRateUser] Error:', error);
    },
  });
}

export default {
  useProfile,
  useSettings,
  useRatings,
  useTopTraders,
  useUpdateProfile,
  useUpdateSettings,
  useRateUser,
};
