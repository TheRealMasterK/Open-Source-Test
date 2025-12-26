/**
 * useAffiliate Hook
 * React Query hooks for affiliate program operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '@/services/api';
import {
  RequestPayoutPayload,
  GenerateLinkPayload,
  ReferralListParams,
  EarningListParams,
  PayoutListParams,
} from '@/types';

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
 */
export function useAffiliateStats() {
  return useQuery({
    queryKey: affiliateKeys.stats(),
    queryFn: () => affiliateApi.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get referrals list
 */
export function useReferrals(params?: ReferralListParams) {
  return useQuery({
    queryKey: affiliateKeys.referralList(params),
    queryFn: () => affiliateApi.getReferrals(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get earnings list
 */
export function useEarnings(params?: EarningListParams) {
  return useQuery({
    queryKey: affiliateKeys.earningList(params),
    queryFn: () => affiliateApi.getEarnings(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get affiliate tiers
 */
export function useTiers() {
  return useQuery({
    queryKey: affiliateKeys.tiers(),
    queryFn: () => affiliateApi.getTiers(),
    staleTime: 1000 * 60 * 60, // 1 hour (tiers don't change often)
  });
}

/**
 * Get payouts list
 */
export function usePayouts(params?: PayoutListParams) {
  return useQuery({
    queryKey: affiliateKeys.payoutList(params),
    queryFn: () => affiliateApi.getPayouts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
