/**
 * Price Types
 * Cryptocurrency price data types from backend
 */

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  last_updated: string;
}

export interface PricesResponse {
  message: string;
  prices: CryptoPrice[];
  timestamp: string;
}

export interface SinglePriceResponse {
  message: string;
  price: CryptoPrice;
  timestamp: string;
}

export interface ConvertToUSDPayload {
  coinId: string;
  amount: number;
}

export interface ConvertFromUSDPayload {
  coinId: string;
  usdAmount: number;
}

export interface ConvertToUSDResponse {
  message: string;
  coinId: string;
  cryptoAmount: number;
  usdAmount: number;
  timestamp: string;
}

export interface ConvertFromUSDResponse {
  message: string;
  coinId: string;
  usdAmount: number;
  cryptoAmount: number;
  timestamp: string;
}

// Mapped crypto ticker for UI display
export interface CryptoTicker {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  marketCap: number;
  lastUpdated: string;
  color: string;
}

// Supported cryptocurrency IDs (CoinGecko format)
export type SupportedCryptoId = 'bitcoin' | 'ethereum' | 'solana' | 'tether' | 'usd-coin';

// Map CoinGecko IDs to app symbols
export const COINGECKO_TO_SYMBOL: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
  tether: 'USDT',
  'usd-coin': 'USDC',
};

// Map app symbols to CoinGecko IDs
export const SYMBOL_TO_COINGECKO: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  USDT: 'tether',
  USDC: 'usd-coin',
};

// Crypto colors for UI
export const CRYPTO_COLORS: Record<string, string> = {
  bitcoin: '#F7931A',
  ethereum: '#627EEA',
  solana: '#9945FF',
  tether: '#26A17B',
  'usd-coin': '#2775CA',
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  USDT: '#26A17B',
  USDC: '#2775CA',
};
