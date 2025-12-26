/**
 * useTrades Hook
 * React Query hooks for trade operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradesApi } from '@/services/api';
import {
  CreateTradePayload,
  SendMessagePayload,
  TradeListParams,
  TradeStatus,
  TradeMessage,
} from '@/types';

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
export function useTrades(params?: TradeListParams) {
  return useQuery({
    queryKey: tradeKeys.list(params),
    queryFn: () => tradesApi.getTrades(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Get active trades
 */
export function useActiveTrades() {
  return useQuery({
    queryKey: tradeKeys.active(),
    queryFn: () => tradesApi.getActiveTrades(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

/**
 * Get completed trades
 */
export function useCompletedTrades() {
  return useQuery({
    queryKey: tradeKeys.completed(),
    queryFn: () => tradesApi.getCompletedTrades(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get single trade by ID
 */
export function useTrade(tradeId: string) {
  return useQuery({
    queryKey: tradeKeys.detail(tradeId),
    queryFn: () => tradesApi.getTrade(tradeId),
    enabled: !!tradeId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for active trades
  });
}

/**
 * Get trade messages
 */
export function useTradeMessages(tradeId: string) {
  return useQuery({
    queryKey: tradeKeys.messages(tradeId),
    queryFn: () => tradesApi.getMessages(tradeId),
    enabled: !!tradeId,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 10, // Refetch every 10 seconds
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
