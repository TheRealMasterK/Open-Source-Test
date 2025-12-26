/**
 * User Types
 */

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  country?: string;
  totalTrades: number;
  successRate: number;
  rating: number;
  ratingCount: number;
  avgResponseTime?: number;
  verified: boolean;
  verifiedAt?: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    tradeAlerts: boolean;
    marketing: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastActive: boolean;
    showTradingStats: boolean;
  };
  trading: {
    defaultCrypto: string;
    defaultFiat: string;
    autoConfirmTrades: boolean;
    tradeTimeout: number;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
}

export interface UserRating {
  id: string;
  raterId: string;
  raterName: string;
  raterPhotoURL?: string;
  ratedUserId: string;
  tradeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  country?: string;
  photoURL?: string;
}

export interface UpdateSettingsPayload {
  notifications?: Partial<UserSettings['notifications']>;
  privacy?: Partial<UserSettings['privacy']>;
  trading?: Partial<UserSettings['trading']>;
  security?: Partial<UserSettings['security']>;
}

export interface RateUserPayload {
  tradeId: string;
  rating: number;
  comment?: string;
}

export interface TopTrader {
  id: string;
  displayName: string;
  photoURL?: string;
  totalTrades: number;
  successRate: number;
  rating: number;
  verified: boolean;
  totalVolume: number;
}

export interface TopTradersParams {
  limit?: number;
  period?: 'week' | 'month' | 'all';
}
