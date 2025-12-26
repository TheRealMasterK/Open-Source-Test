/**
 * Logger Utility
 * Conditional logging based on environment configuration
 */

import { ENV } from '@/config/env';
import { addBreadcrumb } from '@/config/sentry.config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // Always log errors and warnings
    if (level === 'error' || level === 'warn') return true;
    
    // Log debug/info only if debug logs are enabled or in development
    return ENV.ENABLE_DEBUG_LOGS || __DEV__;
  }

  private addSentryBreadcrumb(level: LogLevel, context: string, message: string, data?: any) {
    if (level === 'error' || level === 'warn') {
      addBreadcrumb({
        message: `[${context}] ${message}`,
        level: level === 'error' ? 'error' : 'warning',
        category: context.toLowerCase(),
        data,
      });
    }
  }

  debug(context: string, message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(`[${context}] ${message}`, data || '');
    }
  }

  info(context: string, message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(`[${context}] ${message}`, data || '');
    }
  }

  warn(context: string, message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`[${context}] ${message}`, data || '');
    }
    this.addSentryBreadcrumb('warn', context, message, data);
  }

  error(context: string, message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(`[${context}] ${message}`, error || '');
    }
    this.addSentryBreadcrumb('error', context, message, error);
  }

  // Specialized loggers for common contexts
  api = {
    request: (method: string, url: string, data?: any) => {
      this.debug('HTTP', `${method.toUpperCase()} ${url}`, data);
    },
    response: (status: number, url: string) => {
      this.debug('HTTP', `Response ${status} for ${url}`);
    },
    error: (message: string, error: any) => {
      this.error('HTTP', message, error);
    },
  };

  auth = {
    info: (message: string) => this.info('Auth', message),
    error: (message: string, error?: any) => this.error('Auth', message, error),
  };

  firebase = {
    info: (message: string) => this.info('Firebase', message),
    error: (message: string, error?: any) => this.error('Firebase', message, error),
  };

  sentry = {
    info: (message: string) => this.info('Sentry', message),
    warn: (message: string) => this.warn('Sentry', message),
  };

  app = {
    info: (message: string, data?: any) => this.info('App', message, data),
    error: (message: string, error?: any) => this.error('App', message, error),
  };
}

// Export singleton instance
export const logger = new Logger();

export default logger;
