/**
 * Sentry Configuration
 * Error tracking and performance monitoring setup
 */

import * as Sentry from '@sentry/react-native';
import { ENV } from './env';

export const SENTRY_CONFIG = {
  dsn: ENV.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  debug: __DEV__,
  enableInExpoDevelopment: false, // Disable in Expo Go
  tracesSampleRate: __DEV__ ? 0.0 : 1.0, // Sample 100% of transactions in production
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
  enableNative: true,
  enableNativeCrashHandling: true,
  enableAutoPerformanceTracing: true,
} as const;

/**
 * Initialize Sentry
 */
export function initSentry() {
  if (!ENV.SENTRY_DSN) {
    console.warn('[Sentry] DSN not configured. Skipping initialization.');
    return;
  }

  if (__DEV__ && !SENTRY_CONFIG.enableInExpoDevelopment) {
    console.log('[Sentry] Disabled in development mode');
    return;
  }

  Sentry.init(SENTRY_CONFIG);

  console.log('[Sentry] Initialized successfully');
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  username?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Clear user context
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('additional_context', context);
  }
  Sentry.captureException(error);
}

/**
 * Capture message manually
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) {
  Sentry.addBreadcrumb(breadcrumb);
}

export default Sentry;
