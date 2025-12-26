/**
 * Dashboard API Service
 * Handles user dashboard endpoints
 */

import { get } from './http-client';
import { API_ENDPOINTS } from '@/config/api.config';
import {
  DashboardResponse,
  TradingSummaryResponse,
  UserDashboardStats,
  TradingSummary,
} from '@/types/dashboard.types';

/**
 * Get user's personal dashboard statistics
 * Requires authentication
 */
export async function getDashboard(): Promise<UserDashboardStats> {
  console.log('[DashboardAPI] Getting user dashboard');

  try {
    const response = await get<DashboardResponse>(API_ENDPOINTS.DASHBOARD.BASE);

    console.log('[DashboardAPI] Dashboard retrieved:', {
      totalTrades: response.dashboard?.totalTrades,
      activeTrades: response.dashboard?.activeTrades,
      rating: response.dashboard?.rating,
    });

    return response.dashboard;
  } catch (error) {
    console.error('[DashboardAPI] Error getting dashboard:', error);
    throw error;
  }
}

/**
 * Get user's trading summary
 * Requires authentication
 */
export async function getTradingSummary(): Promise<TradingSummary> {
  console.log('[DashboardAPI] Getting trading summary');

  try {
    const response = await get<TradingSummaryResponse>(API_ENDPOINTS.DASHBOARD.SUMMARY);

    console.log('[DashboardAPI] Trading summary retrieved:', {
      totalTrades: response.summary?.overall?.totalTrades,
      completed: response.summary?.overall?.completed,
    });

    return response.summary;
  } catch (error) {
    console.error('[DashboardAPI] Error getting trading summary:', error);
    throw error;
  }
}

export default {
  getDashboard,
  getTradingSummary,
};
