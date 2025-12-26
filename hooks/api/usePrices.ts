/**
 * Prices Hook
 * React Query hooks for cryptocurrency prices
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrices, getPrice, convertToUSD, convertFromUSD } from '@/services/api/prices-api';
import {
  CryptoPrice,
  CryptoTicker,
  ConvertToUSDResponse,
  ConvertFromUSDResponse,
  COINGECKO_TO_SYMBOL,
  CRYPTO_COLORS,
} from '@/types/price.types';

// Query keys for caching
export const pricesKeys = {
  all: ['prices'] as const,
  list: (coins?: string[]) => ['prices', 'list', coins] as const,
  single: (coinId: string) => ['prices', 'single', coinId] as const,
};

// Default coins to fetch (CoinGecko IDs)
const DEFAULT_COINS = ['bitcoin', 'ethereum', 'tether'];

/**
 * Transform CryptoPrice to CryptoTicker for UI display
 */
function transformToTicker(price: CryptoPrice): CryptoTicker {
  const symbol = COINGECKO_TO_SYMBOL[price.id] || price.symbol.toUpperCase();

  return {
    id: price.id,
    symbol,
    name: price.name,
    price: price.current_price,
    change: price.price_change_24h,
    changePercent: price.price_change_percentage_24h,
    isPositive: price.price_change_percentage_24h >= 0,
    marketCap: price.market_cap,
    lastUpdated: price.last_updated,
    color: CRYPTO_COLORS[price.id] || '#666666',
  };
}

/**
 * Hook to get cryptocurrency prices
 * @param coins - Optional array of CoinGecko coin IDs
 * @param options - React Query options
 */
export function usePrices(coins?: string[], options?: { enabled?: boolean }) {
  const coinsToFetch = coins || DEFAULT_COINS;

  return useQuery({
    queryKey: pricesKeys.list(coinsToFetch),
    queryFn: async () => {
      console.log('[usePrices] Fetching prices for:', coinsToFetch);
      const prices = await getPrices(coinsToFetch);
      console.log('[usePrices] Fetched', prices.length, 'prices');
      return prices;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refetch every minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

/**
 * Hook to get prices as formatted tickers for UI display
 * @param coins - Optional array of CoinGecko coin IDs
 */
export function usePriceTickers(coins?: string[]) {
  const query = usePrices(coins);

  return {
    ...query,
    data: query.data?.map(transformToTicker) || [],
    tickers: query.data?.map(transformToTicker) || [],
  };
}

/**
 * Hook to get a single cryptocurrency price
 * @param coinId - CoinGecko coin ID
 */
export function useSinglePrice(coinId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pricesKeys.single(coinId),
    queryFn: async () => {
      console.log('[useSinglePrice] Fetching price for:', coinId);
      const price = await getPrice(coinId);
      console.log('[useSinglePrice] Price:', price?.current_price);
      return price;
    },
    staleTime: 60 * 1000,
    enabled: Boolean(coinId),
    ...options,
  });
}

/**
 * Hook to convert crypto to USD
 */
export function useConvertToUSD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ coinId, amount }: { coinId: string; amount: number }): Promise<ConvertToUSDResponse> => {
      console.log('[useConvertToUSD] Converting', amount, coinId, 'to USD');
      return await convertToUSD(coinId, amount);
    },
    onSuccess: (data) => {
      console.log('[useConvertToUSD] Converted:', data.cryptoAmount, 'to', data.usdAmount, 'USD');
    },
    onError: (error) => {
      console.error('[useConvertToUSD] Error:', error);
    },
  });
}

/**
 * Hook to convert USD to crypto
 */
export function useConvertFromUSD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ coinId, usdAmount }: { coinId: string; usdAmount: number }): Promise<ConvertFromUSDResponse> => {
      console.log('[useConvertFromUSD] Converting', usdAmount, 'USD to', coinId);
      return await convertFromUSD(coinId, usdAmount);
    },
    onSuccess: (data) => {
      console.log('[useConvertFromUSD] Converted:', data.usdAmount, 'USD to', data.cryptoAmount);
    },
    onError: (error) => {
      console.error('[useConvertFromUSD] Error:', error);
    },
  });
}

/**
 * Hook to refresh prices manually
 */
export function useRefreshPrices() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      console.log('[useRefreshPrices] Refreshing all prices');
      queryClient.invalidateQueries({ queryKey: pricesKeys.all });
    },
  };
}

export default {
  usePrices,
  usePriceTickers,
  useSinglePrice,
  useConvertToUSD,
  useConvertFromUSD,
  useRefreshPrices,
};
