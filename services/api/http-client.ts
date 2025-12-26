/**
 * HTTP Client
 * Centralized HTTP client with authentication and error handling
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { getToken, isTokenExpiringSoon } from './token-manager';
import { ApiResponse, ApiError, API_ERROR_CODES } from '@/types';

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

export function setTokenRefreshCallback(callback: () => Promise<void>): void {
  tokenRefreshCallback = callback;
}

// Request interceptor
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);

    // Get auth token
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Check if token is expiring soon
      if (isTokenExpiringSoon() && tokenRefreshCallback) {
        console.log('[HTTP] Token expiring soon, triggering refresh...');
        try {
          await tokenRefreshCallback();
        } catch (error) {
          console.error('[HTTP] Token refresh failed:', error);
        }
      }
    }

    // Log request body in development
    if (__DEV__ && config.data) {
      console.log('[HTTP] Request body:', JSON.stringify(config.data, null, 2));
    }

    return config;
  },
  (error) => {
    console.error('[HTTP] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[HTTP] Response ${response.status} for ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[HTTP] 401 Unauthorized, attempting token refresh...');
      originalRequest._retry = true;

      if (tokenRefreshCallback) {
        try {
          await tokenRefreshCallback();
          const newToken = await getToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return httpClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('[HTTP] Token refresh failed:', refreshError);
        }
      }
    }

    // Handle 429 Rate Limited
    if (error.response?.status === 429) {
      console.warn('[HTTP] Rate limited! Slow down requests.');
    }

    // Log error details
    console.error('[HTTP] Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(formatError(error));
  }
);

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
 * GET request
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await httpClient.get<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
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
    const response = await httpClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
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
    const response = await httpClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
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
    const response = await httpClient.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE request
 */
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await httpClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
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
};
