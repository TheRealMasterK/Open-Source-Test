/**
 * useWallet Hook
 * React Query hooks for wallet operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { setBalances } from '@/store/slices/walletSlice';
import { DepositPayload, WithdrawPayload, TransactionListParams, API_ERROR_CODES } from '@/types';

// Don't retry on auth errors
const shouldRetry = (failureCount: number, error: unknown) => {
  const apiError = error as { code?: string };
  if (apiError?.code === API_ERROR_CODES.UNAUTHORIZED || apiError?.code === API_ERROR_CODES.FORBIDDEN) {
    return false;
  }
  return failureCount < 2;
};

// Query keys
export const walletKeys = {
  all: ['wallet'] as const,
  wallet: () => [...walletKeys.all, 'info'] as const,
  balance: () => [...walletKeys.all, 'balance'] as const,
  transactions: () => [...walletKeys.all, 'transactions'] as const,
  transactionList: (params?: TransactionListParams) =>
    [...walletKeys.transactions(), params] as const,
};

/**
 * Get wallet info
 * Rate limit protected: longer stale time
 */
export function useWallet() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return useQuery({
    queryKey: walletKeys.wallet(),
    queryFn: async () => {
      console.log('[useWallet] Fetching wallet from API...');
      const wallet = await walletApi.getWallet();
      dispatch(setBalances(wallet.balances));
      return wallet;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: shouldRetry,
  });
}

/**
 * Get wallet balances
 * Rate limit protected: longer stale time, no auto-refetch
 */
export function useBalance() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  console.log('[useBalance] Hook called, isAuthenticated:', isAuthenticated);

  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: async () => {
      console.log('[useBalance] queryFn executing - this should only run if enabled');
      const balances = await walletApi.getBalance();
      dispatch(setBalances(balances));
      return balances;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes - reduce API calls
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: false, // Don't refetch on every mount
    refetchOnWindowFocus: false, // Disabled to prevent rate limiting
    retry: shouldRetry,
  });
}

/**
 * Get transaction history
 * Rate limit protected: longer stale time
 */
export function useTransactions(params?: TransactionListParams) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return useQuery({
    queryKey: walletKeys.transactionList(params),
    queryFn: () => {
      console.log('[useTransactions] Fetching transactions from API...');
      return walletApi.getTransactions(params);
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: shouldRetry,
  });
}

/**
 * Generate deposit address mutation
 */
export function useDeposit() {
  return useMutation({
    mutationFn: (payload: DepositPayload) => walletApi.deposit(payload),
    onSuccess: (data) => {
      console.log('[useDeposit] Success, address:', data.address);
    },
    onError: (error) => {
      console.error('[useDeposit] Error:', error);
    },
  });
}

/**
 * Withdraw mutation
 */
export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawPayload) => walletApi.withdraw(payload),
    onSuccess: () => {
      console.log('[useWithdraw] Success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: walletKeys.balance() });
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() });
    },
    onError: (error) => {
      console.error('[useWithdraw] Error:', error);
    },
  });
}

export default {
  useWallet,
  useBalance,
  useTransactions,
  useDeposit,
  useWithdraw,
};
