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
 * Matches backend routes at /api/v1/*
 */
export const API_ENDPOINTS = {
  // Auth - matches /api/v1/auth/*
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    DELETE: (userId: string) => `/auth/delete/${userId}`,
    OAUTH_SYNC: '/auth/oauth-sync',
    SOCIAL_SYNC: '/auth/social-sync',
    VERIFY: '/auth/verify',
  },

  // Dashboard - matches /api/v1/dashboard/*
  DASHBOARD: {
    BASE: '/dashboard',
    SUMMARY: '/dashboard/summary',
  },

  // Offers - matches /api/v1/offers/*
  OFFERS: {
    BASE: '/offers',
    BUY: '/offers/buy',
    SELL: '/offers/sell',
    BY_USER: (userId: string) => `/offers/user/${userId}`,
    BY_ID: (id: string) => `/offers/${id}`,
    PAUSE: (id: string) => `/offers/${id}/pause`,
    RESUME: (id: string) => `/offers/${id}/resume`,
  },

  // Trades - matches /api/v1/trades/*
  TRADES: {
    BASE: '/trades',
    ACTIVE: '/trades/active',
    COMPLETED: '/trades/completed',
    BY_ID: (id: string) => `/trades/${id}`,
    STATUS: (id: string) => `/trades/${id}/status`,
    CANCEL: (id: string) => `/trades/${id}/cancel`,
    COMPLETE: (id: string) => `/trades/${id}/complete`,
    MESSAGES: (id: string) => `/trades/${id}/messages`,
  },

  // Wallet - matches /api/v1/wallet/*
  WALLET: {
    BASE: '/wallet',
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    PENDING: '/wallet/pending',
    DEPOSIT: '/wallet/deposit',
    WITHDRAW: '/wallet/withdraw',
  },

  // Escrow - matches /api/v1/escrow/*
  ESCROW: {
    BASE: '/escrow',
    BY_ID: (id: string) => `/escrow/${id}`,
    LINK: (id: string) => `/escrow/${id}/link`,
    DISPUTE: (id: string) => `/escrow/${id}/dispute`,
    STATS: '/escrow/stats',
  },

  // Affiliate - matches /api/v1/affiliate/*
  AFFILIATE: {
    STATS: '/affiliate/stats',
    REFERRALS: '/affiliate/referrals',
    EARNINGS: '/affiliate/earnings',
    TIERS: '/affiliate/tiers',
    PAYOUTS: '/affiliate/payouts',
    GENERATE_LINK: '/affiliate/generate-link',
    REQUEST_PAYOUT: '/affiliate/request-payout',
  },

  // Reseller - matches /api/v1/reseller/*
  RESELLER: {
    STATS: '/reseller/stats',
    ACTIVE: '/reseller/active',
    TRADES: '/reseller/trades',
    CREATE: '/reseller/create',
  },

  // Users - matches /api/v1/users/*
  USERS: {
    ME: '/users/me',
    ME_STATS: '/users/me/stats',
    ME_NOTIFICATIONS: '/users/me/notifications',
    PROFILE: '/users/profile',
    BY_ID: (id: string) => `/users/${id}`,
    PUBLIC_PROFILE: (id: string) => `/users/${id}/public`,
    SETTINGS: '/users/settings',
    RATINGS: (id: string) => `/users/${id}/ratings`,
    RATE: (id: string) => `/users/${id}/rate`,
    TOP_TRADERS: '/users/top',
    CHECK_USERNAME: (username: string) => `/users/check-username/${username}`,
    WALLET: '/users/wallet',
    WALLET_LINK: '/users/wallet/link',
    WALLET_UNLINK: '/users/wallet/unlink',
    TWO_FA_STATUS: '/users/2fa/status',
    TWO_FA_SETUP: '/users/2fa/setup',
    TWO_FA_VERIFY: '/users/2fa/verify',
    TWO_FA_DISABLE: '/users/2fa/disable',
    REPORT: (id: string) => `/users/${id}/report`,
    BLOCK: (id: string) => `/users/${id}/block`,
    UNTRUST: (id: string) => `/users/${id}/untrust`,
  },

  // KYC - matches /api/v1/kyc/*
  KYC: {
    STATUS: '/kyc/status',
    UPLOAD: '/kyc/upload',
    SUBMIT: '/kyc/submit',
    DOCUMENTS: '/kyc/documents',
  },

  // Payment Methods - matches /api/v1/payment-methods/*
  PAYMENT_METHODS: {
    BASE: '/payment-methods',
    BY_ID: (id: string) => `/payment-methods/${id}`,
  },

  // Prices - matches /api/v1/prices/*
  PRICES: {
    BASE: '/prices',
    BY_COIN: (coinId: string) => `/prices/${coinId}`,
    CONVERT_TO_USD: '/prices/convert/to-usd',
    CONVERT_FROM_USD: '/prices/convert/from-usd',
  },

  // Notifications - matches /api/v1/notifications/*
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },

  // Support - matches /api/v1/support/*
  SUPPORT: {
    BASE: '/support',
    BY_ID: (id: string) => `/support/${id}`,
    MESSAGES: (id: string) => `/support/${id}/messages`,
  },

  // Health - matches /api/v1/health
  HEALTH: '/health',
  VERSION: '/version',
} as const;

export default API_CONFIG;
