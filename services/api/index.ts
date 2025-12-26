/**
 * API Services barrel export
 */

// HTTP Client (export default API methods and httpClient instance separately)
export { default as httpClient } from './http-client';
export { httpClient as httpClientInstance } from './http-client';

// Token Manager
export * from './token-manager';
export { default as tokenManager } from './token-manager';

// Auth API
export * from './auth-api';
export { default as authApi } from './auth-api';

// Offers API
export * from './offers-api';
export { default as offersApi } from './offers-api';

// Trades API
export * from './trades-api';
export { default as tradesApi } from './trades-api';

// Wallet API
export * from './wallet-api';
export { default as walletApi } from './wallet-api';

// Affiliate API
export * from './affiliate-api';
export { default as affiliateApi } from './affiliate-api';

// KYC API
export * from './kyc-api';
export { default as kycApi } from './kyc-api';

// Users API
export * from './users-api';
export { default as usersApi } from './users-api';

// Payment Methods API
export * from './payment-methods-api';
export { default as paymentMethodsApi } from './payment-methods-api';

// Prices API
export * from './prices-api';
export { default as pricesApi } from './prices-api';

// Dashboard API
export * from './dashboard-api';
export { default as dashboardApi } from './dashboard-api';
