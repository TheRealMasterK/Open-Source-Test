/**
 * useOffers Hook
 * React Query hooks for offer operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offersApi } from '@/services/api';
import { CreateOfferPayload, UpdateOfferPayload, OfferListParams } from '@/types';

// Query keys
export const offerKeys = {
  all: ['offers'] as const,
  lists: () => [...offerKeys.all, 'list'] as const,
  list: (params?: OfferListParams) => [...offerKeys.lists(), params] as const,
  buy: (params?: OfferListParams) => [...offerKeys.all, 'buy', params] as const,
  sell: (params?: OfferListParams) => [...offerKeys.all, 'sell', params] as const,
  details: () => [...offerKeys.all, 'detail'] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
};

/**
 * Get all offers
 */
export function useOffers(params?: OfferListParams) {
  return useQuery({
    queryKey: offerKeys.list(params),
    queryFn: () => offersApi.getOffers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get buy offers
 */
export function useBuyOffers(params?: OfferListParams) {
  return useQuery({
    queryKey: offerKeys.buy(params),
    queryFn: () => offersApi.getBuyOffers(params),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get sell offers
 */
export function useSellOffers(params?: OfferListParams) {
  return useQuery({
    queryKey: offerKeys.sell(params),
    queryFn: () => offersApi.getSellOffers(params),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get single offer by ID
 */
export function useOffer(offerId: string) {
  return useQuery({
    queryKey: offerKeys.detail(offerId),
    queryFn: () => offersApi.getOffer(offerId),
    enabled: !!offerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Create offer mutation
 */
export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOfferPayload) => offersApi.createOffer(payload),
    onSuccess: () => {
      console.log('[useCreateOffer] Success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (error) => {
      console.error('[useCreateOffer] Error:', error);
    },
  });
}

/**
 * Update offer mutation
 */
export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ offerId, payload }: { offerId: string; payload: UpdateOfferPayload }) =>
      offersApi.updateOffer(offerId, payload),
    onSuccess: (data, variables) => {
      console.log('[useUpdateOffer] Success, updating cache');
      queryClient.setQueryData(offerKeys.detail(variables.offerId), data);
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    },
    onError: (error) => {
      console.error('[useUpdateOffer] Error:', error);
    },
  });
}

/**
 * Delete offer mutation
 */
export function useDeleteOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => offersApi.deleteOffer(offerId),
    onSuccess: (_, offerId) => {
      console.log('[useDeleteOffer] Success, removing from cache');
      queryClient.removeQueries({ queryKey: offerKeys.detail(offerId) });
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    },
    onError: (error) => {
      console.error('[useDeleteOffer] Error:', error);
    },
  });
}

/**
 * Pause offer mutation
 */
export function usePauseOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => offersApi.pauseOffer(offerId),
    onSuccess: (data, offerId) => {
      console.log('[usePauseOffer] Success');
      queryClient.setQueryData(offerKeys.detail(offerId), data);
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    },
    onError: (error) => {
      console.error('[usePauseOffer] Error:', error);
    },
  });
}

/**
 * Resume offer mutation
 */
export function useResumeOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => offersApi.resumeOffer(offerId),
    onSuccess: (data, offerId) => {
      console.log('[useResumeOffer] Success');
      queryClient.setQueryData(offerKeys.detail(offerId), data);
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    },
    onError: (error) => {
      console.error('[useResumeOffer] Error:', error);
    },
  });
}

export default {
  useOffers,
  useBuyOffers,
  useSellOffers,
  useOffer,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  usePauseOffer,
  useResumeOffer,
};
