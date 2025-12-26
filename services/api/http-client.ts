/**
 * HTTP Client
 * Centralized HTTP client with authentication, rate limiting protection, and error handling
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { getToken, isTokenExpiringSoon, removeToken } from './token-manager';
import { ApiResponse, ApiError, API_ERROR_CODES } from '@/types';
import { logger } from '@/utils/logger';
import { logApiError } from '@/utils/sentry';

// Rate limiting protection configuration
const REQUEST_THROTTLE_MS = 300; // Minimum time between requests (increased from 150)
const RATE_LIMIT_RETRY_DELAY = 10000; // 10 seconds wait after 429 (increased from 5)
const MAX_RATE_LIMIT_RETRIES = 3;
const CACHE_TTL_RATE_LIMITED = 60000; // 1 minute cache when rate limited

// Track request timing for throttling
let lastRequestTime = 0;
let isRateLimited = false;
let rateLimitResetTime = 0;

// Request queue to serialize concurrent requests
let requestQueue: Promise<void> = Promise.resolve();

// In-memory request cache for GET requests
const requestCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
const CACHE_TTL = 30000; // 30 seconds

// Track in-flight requests to prevent duplicate concurrent requests
const inFlightRequests = new Map<string, Promise<unknown>>();

// Endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/offers',
  '/offers/buy',
  '/offers/sell',
  '/auth/login',
  '/auth/signup',
  '/auth/refresh-token',
];

/**
 * Check if endpoint is public (doesn't require auth)
 */
function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint) || url.includes(endpoint));
}

/**
 * Get cached response if valid
 */
function getCachedResponse(cacheKey: string): unknown | null {
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    logger.debug('HTTP', `[Cache HIT] ${cacheKey}`);
    return cached.data;
  }
  return null;
}

/**
 * Set response in cache
 */
function setCachedResponse(cacheKey: string, data: unknown, ttl: number = CACHE_TTL): void {
  requestCache.set(cacheKey, { data, timestamp: Date.now(), ttl });
  // Cleanup old entries
  if (requestCache.size > 50) {
    const firstKey = requestCache.keys().next().value;
    if (firstKey) requestCache.delete(firstKey);
  }
}

/**
 * Clear cache for specific key or all
 */
export function clearCache(keyPattern?: string): void {
  if (keyPattern) {
    for (const key of requestCache.keys()) {
      if (key.includes(keyPattern)) requestCache.delete(key);
    }
  } else {
    requestCache.clear();
  }
  logger.debug('HTTP', `Cache cleared: ${keyPattern || 'all'}`);
}

/**
 * Throttle requests to prevent rate limiting - uses queue to serialize
 */
