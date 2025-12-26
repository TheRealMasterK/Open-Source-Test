/**
 * Dashboard Types
 * User dashboard statistics types from backend
 */

export interface RecentActivity {
  id: string;
  type: 'trade' | 'escrow' | 'rating' | 'offer';
  description: string;
  amount?: number;
  currency?: string;
  timestamp: string;
  status?: string;
}

export interface UserDashboardStats {
  // Trading Stats
  totalTrades: number;
  activeTrades: number;
  completedTrades: number;
  cancelledTrades: number;
  successRate: number;

  // Volume Stats
  totalVolume: number;
  volumeThisMonth: number;
  avgTradeValue: number;

  // Escrow Stats
  activeEscrows: number;
  totalEscrowAmount: number;

  // Performance
  rating: number;
  totalRatings: number;
  avgResponseTime?: number;

  // Account
  memberSince: string;
  kycLevel: string;
  verified: boolean;

  // Activity
  lastTradeAt?: string;
  recentActivity: RecentActivity[];
}

export interface DashboardResponse {
  message: string;
  dashboard: UserDashboardStats;
}

export interface TradingSummary {
  asBuyer: {
    totalTrades: number;
    completed: number;
    totalVolume: number;
  };
  asSeller: {
    totalTrades: number;
    completed: number;
    totalVolume: number;
  };
  overall: {
    totalTrades: number;
    completed: number;
    totalVolume: number;
  };
}

export interface TradingSummaryResponse {
  message: string;
  summary: TradingSummary;
}

// Dashboard stat card for UI display
export interface DashboardStatCard {
  id: string;
  icon: string;
  value: string | number;
  label: string;
  subtitle?: string;
  gradientColors: readonly [string, string];
}
