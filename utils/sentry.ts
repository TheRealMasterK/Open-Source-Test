/**
 * Sentry Utilities
 * Helper functions for error tracking and monitoring
 */

import * as Sentry from '@sentry/react-native';
import { captureException, captureMessage, addBreadcrumb } from '@/config/sentry.config';

/**
 * Log API errors to Sentry
 */
export function logApiError(error: unknown, endpoint: string, context?: Record<string, any>) {
  addBreadcrumb({
    message: `API Error: ${endpoint}`,
    category: 'api',
    level: 'error',
    data: {
      endpoint,
      ...context,
    },
  });

  if (error instanceof Error) {
    captureException(error, {
      endpoint,
      type: 'api_error',
      ...context,
    });
  }
}

/**
 * Log authentication errors
 */
export function logAuthError(error: unknown, action: string) {
  addBreadcrumb({
    message: `Auth Error: ${action}`,
    category: 'auth',
    level: 'error',
  });

  if (error instanceof Error) {
    captureException(error, {
      action,
      type: 'auth_error',
    });
  }
}

/**
 * Log navigation events
 */
export function logNavigation(route: string, params?: Record<string, any>) {
  addBreadcrumb({
    message: `Navigation: ${route}`,
    category: 'navigation',
    level: 'info',
    data: params,
  });
}

/**
 * Log trade actions
 */
export function logTradeAction(action: string, tradeId?: string, details?: Record<string, any>) {
  addBreadcrumb({
    message: `Trade Action: ${action}`,
    category: 'trade',
    level: 'info',
    data: {
      tradeId,
      ...details,
    },
  });
}

/**
 * Log payment actions
 */
export function logPaymentAction(action: string, details?: Record<string, any>) {
  addBreadcrumb({
    message: `Payment Action: ${action}`,
    category: 'payment',
    level: 'info',
    data: details,
  });
}

/**
 * Log KYC actions
 */
export function logKYCAction(action: string, details?: Record<string, any>) {
  addBreadcrumb({
    message: `KYC Action: ${action}`,
    category: 'kyc',
    level: 'info',
    data: details,
  });
}

/**
 * Log performance metrics
 */
export function logPerformance(metric: string, value: number, unit: string = 'ms') {
  addBreadcrumb({
    message: `Performance: ${metric}`,
    category: 'performance',
    level: 'info',
    data: {
      metric,
      value,
      unit,
    },
  });
}

/**
 * Start a performance span
 * Note: In newer Sentry versions, use Sentry.startSpan for performance tracking
 */
export function startPerformanceSpan(name: string, operation: string) {
  return Sentry.startSpan(
    {
      name,
      op: operation,
    },
    () => {}
  );
}

export {
  captureException,
  captureMessage,
  addBreadcrumb,
};
