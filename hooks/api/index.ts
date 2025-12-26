/**
 * API Hooks - Barrel Export
 * Central export for all React Query API hooks
 */

// Offers
export {
  useOffers,
  useBuyOffers,
  useSellOffers,
  useOffer,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  usePauseOffer,
  useResumeOffer,
  offerKeys,
} from './useOffers';

// Trades
export {
  useTrades,
  useActiveTrades,
  useCompletedTrades,
  useTrade,
  useTradeMessages,
  useCreateTrade,
  useUpdateTradeStatus,
  useSendMessage,
  tradeKeys,
} from './useTrades';

// Wallet
export {
  useWallet,
  useBalance,
  useTransactions,
  useDeposit,
  useWithdraw,
  walletKeys,
} from './useWallet';

// Affiliate
export {
  useAffiliateStats,
  useReferrals,
  useEarnings,
  useTiers,
  usePayouts,
  useGenerateLink,
  useRequestPayout,
  affiliateKeys,
} from './useAffiliate';

// Profile
export {
  useProfile,
  useSettings,
  useRatings,
  useTopTraders,
  useUpdateProfile,
  useUpdateSettings,
  useRateUser,
  profileKeys,
} from './useProfile';

// KYC
export {
  useKYCStatus,
  useKYCDocuments,
  useSubmitKYC,
  useUploadKYCDocument,
  kycKeys,
} from './useKYC';

// Payment Methods
export {
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  paymentMethodKeys,
} from './usePaymentMethods';

// Prices
export {
  usePrices,
  usePriceTickers,
  useSinglePrice,
  useConvertToUSD,
  useConvertFromUSD,
  useRefreshPrices,
  pricesKeys,
} from './usePrices';

// Dashboard
export {
  useDashboard,
  useTradingSummary,
  useDashboardStats,
  useRecentActivity,
  useUserPerformance,
  useRefreshDashboard,
  dashboardKeys,
} from './useDashboard';
