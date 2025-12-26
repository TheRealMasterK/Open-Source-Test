/**
 * Escrow Types
 */

import { CryptoSymbol } from '@/config/crypto.config';

export type EscrowStatusType = 'pending' | 'held' | 'released' | 'disputed' | 'refunded';

export interface Escrow {
  id: string;
  tradeId: string;
  amount: number;
  currency: CryptoSymbol;
  status: EscrowStatusType;
  buyerId: string;
  sellerId: string;
  // On-chain escrow data
  onChainEscrowId?: string;
  tokenAddress?: string;
  buyerWalletAddress?: string;
  sellerWalletAddress?: string;
  txHash?: string;
  releaseHash?: string;
  refundHash?: string;
  // Timestamps
  heldAt?: string;
  releasedAt?: string;
  disputedAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEscrowPayload {
  tradeId: string;
  amount: number;
  currency: CryptoSymbol;
}

export interface LinkEscrowPayload {
  onChainEscrowId: string;
  txHash: string;
  tokenAddress?: string;
}

export interface DisputeEscrowPayload {
  reason: string;
  description?: string;
}

export interface EscrowStats {
  totalEscrows: number;
  activeEscrows: number;
  totalValueHeld: number;
  releasedCount: number;
  disputedCount: number;
}

export interface EscrowFilters {
  status?: EscrowStatusType;
  currency?: CryptoSymbol;
  startDate?: string;
  endDate?: string;
}

export interface EscrowListParams extends EscrowFilters {
  page?: number;
  limit?: number;
}
