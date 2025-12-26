/**
 * Wallet Types
 */

import { CryptoSymbol, FiatCurrency } from '@/config/crypto.config';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'trade_in'
  | 'trade_out'
  | 'escrow_hold'
  | 'escrow_release'
  | 'commission';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface WalletBalances {
  USDT: number;
  BTC: number;
  ETH: number;
  SOL: number;
  estimatedValueUSD: number;
  estimatedValueZAR?: number;
  [key: string]: number | undefined; // Allow dynamic crypto access
}

export interface Wallet {
  id: string;
  userId: string;
  balances: WalletBalances;
  addresses: {
    [key: string]: {
      address: string;
      network: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: CryptoSymbol;
  fee?: number;
  reference?: string;
  txHash?: string;
  address?: string;
  network?: string;
  tradeId?: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DepositPayload {
  amount: number;
  currency: CryptoSymbol;
  network?: string;
}

export interface WithdrawPayload {
  amount: number;
  currency: CryptoSymbol;
  address: string;
  network?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  currency?: CryptoSymbol;
  startDate?: string;
  endDate?: string;
}

export interface TransactionListParams extends TransactionFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount';
  sortOrder?: 'asc' | 'desc';
}
