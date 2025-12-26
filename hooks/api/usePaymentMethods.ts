/**
 * usePaymentMethods Hook
 * React Query hooks for payment method operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { paymentMethodsApi } from '@/services/api';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { CreatePaymentMethodPayload, UpdatePaymentMethodPayload, API_ERROR_CODES } from '@/types';

// Don't retry on auth errors
const shouldRetry = (failureCount: number, error: unknown) => {
  const apiError = error as { code?: string };
  if (apiError?.code === API_ERROR_CODES.UNAUTHORIZED || apiError?.code === API_ERROR_CODES.FORBIDDEN) {
    console.log('[usePaymentMethods] Not retrying due to auth error');
    return false;
  }
  return failureCount < 2;
};

// Query keys
export const paymentMethodKeys = {
  all: ['paymentMethods'] as const,
  list: () => [...paymentMethodKeys.all, 'list'] as const,
};

/**
 * Get all payment methods
 * Only fetches when authenticated
 */
export function usePaymentMethods(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: paymentMethodKeys.list(),
    queryFn: () => {
      console.log('[usePaymentMethods] Fetching payment methods');
      return paymentMethodsApi.getPaymentMethods();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Create payment method mutation
 */
export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentMethodPayload) =>
      paymentMethodsApi.createPaymentMethod(payload),
    onSuccess: () => {
      console.log('[useCreatePaymentMethod] Success');
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
    },
    onError: (error) => {
      console.error('[useCreatePaymentMethod] Error:', error);
    },
  });
}

/**
 * Update payment method mutation
 */
export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentMethodId,
      payload,
    }: {
      paymentMethodId: string;
      payload: UpdatePaymentMethodPayload;
    }) => paymentMethodsApi.updatePaymentMethod(paymentMethodId, payload),
    onSuccess: () => {
      console.log('[useUpdatePaymentMethod] Success');
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
    },
    onError: (error) => {
      console.error('[useUpdatePaymentMethod] Error:', error);
    },
  });
}

/**
 * Delete payment method mutation
 */
export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) => paymentMethodsApi.deletePaymentMethod(paymentMethodId),
    onSuccess: () => {
      console.log('[useDeletePaymentMethod] Success');
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
    },
    onError: (error) => {
      console.error('[useDeletePaymentMethod] Error:', error);
    },
  });
}

export default {
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
};
