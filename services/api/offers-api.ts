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

// Backend Offer type (different from mobile app's Offer type)
interface BackendOffer {
  id: string;
  type: 'buy' | 'sell';
  userId: string;
  cryptocurrency: string;
  fiatCurrency: string;
  creatorPicUrl?: string;
  title?: string;
  description: string;
  pricePerUnit: number;
  minTransaction: number;
  maxTransaction: number;
  tradeLimitDuration?: number;
  paymentMethods: string[];
  status: string;
  rateType: string;
  totalTrades?: number;
  completedTrades?: number;
  creatorDisplayName?: string;
  rating?: number;
  successRate?: number;
  isCreatorVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backend pagination format
interface BackendPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Transform backend offer to mobile app format
function transformOffer(backendOffer: BackendOffer): Offer {
  return {
    id: backendOffer.id,
    offerType: backendOffer.type,
    userId: backendOffer.userId,
    cryptocurrency: backendOffer.cryptocurrency as Offer['cryptocurrency'],
    fiatCurrency: backendOffer.fiatCurrency as Offer['fiatCurrency'],
    description: backendOffer.description || backendOffer.title || '',
    pricePerUnit: backendOffer.pricePerUnit,
    minAmount: backendOffer.minTransaction,
    maxAmount: backendOffer.maxTransaction,
    amount: backendOffer.maxTransaction, // Use maxTransaction as amount
    tradeLimitDuration: backendOffer.tradeLimitDuration,
    paymentMethods: backendOffer.paymentMethods || [],
    status: backendOffer.status as Offer['status'],
    rateType: backendOffer.rateType as Offer['rateType'],
    creatorDisplayName: backendOffer.creatorDisplayName,
    creatorRating: backendOffer.rating,
    creatorSuccessRate: backendOffer.successRate,
    creatorTotalTrades: backendOffer.totalTrades,
    creatorVerified: backendOffer.isCreatorVerified,
    createdAt: backendOffer.createdAt,
    updatedAt: backendOffer.updatedAt,
  };
}

// Helper to extract paginated response from API wrapper
function extractPaginatedResponse(response: unknown): PaginatedResponse<Offer> {
  const resp = response as {
    success?: boolean;
    data?: {
      offers?: BackendOffer[];
      data?: BackendOffer[];  // normalizeResponse puts array here
      pagination?: BackendPagination;
      total?: number;
    };
    offers?: BackendOffer[];
    pagination?: BackendPagination;
    message?: string;
  };

  console.log('[OffersAPI] Raw response structure:', {
    hasSuccess: 'success' in resp,
    hasData: !!resp.data,
    dataKeys: resp.data ? Object.keys(resp.data) : [],
    hasOffers: !!resp.offers,
  });

  let offers: BackendOffer[] = [];
  let pagination: BackendPagination | undefined;
  let total: number | undefined;

  // Check for offers in different locations (order matters - check data.data first from normalizeResponse)
  if (resp.data?.data && Array.isArray(resp.data.data)) {
    console.log('[OffersAPI] Found offers in data.data (from normalizeResponse)');
    offers = resp.data.data;
    total = resp.data.total as number | undefined;
  } else if (resp.data?.offers && Array.isArray(resp.data.offers)) {
    console.log('[OffersAPI] Found offers in data.offers');
    offers = resp.data.offers;
    pagination = resp.data.pagination;
  } else if (resp.offers && Array.isArray(resp.offers)) {
    console.log('[OffersAPI] Found offers in offers field');
    offers = resp.offers;
    pagination = resp.pagination;
  } else if (Array.isArray(resp.data)) {
    console.log('[OffersAPI] Response data is direct array');
    offers = resp.data as unknown as BackendOffer[];
  } else if (Array.isArray(resp)) {
    console.log('[OffersAPI] Response is direct array');
    offers = resp as unknown as BackendOffer[];
  } else {
    console.warn('[OffersAPI] Could not find offers in response');
  }

  // Transform backend offers to mobile app format
  const transformedOffers = offers.map(transformOffer);

  // Convert backend pagination to mobile app pagination format
  const mobilePagination = pagination
    ? {
        page: Math.floor((pagination.offset || 0) / (pagination.limit || 20)) + 1,
        limit: pagination.limit || 20,
        total: pagination.total || transformedOffers.length,
        totalPages: Math.ceil((pagination.total || transformedOffers.length) / (pagination.limit || 20)),
      }
    : {
        page: 1,
        limit: 20,
        total: transformedOffers.length,
        totalPages: 1,
      };

  console.log('[OffersAPI] Extracted', transformedOffers.length, 'offers');

  return {
    data: transformedOffers,
    pagination: mobilePagination,
  };
}

// Helper to extract single offer from API wrapper
function extractOffer(response: unknown): Offer {
  const resp = response as {
    success?: boolean;
    data?: BackendOffer;
    offer?: BackendOffer;
  };

  let backendOffer: BackendOffer | undefined;

  if (resp.data && resp.data.id) {
    backendOffer = resp.data;
  } else if (resp.offer && resp.offer.id) {
    backendOffer = resp.offer;
  } else if ((response as BackendOffer).id) {
    backendOffer = response as BackendOffer;
  }

  if (!backendOffer) {
    throw new Error('Invalid offer response');
  }

  return transformOffer(backendOffer);
}

/**
 * Create a new offer
 */
export async function createOffer(payload: CreateOfferPayload): Promise<Offer> {
  console.log('[OffersAPI] createOffer: Creating', payload.offerType, 'offer');

  // Transform mobile app payload to backend format
  const backendPayload = {
    type: payload.offerType,
    cryptocurrency: payload.cryptocurrency,
    fiatCurrency: payload.fiatCurrency,
    title: payload.description?.slice(0, 100) || `${payload.offerType} ${payload.cryptocurrency}`,
    description: payload.description || '',
    pricePerUnit: payload.pricePerUnit,
    minTransaction: payload.minAmount,
    maxTransaction: payload.maxAmount,
    tradeLimitDuration: payload.tradeLimitDuration || 30,
    paymentMethods: payload.paymentMethods,
    rateType: payload.rateType,
  };

  try {
    const response = await post<BackendOffer>(API_ENDPOINTS.OFFERS.BASE, backendPayload);
    const offer = extractOffer(response);
    console.log('[OffersAPI] createOffer: Success, ID:', offer.id);
    return offer;
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

  // Transform mobile app params to backend format
  const backendParams: Record<string, unknown> = {};
  if (params?.offerType) backendParams.type = params.offerType;
  if (params?.cryptocurrency) backendParams.cryptocurrency = params.cryptocurrency;
  if (params?.fiatCurrency) backendParams.fiatCurrency = params.fiatCurrency;
  if (params?.paymentMethod) backendParams.paymentMethod = params.paymentMethod;
  if (params?.minPrice) backendParams.minPrice = params.minPrice;
  if (params?.maxPrice) backendParams.maxPrice = params.maxPrice;
  if (params?.status) backendParams.status = params.status;
  if (params?.userId) backendParams.userId = params.userId;
  if (params?.limit) backendParams.limit = params.limit;
  if (params?.page) backendParams.offset = ((params.page || 1) - 1) * (params.limit || 20);
  if (params?.sortBy) backendParams.sortBy = params.sortBy === 'amount' ? 'trades' : params.sortBy;
  if (params?.sortOrder) backendParams.order = params.sortOrder;

  try {
    const response = await get<unknown>(API_ENDPOINTS.OFFERS.BASE, { params: backendParams });
    const result = extractPaginatedResponse(response);
    console.log('[OffersAPI] getOffers: Found', result.data?.length || 0, 'offers');
    return result;
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
    const response = await get<unknown>(API_ENDPOINTS.OFFERS.BUY, { params });
    const result = extractPaginatedResponse(response);
    console.log('[OffersAPI] getBuyOffers: Found', result.data?.length || 0, 'offers');
    return result;
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
    const response = await get<unknown>(API_ENDPOINTS.OFFERS.SELL, { params });
    const result = extractPaginatedResponse(response);
    console.log('[OffersAPI] getSellOffers: Found', result.data?.length || 0, 'offers');
    return result;
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
    const response = await get<unknown>(API_ENDPOINTS.OFFERS.BY_ID(offerId));
    const offer = extractOffer(response);
    console.log('[OffersAPI] getOffer: Success');
    return offer;
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

  // Transform mobile app payload to backend format
  const backendPayload: Record<string, unknown> = {};
  if (payload.description !== undefined) backendPayload.description = payload.description;
  if (payload.pricePerUnit !== undefined) backendPayload.pricePerUnit = payload.pricePerUnit;
  if (payload.minAmount !== undefined) backendPayload.minTransaction = payload.minAmount;
  if (payload.maxAmount !== undefined) backendPayload.maxTransaction = payload.maxAmount;
  if (payload.tradeLimitDuration !== undefined) backendPayload.tradeLimitDuration = payload.tradeLimitDuration;
  if (payload.paymentMethods !== undefined) backendPayload.paymentMethods = payload.paymentMethods;
  if (payload.rateType !== undefined) backendPayload.rateType = payload.rateType;

  try {
    const response = await put<unknown>(API_ENDPOINTS.OFFERS.BY_ID(offerId), backendPayload);
    const offer = extractOffer(response);
    console.log('[OffersAPI] updateOffer: Success');
    return offer;
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
    await del<void>(API_ENDPOINTS.OFFERS.BY_ID(offerId));
    console.log('[OffersAPI] deleteOffer: Success');
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
    const response = await patch<unknown>(API_ENDPOINTS.OFFERS.PAUSE(offerId));
    const offer = extractOffer(response);
    console.log('[OffersAPI] pauseOffer: Success');
    return offer;
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
    const response = await patch<unknown>(API_ENDPOINTS.OFFERS.RESUME(offerId));
    const offer = extractOffer(response);
    console.log('[OffersAPI] resumeOffer: Success');
    return offer;
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
