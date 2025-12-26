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

    // Extract dashboard from API response wrapper
    const dashboardData = response.data?.dashboard || response as unknown as UserDashboardStats;

    console.log('[DashboardAPI] Dashboard retrieved:', {
      totalTrades: dashboardData?.totalTrades,
      activeTrades: dashboardData?.activeTrades,
      rating: dashboardData?.rating,
    });

    return dashboardData;
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

    // Extract summary from API response wrapper
    const summaryData = response.data?.summary || response as unknown as TradingSummary;

    console.log('[DashboardAPI] Trading summary retrieved:', {
      totalTrades: summaryData?.overall?.totalTrades,
      completed: summaryData?.overall?.completed,
    });

    return summaryData;
  } catch (error) {
    console.error('[DashboardAPI] Error getting trading summary:', error);
    throw error;
  }
}

export default {
  getDashboard,
  getTradingSummary,
};
