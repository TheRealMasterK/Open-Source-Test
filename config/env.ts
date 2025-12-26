/**
 * Environment configuration
 * Centralizes all environment variables with validation
 */

export const ENV = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.qictrader.com',
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || 'https://api.qictrader.com',

  // Firebase Configuration
  FIREBASE: {
    API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  },

  // Sentry Configuration
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || '',

  // Feature Flags
  ENABLE_DEBUG_LOGS: process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === 'true',
  USE_TESTNET: process.env.EXPO_PUBLIC_USE_TESTNET === 'true',
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = ['EXPO_PUBLIC_API_BASE_URL'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn('[ENV] Missing environment variables:', missing);
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export default ENV;
