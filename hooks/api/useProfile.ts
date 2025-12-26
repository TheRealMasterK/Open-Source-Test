/**
 * useProfile Hook
 * React Query hooks for user profile operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api';
import {
  UserProfile,
  UserSettings,
  UserRating,
  UpdateProfilePayload,
  UpdateSettingsPayload,
  RateUserPayload,
  TopTrader,
  TopTradersParams,
} from '@/types';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  profile: (userId?: string) =>
    userId ? [...profileKeys.all, userId] : profileKeys.all,
  settings: () => [...profileKeys.all, 'settings'] as const,
  ratings: (userId: string) => [...profileKeys.all, 'ratings', userId] as const,
  topTraders: (params?: TopTradersParams) =>
    [...profileKeys.all, 'top-traders', params] as const,
};

/**
 * Get user profile
 */
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: profileKeys.profile(userId),
    queryFn: () => usersApi.getProfile(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get user settings
 */
export function useSettings() {
  return useQuery({
    queryKey: profileKeys.settings(),
    queryFn: () => usersApi.getSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Get user ratings
 */
export function useRatings(userId: string) {
  return useQuery({
    queryKey: profileKeys.ratings(userId),
    queryFn: () => usersApi.getRatings(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get top traders
 */
export function useTopTraders(params?: TopTradersParams) {
  return useQuery({
    queryKey: profileKeys.topTraders(params),
    queryFn: () => usersApi.getTopTraders(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      usersApi.updateProfile(payload),
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
    mutationFn: (payload: UpdateSettingsPayload) =>
      usersApi.updateSettings(payload),
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
