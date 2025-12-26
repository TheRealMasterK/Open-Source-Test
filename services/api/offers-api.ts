/**
 * Offers API Service
 * Handles offer-related API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { get, post, put, patch, del } from './http-client';
import {
  Offer,
  CreateOfferPayload,
  UpdateOfferPayload,
  OfferListParams,
  PaginatedResponse,
} from '@/types';

/**
 * Create a new offer
 */
export async function createOffer(payload: CreateOfferPayload): Promise<Offer> {
  console.log('[OffersAPI] createOffer: Creating', payload.offerType, 'offer');

  try {
    const response = await post<Offer>(API_ENDPOINTS.OFFERS.BASE, payload);

    if (response.success && response.data) {
      console.log('[OffersAPI] createOffer: Success, ID:', response.data.id);
      return response.data;
    }

    throw new Error(response.message || 'Failed to create offer');
  } catch (error) {
    console.error('[OffersAPI] createOffer: Error', error);
    throw error;
  }
}

/**
 * Get all offers with optional filters
 */
export async function getOffers(params?: OfferListParams): Promise<PaginatedResponse<Offer>> {
  console.log('[OffersAPI] getOffers: Fetching offers with params:', params);

  try {
    const response = await get<PaginatedResponse<Offer>>(API_ENDPOINTS.OFFERS.BASE, { params });

    if (response.success && response.data) {
      console.log('[OffersAPI] getOffers: Found', response.data.data.length, 'offers');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch offers');
  } catch (error) {
    console.error('[OffersAPI] getOffers: Error', error);
    throw error;
  }
}

/**
 * Get buy offers
 */
export async function getBuyOffers(params?: OfferListParams): Promise<PaginatedResponse<Offer>> {
  console.log('[OffersAPI] getBuyOffers: Fetching buy offers');

  try {
    const response = await get<PaginatedResponse<Offer>>(API_ENDPOINTS.OFFERS.BUY, { params });

    if (response.success && response.data) {
      console.log('[OffersAPI] getBuyOffers: Found', response.data.data.length, 'offers');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch buy offers');
  } catch (error) {
    console.error('[OffersAPI] getBuyOffers: Error', error);
    throw error;
  }
}

/**
 * Get sell offers
 */
export async function getSellOffers(params?: OfferListParams): Promise<PaginatedResponse<Offer>> {
  console.log('[OffersAPI] getSellOffers: Fetching sell offers');

  try {
    const response = await get<PaginatedResponse<Offer>>(API_ENDPOINTS.OFFERS.SELL, { params });

    if (response.success && response.data) {
      console.log('[OffersAPI] getSellOffers: Found', response.data.data.length, 'offers');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch sell offers');
  } catch (error) {
    console.error('[OffersAPI] getSellOffers: Error', error);
    throw error;
  }
}

/**
 * Get a single offer by ID
 */
export async function getOffer(offerId: string): Promise<Offer> {
  console.log('[OffersAPI] getOffer: Fetching offer', offerId);

  try {
    const response = await get<Offer>(API_ENDPOINTS.OFFERS.BY_ID(offerId));

    if (response.success && response.data) {
      console.log('[OffersAPI] getOffer: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch offer');
  } catch (error) {
    console.error('[OffersAPI] getOffer: Error', error);
    throw error;
  }
}

/**
 * Update an offer
 */
export async function updateOffer(offerId: string, payload: UpdateOfferPayload): Promise<Offer> {
  console.log('[OffersAPI] updateOffer: Updating offer', offerId);

  try {
    const response = await put<Offer>(API_ENDPOINTS.OFFERS.BY_ID(offerId), payload);

    if (response.success && response.data) {
      console.log('[OffersAPI] updateOffer: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to update offer');
  } catch (error) {
    console.error('[OffersAPI] updateOffer: Error', error);
    throw error;
  }
}

/**
 * Delete an offer
 */
export async function deleteOffer(offerId: string): Promise<void> {
  console.log('[OffersAPI] deleteOffer: Deleting offer', offerId);

  try {
    const response = await del<void>(API_ENDPOINTS.OFFERS.BY_ID(offerId));

    if (response.success) {
      console.log('[OffersAPI] deleteOffer: Success');
      return;
    }

    throw new Error(response.message || 'Failed to delete offer');
  } catch (error) {
    console.error('[OffersAPI] deleteOffer: Error', error);
    throw error;
  }
}

/**
 * Pause an offer
 */
export async function pauseOffer(offerId: string): Promise<Offer> {
  console.log('[OffersAPI] pauseOffer: Pausing offer', offerId);

  try {
    const response = await patch<Offer>(API_ENDPOINTS.OFFERS.PAUSE(offerId));

    if (response.success && response.data) {
      console.log('[OffersAPI] pauseOffer: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to pause offer');
  } catch (error) {
    console.error('[OffersAPI] pauseOffer: Error', error);
    throw error;
  }
}

/**
 * Resume an offer
 */
export async function resumeOffer(offerId: string): Promise<Offer> {
  console.log('[OffersAPI] resumeOffer: Resuming offer', offerId);

  try {
    const response = await patch<Offer>(API_ENDPOINTS.OFFERS.RESUME(offerId));

    if (response.success && response.data) {
      console.log('[OffersAPI] resumeOffer: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to resume offer');
  } catch (error) {
    console.error('[OffersAPI] resumeOffer: Error', error);
    throw error;
  }
}

export default {
  createOffer,
  getOffers,
  getBuyOffers,
  getSellOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  pauseOffer,
  resumeOffer,
};
