/**
 * Cryptocurrency Configuration
 * Centralized crypto settings and constants
 */

export type CryptoSymbol = 'USDT' | 'BTC' | 'ETH';
export type FiatCurrency = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'NGN';

export interface CryptoConfig {
  symbol: CryptoSymbol;
  name: string;
  color: string;
  decimals: number;
  icon: string;
  networks: NetworkConfig[];
}

export interface NetworkConfig {
  id: string;
  name: string;
  chainId: number;
  isTestnet: boolean;
}

export const CRYPTOCURRENCIES: Record<CryptoSymbol, CryptoConfig> = {
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    color: '#26A17B',
    decimals: 6,
    icon: 'usdt',
    networks: [
      { id: 'tron', name: 'Tron (TRC20)', chainId: 1, isTestnet: false },
      { id: 'bsc', name: 'BSC (BEP20)', chainId: 56, isTestnet: false },
      { id: 'ethereum', name: 'Ethereum (ERC20)', chainId: 1, isTestnet: false },
    ],
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    color: '#F7931A',
    decimals: 8,
    icon: 'btc',
    networks: [{ id: 'bitcoin', name: 'Bitcoin', chainId: 0, isTestnet: false }],
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    color: '#627EEA',
    decimals: 18,
    icon: 'eth',
    networks: [
      { id: 'ethereum', name: 'Ethereum', chainId: 1, isTestnet: false },
      { id: 'bsc', name: 'BSC', chainId: 56, isTestnet: false },
    ],
  },
};

export const FIAT_CURRENCIES: Record<FiatCurrency, { symbol: string; name: string }> = {
  ZAR: { symbol: 'R', name: 'South African Rand' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
};

export const CRYPTO_SYMBOLS: CryptoSymbol[] = ['USDT', 'BTC', 'ETH'];
export const FIAT_SYMBOLS: FiatCurrency[] = ['ZAR', 'USD', 'EUR', 'GBP', 'NGN'];

/**
 * Get crypto color by symbol
 */
export function getCryptoColor(symbol: CryptoSymbol): string {
  return CRYPTOCURRENCIES[symbol]?.color || '#64748b';
}

/**
 * Get fiat symbol
 */
export function getFiatSymbol(currency: FiatCurrency): string {
  return FIAT_CURRENCIES[currency]?.symbol || currency;
}

/**
 * Format crypto amount with proper decimals
 */
export function formatCryptoAmount(amount: number, symbol: CryptoSymbol): string {
  const decimals = CRYPTOCURRENCIES[symbol]?.decimals || 8;
  const maxDecimals = Math.min(decimals, 8);
  return amount.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

/**
 * Format fiat amount
 */
export function formatFiatAmount(amount: number, currency: FiatCurrency): string {
  const symbol = getFiatSymbol(currency);
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default CRYPTOCURRENCIES;