async function throttleRequest(): Promise<void> {
  // Wait for previous request to complete
  const previousRequest = requestQueue;
  let resolveQueue: () => void;
  requestQueue = new Promise((resolve) => {
    resolveQueue = resolve;
  });

  await previousRequest;

  // Check if rate limited
  if (isRateLimited && Date.now() < rateLimitResetTime) {
    const waitTime = rateLimitResetTime - Date.now();
    logger.warn('HTTP', `Rate limited, waiting ${waitTime}ms...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    isRateLimited = false;
  }

  // Throttle between requests
  const elapsed = Date.now() - lastRequestTime;
  if (elapsed < REQUEST_THROTTLE_MS) {
    await new Promise((resolve) => setTimeout(resolve, REQUEST_THROTTLE_MS - elapsed));
  }
  lastRequestTime = Date.now();

  // Release queue for next request after a small delay
  setTimeout(() => resolveQueue!(), 50);
}

/**
 * Set rate limited state
 */
function setRateLimited(): void {
  isRateLimited = true;
  rateLimitResetTime = Date.now() + RATE_LIMIT_RETRY_DELAY;
  logger.warn('HTTP', `Rate limit hit, will retry after ${RATE_LIMIT_RETRY_DELAY}ms`);
}

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh callback (set by auth hook)
let tokenRefreshCallback: (() => Promise<void>) | null = null;

// Auth failure callback (set by AuthGate to handle logout)
let authFailureCallback: (() => void) | null = null;

// Track consecutive 401 errors
let consecutive401Count = 0;
const MAX_401_BEFORE_LOGOUT = 2;

export function setTokenRefreshCallback(callback: () => Promise<void>): void {
  tokenRefreshCallback = callback;
}

export function setAuthFailureCallback(callback: () => void): void {
  authFailureCallback = callback;
}

/**
 * Reset 401 counter on successful auth
 */
export function resetAuthFailureCount(): void {
  consecutive401Count = 0;
}

// Request interceptor with throttling
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Apply request throttling
    await throttleRequest();

    logger.api.request(config.method || 'GET', config.url || '');

    // Get auth token
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Check if token is expiring soon
      if (isTokenExpiringSoon() && tokenRefreshCallback) {
        logger.debug('HTTP', 'Token expiring soon, triggering refresh...');
        try {
          await tokenRefreshCallback();
        } catch (error) {
          logger.api.error('Token refresh failed', error);
        }
      }
    }

    // Log request body in development
    if (__DEV__ && config.data) {
      logger.debug('HTTP', `Request body: ${JSON.stringify(config.data, null, 2)}`);
    }

    return config;
  },
  (error) => {
    logger.api.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.api.response(response.status, response.config.url || '');
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      consecutive401Count++;
      logger.debug('HTTP', `401 Unauthorized (count: ${consecutive401Count}), attempting token refresh...`);
      originalRequest._retry = true;

      // If we get too many 401s, clear token and trigger logout
      if (consecutive401Count >= MAX_401_BEFORE_LOGOUT) {
        logger.warn('HTTP', `Too many 401 errors (${consecutive401Count}), clearing auth and logging out...`);
        await removeToken();
        if (authFailureCallback) {
          authFailureCallback();
        }
        consecutive401Count = 0;
        return Promise.reject(formatError(error));
      }

      if (tokenRefreshCallback) {
        try {
          await tokenRefreshCallback();
          const newToken = await getToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            consecutive401Count = 0; // Reset on successful refresh
            return httpClient(originalRequest);
          }
        } catch (refreshError) {
          logger.api.error('Token refresh failed', refreshError);
          // Token refresh failed, clear and logout
          await removeToken();
          if (authFailureCallback) {
            authFailureCallback();
          }
        }
      }
    }

    // Handle 429 Rate Limited - don't retry aggressively, just set rate limited state
    if (error.response?.status === 429) {
      setRateLimited();

      // Only retry once after longer delay
      const retryCount = originalRequest._rateLimitRetry || 0;
      if (retryCount < 1) {
        originalRequest._rateLimitRetry = retryCount + 1;
        logger.warn('HTTP', `Rate limited! Will retry once after ${RATE_LIMIT_RETRY_DELAY}ms`);
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY));
        return httpClient(originalRequest);
      }

      logger.error('HTTP', 'Rate limited - returning cached error to avoid spam');
    }

    // Log error and send to Sentry
    const errorDetails = {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
    };
    
    logger.api.error('Response error', errorDetails);
    
    // Send to Sentry (exclude 401/403 as they're expected)
    if (error.response?.status && ![401, 403].includes(error.response.status)) {
      logApiError(error, error.config?.url || 'unknown', errorDetails);
    }

    return Promise.reject(formatError(error));
  }
);

/**
 * Normalize API response to ensure consistent structure
 * Backend may not always include 'success' field, so we add it based on response presence
 * Handles both simple responses and paginated responses
 */
function normalizeResponse<T>(data: unknown): ApiResponse<T> {
  // If response already has success field, return as-is
  if (data && typeof data === 'object' && 'success' in data) {
    console.log('[HTTP] Response already has success field');
    return data as ApiResponse<T>;
  }

  if (data && typeof data === 'object') {
    const backendData = data as Record<string, unknown>;

    // Check if this is a paginated response (has data array AND total)
    // Backend returns: { data: [...], total: 11, message: "..." }
    // We need to preserve the whole structure as response.data
    const isPaginatedResponse = Array.isArray(backendData.data) && 'total' in backendData;

    if (isPaginatedResponse) {
      console.log('[HTTP] Normalizing paginated response, total:', backendData.total);
      return {
        success: true,
        // Keep the whole paginated structure: { data: [...], total: 11 }
        data: {
          data: backendData.data,
          total: backendData.total,
          page: backendData.page,
          limit: backendData.limit,
        } as T,
        message: backendData.message as string || undefined,
      };
    }

    // For non-paginated responses, extract data if it exists, otherwise use whole response
    console.log('[HTTP] Normalizing simple response');
    return {
      success: true,
      data: (backendData.data as T) ?? (data as T),
      message: backendData.message as string || undefined,
    };
  }

  // Fallback for empty or null responses
  console.log('[HTTP] Normalizing empty response');
  return {
    success: true,
    data: data as T,
  };
}

/**
 * Format error into ApiError
 */
function formatError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        code: API_ERROR_CODES.NETWORK_ERROR,
        message: 'Network error. Please check your connection.',
      };
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        return {
          code: API_ERROR_CODES.UNAUTHORIZED,
          message: data?.message || 'Unauthorized. Please log in again.',
        };
      case 403:
        return {
          code: API_ERROR_CODES.FORBIDDEN,
          message: data?.message || 'Access denied.',
        };
      case 404:
        return {
          code: API_ERROR_CODES.NOT_FOUND,
          message: data?.message || 'Resource not found.',
        };
      case 422:
        return {
          code: API_ERROR_CODES.VALIDATION_ERROR,
          message: data?.message || 'Validation error.',
          details: data?.errors,
        };
      case 429:
        return {
          code: API_ERROR_CODES.RATE_LIMITED,
          message: 'Too many requests. Please try again later.',
        };
      default:
        return {
          code: API_ERROR_CODES.INTERNAL_ERROR,
          message: data?.message || 'An unexpected error occurred.',
        };
    }
  }

  return {
    code: API_ERROR_CODES.INTERNAL_ERROR,
    message: 'An unexpected error occurred.',
  };
}

/**
 * GET request with caching and request deduplication
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig & { skipCache?: boolean; requiresAuth?: boolean }
): Promise<ApiResponse<T>> {
  // Generate cache key
  const cacheKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;

  // Check cache first (unless skipCache is true)
  if (!config?.skipCache) {
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return cached as ApiResponse<T>;
    }
  }

  // For protected endpoints, check if we have a token first
  const requiresAuth = config?.requiresAuth ?? !isPublicEndpoint(url);
  if (requiresAuth) {
    const token = await getToken();
    if (!token) {
      logger.warn('HTTP', `Skipping ${url} - no auth token available`);
      throw {
        code: API_ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required. Please log in.',
      };
    }
  }

  // Check if request is already in flight - return existing promise to deduplicate
  const existingRequest = inFlightRequests.get(cacheKey);
  if (existingRequest) {
    logger.debug('HTTP', `Deduplicating request: ${url}`);
    return existingRequest as Promise<ApiResponse<T>>;
  }

  // Create the request promise
  const requestPromise = (async () => {
    try {
      const response = await httpClient.get(url, config);

      // Normalize and cache successful responses
      const normalized = normalizeResponse<T>(response.data);

      if (normalized) {
        setCachedResponse(cacheKey, normalized);
      }

      return normalized;
    } catch (error) {
      logger.api.error(`GET ${url}`, error);
      throw error;
    } finally {
      // Remove from in-flight after completion
      inFlightRequests.delete(cacheKey);
    }
  })();

  // Track in-flight request
  inFlightRequests.set(cacheKey, requestPromise);

  return requestPromise;
}

/**
 * POST request
 */
export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await httpClient.post(url, data, config);
    return normalizeResponse<T>(response.data);
  } catch (error) {
    logger.api.error(`POST ${url}`, error);
    throw error;
  }
}

/**
 * PUT request
 */
export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await httpClient.put(url, data, config);
    return normalizeResponse<T>(response.data);
  } catch (error) {
    logger.api.error(`PUT ${url}`, error);
    throw error;
  }
}

/**
 * PATCH request
 */
export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await httpClient.patch(url, data, config);
    return normalizeResponse<T>(response.data);
  } catch (error) {
    logger.api.error(`PATCH ${url}`, error);
    throw error;
  }
}

/**
 * DELETE request
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await httpClient.delete(url, config);
    return normalizeResponse<T>(response.data);
  } catch (error) {
    logger.api.error(`DELETE ${url}`, error);
    throw error;
  }
}

export { httpClient };
export default {
  get,
  post,
  put,
  patch,
  del,
  setTokenRefreshCallback,
  clearCache,
};
