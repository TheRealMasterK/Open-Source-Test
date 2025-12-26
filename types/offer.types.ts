/**
 * Offer Types
 */

import { CryptoSymbol, FiatCurrency } from '@/config/crypto.config';

export type OfferType = 'buy' | 'sell';
export type OfferStatus = 'active' | 'paused' | 'completed' | 'deleted';
export type RateType = 'fixed' | 'floating';

export interface Offer {
  id: string;
  offerType: OfferType;
  userId: string;
  cryptocurrency: CryptoSymbol;
  amount: number;
  minAmount: number;
  maxAmount: number;
  pricePerUnit: number;
  fiatCurrency: FiatCurrency;
  paymentMethods: string[];
  status: OfferStatus;
  description: string;
  rateType: RateType;
  tradeLimitDuration?: number;
  creatorDisplayName?: string;
  creatorRating?: number;
  creatorSuccessRate?: number;
  creatorTotalTrades?: number;
  creatorVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferPayload {
  offerType: OfferType;
  cryptocurrency: CryptoSymbol;
  amount: number;
  minAmount: number;
  maxAmount: number;
  pricePerUnit: number;
  fiatCurrency: FiatCurrency;
  paymentMethods: string[];
  description?: string;
  rateType: RateType;
  tradeLimitDuration?: number;
}

export interface UpdateOfferPayload {
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  pricePerUnit?: number;
  paymentMethods?: string[];
  description?: string;
  rateType?: RateType;
  tradeLimitDuration?: number;
}

export interface OfferFilters {
  offerType?: OfferType;
  cryptocurrency?: CryptoSymbol;
  fiatCurrency?: FiatCurrency;
  paymentMethod?: string;
  minPrice?: number;
  maxPrice?: number;
  minAmount?: number;
  maxAmount?: number;
  status?: OfferStatus;
  userId?: string;
}

export interface OfferListParams extends OfferFilters {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'amount';
  sortOrder?: 'asc' | 'desc';
}
