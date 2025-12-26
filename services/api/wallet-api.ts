/**
 * Wallet API Service
 * Handles wallet-related API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { get, post } from './http-client';
import {
  Wallet,
  WalletBalances,
  WalletTransaction,
  DepositPayload,
  WithdrawPayload,
  TransactionListParams,
  PaginatedResponse,
} from '@/types';

/**
 * Get user wallet
 */
export async function getWallet(): Promise<Wallet> {
  console.log('[WalletAPI] getWallet: Fetching wallet');

  try {
    const response = await get<Wallet>(API_ENDPOINTS.WALLET.BASE);

    if (response.success && response.data) {
      console.log('[WalletAPI] getWallet: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch wallet');
  } catch (error) {
    console.error('[WalletAPI] getWallet: Error', error);
    throw error;
  }
}

/**
 * Get wallet balances
 */
export async function getBalance(): Promise<WalletBalances> {
  console.log('[WalletAPI] getBalance: Fetching balances');

  try {
    const response = await get<WalletBalances>(API_ENDPOINTS.WALLET.BALANCE);

    if (response.success && response.data) {
      console.log('[WalletAPI] getBalance: Success', response.data);
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch balances');
  } catch (error) {
    console.error('[WalletAPI] getBalance: Error', error);
    throw error;
  }
}

/**
 * Get transaction history
 */
export async function getTransactions(
  params?: TransactionListParams
): Promise<PaginatedResponse<WalletTransaction>> {
  console.log('[WalletAPI] getTransactions: Fetching transactions', params);

  try {
    const response = await get<PaginatedResponse<WalletTransaction>>(
      API_ENDPOINTS.WALLET.TRANSACTIONS,
      { params }
    );

    if (response.success && response.data) {
      console.log('[WalletAPI] getTransactions: Found', response.data.data.length, 'transactions');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch transactions');
  } catch (error) {
    console.error('[WalletAPI] getTransactions: Error', error);
    throw error;
  }
}

/**
 * Generate deposit address
 */
export async function deposit(payload: DepositPayload): Promise<{
  address: string;
  network: string;
  qrCode?: string;
}> {
  console.log('[WalletAPI] deposit: Generating deposit address for', payload.currency);

  try {
    const response = await post<{ address: string; network: string; qrCode?: string }>(
      API_ENDPOINTS.WALLET.DEPOSIT,
      payload
    );

    if (response.success && response.data) {
      console.log('[WalletAPI] deposit: Success, address:', response.data.address);
      return response.data;
    }

    throw new Error(response.message || 'Failed to generate deposit address');
  } catch (error) {
    console.error('[WalletAPI] deposit: Error', error);
    throw error;
  }
}

/**
 * Withdraw funds
 */
export async function withdraw(payload: WithdrawPayload): Promise<WalletTransaction> {
  console.log('[WalletAPI] withdraw: Withdrawing', payload.amount, payload.currency);

  try {
    const response = await post<WalletTransaction>(API_ENDPOINTS.WALLET.WITHDRAW, payload);

    if (response.success && response.data) {
      console.log('[WalletAPI] withdraw: Success, TX ID:', response.data.id);
      return response.data;
    }

    throw new Error(response.message || 'Failed to withdraw');
  } catch (error) {
    console.error('[WalletAPI] withdraw: Error', error);
    throw error;
  }
}

export default {
  getWallet,
  getBalance,
  getTransactions,
  deposit,
  withdraw,
};
