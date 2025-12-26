/**
 * useWallet Hook
 * React Query hooks for wallet operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '@/services/api';
import { useAppDispatch } from '@/store';
import { setBalances } from '@/store/slices/walletSlice';
import {
  Wallet,
  WalletBalances,
  WalletTransaction,
  DepositPayload,
  WithdrawPayload,
  TransactionListParams,
} from '@/types';

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
 */
export function useWallet() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: walletKeys.wallet(),
    queryFn: async () => {
      const wallet = await walletApi.getWallet();
      dispatch(setBalances(wallet.balances));
      return wallet;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Get wallet balances
 */
export function useBalance() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: async () => {
      const balances = await walletApi.getBalance();
      dispatch(setBalances(balances));
      return balances;
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

/**
 * Get transaction history
 */
export function useTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: walletKeys.transactionList(params),
    queryFn: () => walletApi.getTransactions(params),
    staleTime: 1000 * 60, // 1 minute
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
