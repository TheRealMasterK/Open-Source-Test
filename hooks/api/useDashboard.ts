/**
 * Dashboard Hook
 * React Query hooks for user dashboard data
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboard, getTradingSummary } from '@/services/api/dashboard-api';
import { UserDashboardStats, TradingSummary, DashboardStatCard, RecentActivity } from '@/types/dashboard.types';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { API_ERROR_CODES } from '@/types';

// Don't retry on auth errors
const shouldRetry = (failureCount: number, error: unknown) => {
  const apiError = error as { code?: string };
  if (apiError?.code === API_ERROR_CODES.UNAUTHORIZED || apiError?.code === API_ERROR_CODES.FORBIDDEN) {
    return false;
  }
  return failureCount < 2;
};

// Query keys for caching
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: ['dashboard', 'stats'] as const,
  summary: ['dashboard', 'summary'] as const,
};

/**
 * Hook to get user's dashboard statistics
 * Only fetches when user is authenticated
 */
export function useDashboard(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: async () => {
      console.log('[useDashboard] Fetching dashboard data');
      const dashboard = await getDashboard();
      console.log('[useDashboard] Dashboard fetched:', {
        totalTrades: dashboard?.totalTrades,
        activeTrades: dashboard?.activeTrades,
        rating: dashboard?.rating,
      });
      return dashboard;
    },
    staleTime: 60 * 1000, // 1 minute - increased to reduce API calls
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Hook to get trading summary
 * Only fetches when user is authenticated
 */
export function useTradingSummary(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: async () => {
      console.log('[useTradingSummary] Fetching trading summary');
      const summary = await getTradingSummary();
      console.log('[useTradingSummary] Summary fetched:', {
        totalTrades: summary?.overall?.totalTrades,
        completed: summary?.overall?.completed,
      });
      return summary;
    },
    staleTime: 60 * 1000, // 1 minute - increased to reduce API calls
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Hook to get dashboard data formatted as stat cards for UI
 */
export function useDashboardStats() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: dashboard, isLoading: queryLoading, isFetching, error, refetch } = useDashboard();

  console.log('[useDashboardStats] State:', {
    isAuthenticated,
    queryLoading,
    isFetching,
    hasDashboard: !!dashboard,
    error: error?.message,
  });

  // Only show loading when authenticated AND actively fetching
  // Don't show loading if not authenticated (query is disabled)
  const isLoading = isAuthenticated && (queryLoading || isFetching);

  // Transform dashboard data to stat cards
  const stats: DashboardStatCard[] = dashboard
    ? [
        {
          id: 'active-trades',
          icon: 'repeat',
          value: dashboard.activeTrades,
          label: 'Active Trades',
          subtitle: `${dashboard.totalTrades} total`,
          gradientColors: ['#00A3F6', '#0066CC'] as const,
        },
        {
          id: 'completed',
          icon: 'check-circle',
          value: dashboard.completedTrades,
          label: 'Completed',
          subtitle: `${dashboard.successRate}% success rate`,
          gradientColors: ['#10B981', '#059669'] as const,
        },
        {
          id: 'volume',
          icon: 'trending-up',
          value: `$${dashboard.totalVolume.toLocaleString()}`,
          label: 'Total Volume',
          subtitle: `$${dashboard.volumeThisMonth.toLocaleString()} this month`,
          gradientColors: ['#F59E0B', '#D97706'] as const,
        },
        {
          id: 'escrow',
          icon: 'shield',
          value: dashboard.activeEscrows,
          label: 'In Escrow',
          subtitle: `$${dashboard.totalEscrowAmount.toLocaleString()} held`,
          gradientColors: ['#8B5CF6', '#7C3AED'] as const,
        },
      ]
    : [];

  return {
    stats,
    dashboard,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get recent activity
 */
export function useRecentActivity() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: dashboard, isLoading: queryLoading, isFetching, error } = useDashboard();

  console.log('[useRecentActivity] State:', {
    isAuthenticated,
    queryLoading,
    isFetching,
    hasActivities: !!dashboard?.recentActivity?.length,
  });

  // Only show loading when authenticated AND actively fetching
  const isLoading = isAuthenticated && (queryLoading || isFetching);

  return {
    activities: dashboard?.recentActivity || [],
    isLoading,
    error,
  };
}

/**
 * Hook to get user performance stats
 */
export function useUserPerformance() {
  const { data: dashboard, isLoading, error } = useDashboard();

  return {
    rating: dashboard?.rating || 0,
    totalRatings: dashboard?.totalRatings || 0,
    successRate: dashboard?.successRate || 0,
    avgResponseTime: dashboard?.avgResponseTime,
    verified: dashboard?.verified || false,
    kycLevel: dashboard?.kycLevel || 'none',
    memberSince: dashboard?.memberSince,
    isLoading,
    error,
  };
}

/**
 * Hook to refresh dashboard data
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      console.log('[useRefreshDashboard] Refreshing dashboard data');
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    refreshStats: () => {
      console.log('[useRefreshDashboard] Refreshing dashboard stats');
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats });
    },
    refreshSummary: () => {
      console.log('[useRefreshDashboard] Refreshing trading summary');
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
    },
  };
}

export default {
  useDashboard,
  useTradingSummary,
  useDashboardStats,
  useRecentActivity,
  useUserPerformance,
  useRefreshDashboard,
};
