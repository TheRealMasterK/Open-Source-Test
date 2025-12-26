/**
 * useTrades Hook
 * React Query hooks for trade operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradesApi } from '@/services/api';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import {
  CreateTradePayload,
  SendMessagePayload,
  TradeListParams,
  TradeStatus,
  TradeMessage,
  API_ERROR_CODES,
} from '@/types';

// Don't retry on auth errors
const shouldRetry = (failureCount: number, error: unknown) => {
  const apiError = error as { code?: string };
  if (apiError?.code === API_ERROR_CODES.UNAUTHORIZED || apiError?.code === API_ERROR_CODES.FORBIDDEN) {
    return false;
  }
  return failureCount < 2;
};

// Query keys
export const tradeKeys = {
  all: ['trades'] as const,
  lists: () => [...tradeKeys.all, 'list'] as const,
  list: (params?: TradeListParams) => [...tradeKeys.lists(), params] as const,
  active: () => [...tradeKeys.all, 'active'] as const,
  completed: () => [...tradeKeys.all, 'completed'] as const,
  details: () => [...tradeKeys.all, 'detail'] as const,
  detail: (id: string) => [...tradeKeys.details(), id] as const,
  messages: (tradeId: string) => [...tradeKeys.all, 'messages', tradeId] as const,
};

/**
 * Get all trades
 */
export function useTrades(params?: TradeListParams, options?: { enabled?: boolean }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const shouldFetch = (options?.enabled ?? true) && isAuthenticated;

  console.log('[useTrades] Hook called, isAuthenticated:', isAuthenticated, 'shouldFetch:', shouldFetch);

  const query = useQuery({
    queryKey: tradeKeys.list(params),
    queryFn: () => tradesApi.getTrades(params),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: shouldRetry,
  });

  console.log('[useTrades] Query state:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    hasData: !!query.data,
    error: query.error?.message,
  });

  // Only show loading when shouldFetch is true AND actively fetching
  const isLoading = shouldFetch && (query.isLoading || query.isFetching);

  return {
    ...query,
    isLoading,
  };
}

/**
 * Get active trades
 */
export function useActiveTrades(options?: { enabled?: boolean }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const shouldFetch = (options?.enabled ?? true) && isAuthenticated;

  console.log('[useActiveTrades] Hook called, isAuthenticated:', isAuthenticated, 'shouldFetch:', shouldFetch);

  const query = useQuery({
    queryKey: tradeKeys.active(),
    queryFn: () => tradesApi.getActiveTrades(),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: false, // Disable auto-refetch to reduce API calls
    retry: shouldRetry,
  });

  console.log('[useActiveTrades] Query state:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    dataCount: query.data?.length,
    error: query.error?.message,
  });

  // Only show loading when shouldFetch is true AND actively fetching
  const isLoading = shouldFetch && (query.isLoading || query.isFetching);

  return {
    ...query,
    isLoading,
  };
}

/**
 * Get completed trades
 */
export function useCompletedTrades(options?: { enabled?: boolean }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const shouldFetch = (options?.enabled ?? true) && isAuthenticated;

  console.log('[useCompletedTrades] Hook called, isAuthenticated:', isAuthenticated, 'shouldFetch:', shouldFetch);

  const query = useQuery({
    queryKey: tradeKeys.completed(),
    queryFn: () => tradesApi.getCompletedTrades(),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: shouldRetry,
  });

  console.log('[useCompletedTrades] Query state:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    dataCount: query.data?.length,
    error: query.error?.message,
  });

  // Only show loading when shouldFetch is true AND actively fetching
  const isLoading = shouldFetch && (query.isLoading || query.isFetching);

  return {
    ...query,
    isLoading,
  };
}

/**
 * Get single trade by ID
 */
export function useTrade(tradeId: string) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return useQuery({
    queryKey: tradeKeys.detail(tradeId),
    queryFn: () => tradesApi.getTrade(tradeId),
    enabled: isAuthenticated && !!tradeId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: isAuthenticated ? 1000 * 30 : false,
    retry: shouldRetry,
  });
}

/**
 * Get trade messages
 */
export function useTradeMessages(tradeId: string) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return useQuery({
    queryKey: tradeKeys.messages(tradeId),
    queryFn: () => tradesApi.getMessages(tradeId),
    enabled: isAuthenticated && !!tradeId,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: isAuthenticated ? 1000 * 10 : false,
    retry: shouldRetry,
  });
}

/**
 * Create trade mutation
 */
export function useCreateTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTradePayload) => tradesApi.createTrade(payload),
    onSuccess: () => {
      console.log('[useCreateTrade] Success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: tradeKeys.all });
    },
    onError: (error) => {
      console.error('[useCreateTrade] Error:', error);
    },
  });
}

/**
 * Update trade status mutation
 */
export function useUpdateTradeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tradeId, status }: { tradeId: string; status: TradeStatus }) =>
      tradesApi.updateTradeStatus(tradeId, status),
    onSuccess: (data, variables) => {
      console.log('[useUpdateTradeStatus] Success');
      queryClient.setQueryData(tradeKeys.detail(variables.tradeId), data);
      queryClient.invalidateQueries({ queryKey: tradeKeys.active() });
      queryClient.invalidateQueries({ queryKey: tradeKeys.completed() });
    },
    onError: (error) => {
      console.error('[useUpdateTradeStatus] Error:', error);
    },
  });
}

/**
 * Send message mutation
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tradeId, payload }: { tradeId: string; payload: SendMessagePayload }) =>
      tradesApi.sendMessage(tradeId, payload),
    onSuccess: (data, variables) => {
      console.log('[useSendMessage] Success');
      // Add new message to cache
      queryClient.setQueryData<TradeMessage[]>(tradeKeys.messages(variables.tradeId), (old) =>
        old ? [...old, data] : [data]
      );
    },
    onError: (error) => {
      console.error('[useSendMessage] Error:', error);
    },
  });
}

export default {
  useTrades,
  useActiveTrades,
  useCompletedTrades,
  useTrade,
  useTradeMessages,
  useCreateTrade,
  useUpdateTradeStatus,
  useSendMessage,
};
