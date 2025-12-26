/**
 * useAffiliate Hook
 * React Query hooks for affiliate program operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { affiliateApi } from '@/services/api';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import {
  RequestPayoutPayload,
  GenerateLinkPayload,
  ReferralListParams,
  EarningListParams,
  PayoutListParams,
  API_ERROR_CODES,
} from '@/types';

// Don't retry on auth errors
const shouldRetry = (failureCount: number, error: unknown) => {
  const apiError = error as { code?: string };
  if (apiError?.code === API_ERROR_CODES.UNAUTHORIZED || apiError?.code === API_ERROR_CODES.FORBIDDEN) {
    console.log('[useAffiliate] Not retrying due to auth error');
    return false;
  }
  return failureCount < 2;
};

// Query keys
export const affiliateKeys = {
  all: ['affiliate'] as const,
  stats: () => [...affiliateKeys.all, 'stats'] as const,
  referrals: () => [...affiliateKeys.all, 'referrals'] as const,
  referralList: (params?: ReferralListParams) => [...affiliateKeys.referrals(), params] as const,
  earnings: () => [...affiliateKeys.all, 'earnings'] as const,
  earningList: (params?: EarningListParams) => [...affiliateKeys.earnings(), params] as const,
  tiers: () => [...affiliateKeys.all, 'tiers'] as const,
  payouts: () => [...affiliateKeys.all, 'payouts'] as const,
  payoutList: (params?: PayoutListParams) => [...affiliateKeys.payouts(), params] as const,
};

/**
 * Get affiliate stats
 * Only fetches when authenticated
 */
export function useAffiliateStats(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: affiliateKeys.stats(),
    queryFn: () => {
      console.log('[useAffiliateStats] Fetching stats');
      return affiliateApi.getStats();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Get referrals list
 * Only fetches when authenticated
 */
export function useReferrals(params?: ReferralListParams, options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: affiliateKeys.referralList(params),
    queryFn: () => {
      console.log('[useReferrals] Fetching referrals');
      return affiliateApi.getReferrals(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Get earnings list
 * Only fetches when authenticated
 */
export function useEarnings(params?: EarningListParams, options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: affiliateKeys.earningList(params),
    queryFn: () => {
      console.log('[useEarnings] Fetching earnings');
      return affiliateApi.getEarnings(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Get affiliate tiers
 * Only fetches when authenticated
 */
export function useTiers(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: affiliateKeys.tiers(),
    queryFn: () => {
      console.log('[useTiers] Fetching tiers');
      return affiliateApi.getTiers();
    },
    staleTime: 1000 * 60 * 60, // 1 hour (tiers don't change often)
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Get payouts list
 * Only fetches when authenticated
 */
export function usePayouts(params?: PayoutListParams, options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: affiliateKeys.payoutList(params),
    queryFn: () => {
      console.log('[usePayouts] Fetching payouts');
      return affiliateApi.getPayouts(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Generate referral link mutation
 */
export function useGenerateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: GenerateLinkPayload) => affiliateApi.generateLink(payload),
    onSuccess: () => {
      console.log('[useGenerateLink] Success');
      queryClient.invalidateQueries({ queryKey: affiliateKeys.stats() });
    },
    onError: (error) => {
      console.error('[useGenerateLink] Error:', error);
    },
  });
}

/**
 * Request payout mutation
 */
export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestPayoutPayload) => affiliateApi.requestPayout(payload),
    onSuccess: () => {
      console.log('[useRequestPayout] Success');
      queryClient.invalidateQueries({ queryKey: affiliateKeys.stats() });
      queryClient.invalidateQueries({ queryKey: affiliateKeys.payouts() });
    },
    onError: (error) => {
      console.error('[useRequestPayout] Error:', error);
    },
  });
}

export default {
  useAffiliateStats,
  useReferrals,
  useEarnings,
  useTiers,
  usePayouts,
  useGenerateLink,
  useRequestPayout,
};
