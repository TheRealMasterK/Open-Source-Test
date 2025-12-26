/**
 * Affiliate API Service
 * Handles affiliate/referral program API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { get, post } from './http-client';
import {
  AffiliateStats,
  Referral,
  AffiliateEarning,
  AffiliatePayout,
  AffiliateTier,
  RequestPayoutPayload,
  GenerateLinkPayload,
  ReferralListParams,
  EarningListParams,
  PayoutListParams,
  PaginatedResponse,
} from '@/types';

/**
 * Get affiliate stats
 */
export async function getStats(): Promise<AffiliateStats> {
  console.log('[AffiliateAPI] getStats: Fetching affiliate stats');

  try {
    const response = await get<AffiliateStats>(API_ENDPOINTS.AFFILIATE.STATS);

    if (response.success && response.data) {
      console.log('[AffiliateAPI] getStats: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch affiliate stats');
  } catch (error) {
    console.error('[AffiliateAPI] getStats: Error', error);
    throw error;
  }
}

/**
 * Get referrals list
 */
export async function getReferrals(
  params?: ReferralListParams
): Promise<PaginatedResponse<Referral>> {
  console.log('[AffiliateAPI] getReferrals: Fetching referrals', params);

  try {
    const response = await get<PaginatedResponse<Referral>>(API_ENDPOINTS.AFFILIATE.REFERRALS, {
      params,
    });

    if (response.success && response.data) {
      console.log('[AffiliateAPI] getReferrals: Found', response.data.data.length, 'referrals');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch referrals');
  } catch (error) {
    console.error('[AffiliateAPI] getReferrals: Error', error);
    throw error;
  }
}

/**
 * Get earnings history
 */
export async function getEarnings(
  params?: EarningListParams
): Promise<PaginatedResponse<AffiliateEarning>> {
  console.log('[AffiliateAPI] getEarnings: Fetching earnings', params);

  try {
    const response = await get<PaginatedResponse<AffiliateEarning>>(
      API_ENDPOINTS.AFFILIATE.EARNINGS,
      { params }
    );

    if (response.success && response.data) {
      console.log('[AffiliateAPI] getEarnings: Found', response.data.data.length, 'earnings');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch earnings');
  } catch (error) {
    console.error('[AffiliateAPI] getEarnings: Error', error);
    throw error;
  }
}

/**
 * Get affiliate tiers
 */
export async function getTiers(): Promise<AffiliateTier[]> {
  console.log('[AffiliateAPI] getTiers: Fetching tiers');

  try {
    const response = await get<AffiliateTier[]>(API_ENDPOINTS.AFFILIATE.TIERS);

    if (response.success && response.data) {
      console.log('[AffiliateAPI] getTiers: Found', response.data.length, 'tiers');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch tiers');
  } catch (error) {
    console.error('[AffiliateAPI] getTiers: Error', error);
    throw error;
  }
}

/**
 * Get payout history
 */
export async function getPayouts(
  params?: PayoutListParams
): Promise<PaginatedResponse<AffiliatePayout>> {
  console.log('[AffiliateAPI] getPayouts: Fetching payouts', params);

  try {
    const response = await get<PaginatedResponse<AffiliatePayout>>(
      API_ENDPOINTS.AFFILIATE.PAYOUTS,
      { params }
    );

    if (response.success && response.data) {
      console.log('[AffiliateAPI] getPayouts: Found', response.data.data.length, 'payouts');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch payouts');
  } catch (error) {
    console.error('[AffiliateAPI] getPayouts: Error', error);
    throw error;
  }
}

/**
 * Generate referral link
 */
export async function generateLink(
  payload?: GenerateLinkPayload
): Promise<{ code: string; link: string }> {
  console.log('[AffiliateAPI] generateLink: Generating referral link');

  try {
    const response = await post<{ code: string; link: string }>(
      API_ENDPOINTS.AFFILIATE.GENERATE_LINK,
      payload
    );

    if (response.success && response.data) {
      console.log('[AffiliateAPI] generateLink: Success', response.data.code);
      return response.data;
    }

    throw new Error(response.message || 'Failed to generate link');
  } catch (error) {
    console.error('[AffiliateAPI] generateLink: Error', error);
    throw error;
  }
}

/**
 * Request payout
 */
export async function requestPayout(payload: RequestPayoutPayload): Promise<AffiliatePayout> {
  console.log('[AffiliateAPI] requestPayout: Requesting payout', payload.amount);

  try {
    const response = await post<AffiliatePayout>(API_ENDPOINTS.AFFILIATE.REQUEST_PAYOUT, payload);

    if (response.success && response.data) {
      console.log('[AffiliateAPI] requestPayout: Success, ID:', response.data.id);
      return response.data;
    }

    throw new Error(response.message || 'Failed to request payout');
  } catch (error) {
    console.error('[AffiliateAPI] requestPayout: Error', error);
    throw error;
  }
}

export default {
  getStats,
  getReferrals,
  getEarnings,
  getTiers,
  getPayouts,
  generateLink,
  requestPayout,
};
