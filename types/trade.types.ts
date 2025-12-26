/**
 * Trade Types
 */

import { CryptoSymbol, FiatCurrency } from '@/config/crypto.config';

export type TradeStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
export type EscrowStatus = 'pending' | 'held' | 'released' | 'refunded' | 'disputed';

export interface Trade {
  id: string;
  tradeId: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  cryptoType: CryptoSymbol;
  cryptoAmount: number;
  fiatAmount: number;
  fiatCurrency: FiatCurrency;
  status: TradeStatus;
  escrowStatus: EscrowStatus;
  paymentMethod: string;
  buyerRating?: number;
  sellerRating?: number;
  buyerFeedback?: string;
  sellerFeedback?: string;
  escrowWalletId?: string;
  escrowWalletAddress?: string;
  escrowNetwork?: string;
  escrowId?: string;
  tokenAddress?: string;
  buyerWalletAddress?: string;
  sellerWalletAddress?: string;
  txHash?: string;
  releaseHash?: string;
  startDate: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  buyerDisplayName?: string;
  sellerDisplayName?: string;
  offerDetails?: {
    pricePerUnit: number;
    description: string;
  };
}

export interface CreateTradePayload {
  offerId: string;
  amount: number;
  paymentMethod: string;
}

export interface TradeMessage {
  id: string;
  tradeId: string;
  senderId: string;
  senderName: string;
  content: string;
  imageUrl?: string;
  isSystem?: boolean;
  createdAt: string;
}

export interface SendMessagePayload {
  content: string;
  imageUrl?: string;
}

export interface TradeFilters {
  status?: TradeStatus;
  cryptoType?: CryptoSymbol;
  fiatCurrency?: FiatCurrency;
  startDate?: string;
  endDate?: string;
}

export interface TradeListParams extends TradeFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface TradeRating {
  rating: number;
  feedback?: string;
}
