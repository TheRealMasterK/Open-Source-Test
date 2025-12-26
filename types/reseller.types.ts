/**
 * Reseller Types
 */

import { CryptoSymbol, FiatCurrency } from '@/config/crypto.config';

export type ResellOfferStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type MarkupType = 'percentage' | 'fixed';

export interface ResellOffer {
  id: string;
  originalOfferId: string;
  resellerId: string;
  resellerName?: string;
  markup: number;
  markupType: MarkupType;
  pricePerUnit: number;
  cryptocurrency: CryptoSymbol;
  fiatCurrency: FiatCurrency;
  minTransaction: number;
  maxTransaction: number;
  status: ResellOfferStatus;
  totalTrades: number;
  completedTrades: number;
  totalProfit: number;
  originalOffer?: {
    id: string;
    pricePerUnit: number;
    paymentMethods: string[];
    description: string;
    sellerName: string;
    sellerRating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ResellTrade {
  id: string;
  resellOfferId: string;
  tradeId: string;
  originalTradeId?: string;
  buyerId: string;
  buyerName?: string;
  sellerId: string;
  sellerName?: string;
  originalSellerId: string;
  originalSellerName?: string;
  cryptoAmount: number;
  fiatAmount: number;
  resellerProfit: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface ResellerStats {
  totalResells: number;
  activeResells: number;
  totalTrades: number;
  completedTrades: number;
  totalProfit: number;
  averageMarkup: number;
  conversionRate: number;
}

export interface CreateResellPayload {
  originalOfferId: string;
  markup: number;
  markupType: MarkupType;
  minTransaction?: number;
  maxTransaction?: number;
}

export interface UpdateResellPayload {
  markup?: number;
  markupType?: MarkupType;
  minTransaction?: number;
  maxTransaction?: number;
  status?: ResellOfferStatus;
}

export interface ResellFilters {
  status?: ResellOfferStatus;
  cryptocurrency?: CryptoSymbol;
  fiatCurrency?: FiatCurrency;
}

export interface ResellListParams extends ResellFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'profit' | 'trades';
  sortOrder?: 'asc' | 'desc';
}
