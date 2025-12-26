/**
 * Prices API Service
 * Handles cryptocurrency price endpoints
 */

import { get, post } from './http-client';
import { API_ENDPOINTS } from '@/config/api.config';
import {
  PricesResponse,
  SinglePriceResponse,
  ConvertToUSDPayload,
  ConvertToUSDResponse,
  ConvertFromUSDPayload,
  ConvertFromUSDResponse,
  CryptoPrice,
} from '@/types/price.types';

/**
 * Get all cryptocurrency prices
 * @param coins - Optional comma-separated list of coin IDs (CoinGecko format)
 */
export async function getPrices(coins?: string[]): Promise<CryptoPrice[]> {
  console.log('[PricesAPI] Getting prices for:', coins || 'default coins');

  try {
    const params = coins ? `?coins=${coins.join(',')}` : '';
    const response = await get<PricesResponse>(`${API_ENDPOINTS.PRICES.BASE}${params}`);

    console.log('[PricesAPI] Received', response.prices?.length || 0, 'prices');
    return response.prices || [];
  } catch (error) {
    console.error('[PricesAPI] Error getting prices:', error);
    throw error;
  }
}

/**
 * Get single cryptocurrency price
 * @param coinId - CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')
 */
export async function getPrice(coinId: string): Promise<CryptoPrice | null> {
  console.log('[PricesAPI] Getting price for:', coinId);

  try {
    const response = await get<SinglePriceResponse>(API_ENDPOINTS.PRICES.BY_COIN(coinId));

    console.log('[PricesAPI] Price for', coinId, ':', response.price?.current_price);
    return response.price || null;
  } catch (error) {
    console.error('[PricesAPI] Error getting price for', coinId, ':', error);
    throw error;
  }
}

/**
 * Convert cryptocurrency amount to USD
 * @param coinId - CoinGecko coin ID
 * @param amount - Amount of cryptocurrency
 */
export async function convertToUSD(coinId: string, amount: number): Promise<ConvertToUSDResponse> {
  console.log('[PricesAPI] Converting', amount, coinId, 'to USD');

  try {
    const payload: ConvertToUSDPayload = { coinId, amount };
    const response = await post<ConvertToUSDResponse>(
      API_ENDPOINTS.PRICES.CONVERT_TO_USD,
      payload
    );

    console.log('[PricesAPI] Converted to USD:', response.usdAmount);
    return response;
  } catch (error) {
    console.error('[PricesAPI] Error converting to USD:', error);
    throw error;
  }
}

/**
 * Convert USD amount to cryptocurrency
 * @param coinId - CoinGecko coin ID
 * @param usdAmount - Amount in USD
 */
export async function convertFromUSD(coinId: string, usdAmount: number): Promise<ConvertFromUSDResponse> {
  console.log('[PricesAPI] Converting', usdAmount, 'USD to', coinId);

  try {
    const payload: ConvertFromUSDPayload = { coinId, usdAmount };
    const response = await post<ConvertFromUSDResponse>(
      API_ENDPOINTS.PRICES.CONVERT_FROM_USD,
      payload
    );

    console.log('[PricesAPI] Converted to crypto:', response.cryptoAmount);
    return response;
  } catch (error) {
    console.error('[PricesAPI] Error converting from USD:', error);
    throw error;
  }
}

export default {
  getPrices,
  getPrice,
  convertToUSD,
  convertFromUSD,
};
