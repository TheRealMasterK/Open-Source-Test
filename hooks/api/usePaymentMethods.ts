/**
 * usePaymentMethods Hook
 * React Query hooks for payment method operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentMethodsApi } from '@/services/api';
import {
  PaymentMethod,
  CreatePaymentMethodPayload,
  UpdatePaymentMethodPayload,
} from '@/types';

// Query keys
export const paymentMethodKeys = {
  all: ['paymentMethods'] as const,
  list: () => [...paymentMethodKeys.all, 'list'] as const,
};

/**
 * Get all payment methods
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodKeys.list(),
    queryFn: () => paymentMethodsApi.getPaymentMethods(),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    mutationFn: (paymentMethodId: string) =>
      paymentMethodsApi.deletePaymentMethod(paymentMethodId),
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
