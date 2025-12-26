/**
 * Affiliate Types
 */

import { CryptoSymbol, FiatCurrency } from '@/config/crypto.config';

export type ReferralStatus = 'pending' | 'active' | 'inactive';
export type EarningType = 'commission' | 'bonus' | 'tier_upgrade';
export type EarningStatus = 'pending' | 'confirmed' | 'paid';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AffiliateTier {
  name: string;
  level: number;
  commissionRate: number;
  minReferrals: number;
  benefits: string[];
}

export interface AffiliateStats {
  userId: string;
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  activeReferrals: number;
  inactiveReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  currentTier: AffiliateTier;
  nextTier?: AffiliateTier;
  nextTierProgress: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName?: string;
  referredUserEmail?: string;
  status: ReferralStatus;
  totalTrades: number;
  totalEarnings: number;
  lastTradeAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateEarning {
  id: string;
  userId: string;
  referralId: string;
  tradeId?: string;
  amount: number;
  currency: CryptoSymbol | FiatCurrency;
  type: EarningType;
  status: EarningStatus;
  description?: string;
  createdAt: string;
  confirmedAt?: string;
  paidAt?: string;
}

export interface AffiliatePayout {
  id: string;
  userId: string;
  amount: number;
  currency: CryptoSymbol | FiatCurrency;
  paymentMethod: string;
  status: PayoutStatus;
  transactionHash?: string;
  address?: string;
  failureReason?: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
}

export interface RequestPayoutPayload {
  amount: number;
  currency: CryptoSymbol | FiatCurrency;
  paymentMethod: string;
  address?: string;
}

export interface GenerateLinkPayload {
  campaign?: string;
}

export interface ReferralFilters {
  status?: ReferralStatus;
  startDate?: string;
  endDate?: string;
}

export interface ReferralListParams extends ReferralFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'totalEarnings';
  sortOrder?: 'asc' | 'desc';
}

export interface EarningFilters {
  type?: EarningType;
  status?: EarningStatus;
  startDate?: string;
  endDate?: string;
}

export interface EarningListParams extends EarningFilters {
  page?: number;
  limit?: number;
}

export interface PayoutFilters {
  status?: PayoutStatus;
  startDate?: string;
  endDate?: string;
}

export interface PayoutListParams extends PayoutFilters {
  page?: number;
  limit?: number;
}
