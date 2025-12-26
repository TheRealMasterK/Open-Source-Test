/**
 * API Configuration
 * Centralized configuration for API calls
 */

import ENV from './env';

export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  SOCKET_URL: ENV.SOCKET_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    DELETE: '/auth/delete',
    SOCIAL_SYNC: '/auth/social-sync',
  },

  // Offers
  OFFERS: {
    BASE: '/offers',
    BUY: '/offers/buy',
    SELL: '/offers/sell',
    BY_ID: (id: string) => `/offers/${id}`,
    PAUSE: (id: string) => `/offers/${id}/pause`,
    RESUME: (id: string) => `/offers/${id}/resume`,
  },

  // Trades
  TRADES: {
    BASE: '/trades',
    ACTIVE: '/trades/active',
    COMPLETED: '/trades/completed',
    BY_ID: (id: string) => `/trades/${id}`,
    STATUS: (id: string) => `/trades/${id}/status`,
    MESSAGES: (id: string) => `/trades/${id}/messages`,
  },

  // Wallet
  WALLET: {
    BASE: '/wallet',
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    DEPOSIT: '/wallet/deposit',
    WITHDRAW: '/wallet/withdraw',
  },

  // Escrow
  ESCROW: {
    BASE: '/escrow',
    BY_ID: (id: string) => `/escrow/${id}`,
    LINK: (id: string) => `/escrow/${id}/link`,
    DISPUTE: (id: string) => `/escrow/${id}/dispute`,
    STATS: '/escrow/stats',
  },

  // Affiliate
  AFFILIATE: {
    STATS: '/affiliate/stats',
    REFERRALS: '/affiliate/referrals',
    EARNINGS: '/affiliate/earnings',
    TIERS: '/affiliate/tiers',
    PAYOUTS: '/affiliate/payouts',
    GENERATE_LINK: '/affiliate/generate-link',
    REQUEST_PAYOUT: '/affiliate/request-payout',
  },

  // Reseller
  RESELLER: {
    STATS: '/reseller/stats',
    ACTIVE: '/reseller/active',
    TRADES: '/reseller/trades',
    CREATE: '/reseller/create',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    BY_ID: (id: string) => `/users/${id}`,
    SETTINGS: '/users/settings',
    RATINGS: (id: string) => `/users/${id}/ratings`,
    RATE: (id: string) => `/users/${id}/rate`,
    TOP_TRADERS: '/users/top-traders',
  },

  // KYC
  KYC: {
    STATUS: '/kyc/status',
    UPLOAD: '/kyc/upload',
    SUBMIT: '/kyc/submit',
    DOCUMENTS: '/kyc/documents',
  },

  // Payment Methods
  PAYMENT_METHODS: {
    BASE: '/payment-methods',
    BY_ID: (id: string) => `/payment-methods/${id}`,
  },

  // Prices
  PRICES: {
    BASE: '/prices',
  },

  // System
  SYSTEM: {
    STATUS: '/system/status',
    CONTACT: '/system/contact',
    PRIVACY: '/system/privacy',
    TERMS: '/system/terms',
  },
} as const;

export default API_CONFIG;
