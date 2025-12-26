# QIC TRADER MOBILE APP - IMPLEMENTATION CHECKLIST

A super detailed checklist for implementing the Qic Trader Mobile App.

---

## PHASE 1: PROJECT SETUP

### 1.1 Initialize Project
- [ ] Clone template: `git clone https://github.com/Sonnysam/starter-template-expo.git qic-trader-mobile`
- [ ] Navigate to project: `cd qic-trader-mobile`
- [ ] Remove existing git: `rm -rf .git`
- [ ] Initialize fresh git: `git init`
- [ ] Install dependencies: `npm install`
- [ ] Test app runs: `npx expo start`
- [ ] Create initial commit

### 1.2 Install Additional Dependencies

#### State Management
- [ ] `npm install @reduxjs/toolkit react-redux`
- [ ] `npm install redux-persist`
- [ ] `npm install @tanstack/react-query`

#### API & Networking
- [ ] `npm install axios`
- [ ] `npm install socket.io-client`

#### Secure Storage
- [ ] `npx expo install expo-secure-store`

#### Media & Files
- [ ] `npx expo install expo-image-picker`
- [ ] `npx expo install expo-document-picker`
- [ ] `npx expo install expo-camera`
- [ ] `npx expo install expo-file-system`

#### UI Utilities
- [ ] `npx expo install expo-clipboard`
- [ ] `npx expo install expo-haptics`
- [ ] `npm install react-native-qrcode-svg react-native-svg`
- [ ] `npm install react-native-chart-kit`

#### Forms & Validation
- [ ] `npm install react-hook-form`
- [ ] `npm install zod @hookform/resolvers`

#### Date & Utils
- [ ] `npm install date-fns`
- [ ] `npm install lodash`

#### Web3 (Optional - Phase 2)
- [ ] `npm install @wagmi/core viem`
- [ ] `npm install @walletconnect/modal`

### 1.3 Configure TypeScript
- [ ] Update `tsconfig.json` with strict mode
- [ ] Add path aliases (@/ for src)
- [ ] Configure absolute imports

### 1.4 Configure ESLint & Prettier
- [ ] Add ESLint rules for React Native
- [ ] Configure Prettier for Tailwind class sorting
- [ ] Add pre-commit hooks with husky (optional)

### 1.5 Setup Environment Variables
- [ ] Create `.env` file
- [ ] Add `EXPO_PUBLIC_API_BASE_URL`
- [ ] Add `EXPO_PUBLIC_SOCKET_URL`
- [ ] Add Firebase config variables
- [ ] Create `.env.example` for reference
- [ ] Add `.env` to `.gitignore`

### 1.6 Configure Firebase
- [ ] Create Firebase project (or use existing)
- [ ] Enable Authentication in Firebase Console
- [ ] Enable Email/Password auth
- [ ] Enable Google OAuth
- [ ] Enable Apple Sign In
- [ ] Add iOS app to Firebase
- [ ] Add Android app to Firebase
- [ ] Download `google-services.json` (Android)
- [ ] Download `GoogleService-Info.plist` (iOS)
- [ ] Create `config/firebase.ts`
- [ ] Initialize Firebase app
- [ ] Export auth instance
- [ ] Export firestore instance (if needed)
- [ ] Test Firebase connection

---

## PHASE 2: PROJECT STRUCTURE

### 2.1 Create Directory Structure
- [ ] Create `/src` directory
- [ ] Create `/src/app` (Expo Router pages)
- [ ] Create `/src/components`
- [ ] Create `/src/components/ui`
- [ ] Create `/src/components/forms`
- [ ] Create `/src/components/features`
- [ ] Create `/src/components/common`
- [ ] Create `/src/hooks`
- [ ] Create `/src/hooks/auth`
- [ ] Create `/src/hooks/api`
- [ ] Create `/src/hooks/common`
- [ ] Create `/src/services`
- [ ] Create `/src/services/api`
- [ ] Create `/src/services/socket`
- [ ] Create `/src/store`
- [ ] Create `/src/store/slices`
- [ ] Create `/src/types`
- [ ] Create `/src/utils`
- [ ] Create `/src/config`
- [ ] Create `/src/lib`
- [ ] Create `/src/assets`
- [ ] Create `/src/assets/images`
- [ ] Create `/src/assets/icons`

### 2.2 Configure Path Aliases
- [ ] Update `tsconfig.json` paths
- [ ] Update `babel.config.js` with module-resolver
- [ ] Test imports work correctly

---

## PHASE 3: CORE INFRASTRUCTURE

### 3.1 Types & Interfaces
- [ ] Create `types/auth.types.ts`
  - [ ] User interface
  - [ ] AuthState interface
  - [ ] LoginPayload interface
  - [ ] SignupPayload interface
  - [ ] BackendToken interface
- [ ] Create `types/offer.types.ts`
  - [ ] Offer interface
  - [ ] OfferType enum
  - [ ] OfferStatus enum
  - [ ] CreateOfferPayload
  - [ ] UpdateOfferPayload
- [ ] Create `types/trade.types.ts`
  - [ ] Trade interface
  - [ ] TradeStatus enum
  - [ ] CreateTradePayload
  - [ ] TradeMessage interface
- [ ] Create `types/wallet.types.ts`
  - [ ] WalletBalances interface
  - [ ] WalletTransaction interface
  - [ ] TransactionType enum
  - [ ] DepositPayload
  - [ ] WithdrawPayload
- [ ] Create `types/escrow.types.ts`
  - [ ] Escrow interface
  - [ ] EscrowStatus enum
- [ ] Create `types/affiliate.types.ts`
  - [ ] AffiliateStats interface
  - [ ] Referral interface
  - [ ] AffiliateEarning interface
  - [ ] AffiliatePayout interface
  - [ ] AffiliateTier interface
- [ ] Create `types/reseller.types.ts`
  - [ ] ResellOffer interface
  - [ ] ResellTrade interface
- [ ] Create `types/kyc.types.ts`
  - [ ] KYCDocument interface
  - [ ] KYCProfile interface
  - [ ] KYCStatus enum
- [ ] Create `types/user.types.ts`
  - [ ] UserProfile interface
  - [ ] UserSettings interface
  - [ ] UserRating interface
- [ ] Create `types/payment-method.types.ts`
  - [ ] PaymentMethod interface
  - [ ] PaymentMethodType enum
- [ ] Create `types/api.types.ts`
  - [ ] ApiResponse<T> interface
  - [ ] PaginatedResponse<T> interface
  - [ ] ApiError interface
- [ ] Create `types/index.ts` (barrel export)

### 3.2 Utils & Helpers
- [ ] Create `utils/logger.ts`
  - [ ] log function
  - [ ] error function
  - [ ] warn function
  - [ ] debug function (dev only)
- [ ] Create `utils/validation.ts`
  - [ ] isValidEmail function
  - [ ] isValidPassword function
  - [ ] isValidWalletAddress function
  - [ ] isValidAmount function
- [ ] Create `utils/formatters.ts`
  - [ ] formatCurrency function
  - [ ] formatCrypto function
  - [ ] formatDate function
  - [ ] formatTime function
  - [ ] formatRelativeTime function
  - [ ] truncateAddress function
- [ ] Create `utils/crypto-utils.ts`
  - [ ] getCryptoIcon function
  - [ ] getCryptoColor function
  - [ ] getCryptoNetworks function
- [ ] Create `utils/constants.ts`
  - [ ] CRYPTOCURRENCIES array
  - [ ] FIAT_CURRENCIES array
  - [ ] PAYMENT_METHOD_TYPES array
  - [ ] TRADE_STATUS_LABELS object
  - [ ] ESCROW_STATUS_LABELS object

### 3.3 Config Files
- [ ] Create `config/api.config.ts`
  - [ ] API_BASE_URL
  - [ ] SOCKET_URL
  - [ ] TIMEOUT constant
- [ ] Create `config/crypto.config.ts`
  - [ ] Supported cryptocurrencies
  - [ ] Network configurations
  - [ ] Token addresses
- [ ] Create `config/theme.ts`
  - [ ] Colors object
  - [ ] Spacing object
  - [ ] Typography object
  - [ ] BorderRadius object
- [ ] Create `config/env.ts`
  - [ ] Environment variable loader
  - [ ] Validation for required vars

### 3.4 HTTP Client
- [ ] Create `services/api/http-client.ts`
  - [ ] Create axios instance
  - [ ] Add baseURL config
  - [ ] Add timeout config
  - [ ] Add request interceptor (auth token)
  - [ ] Add response interceptor (error handling)
  - [ ] Handle 401 (redirect to login)
  - [ ] Handle 429 (rate limit)
  - [ ] Handle network errors
  - [ ] Add request logging (dev)
  - [ ] Export get, post, put, patch, delete methods

### 3.5 Token Manager
- [ ] Create `services/api/token-manager.ts`
  - [ ] Store token in expo-secure-store
  - [ ] getToken function
  - [ ] setToken function
  - [ ] removeToken function
  - [ ] isTokenValid function
  - [ ] isTokenExpiring function (5min buffer)
  - [ ] Token refresh trigger

### 3.6 Socket Client
- [ ] Create `services/socket/socket-client.ts`
  - [ ] Initialize Socket.io client
  - [ ] Connect function
  - [ ] Disconnect function
  - [ ] Reconnection logic
  - [ ] Event subscription helpers
  - [ ] Event emit helpers
  - [ ] Connection state tracking

---

## PHASE 4: REDUX STORE

### 4.1 Store Setup
- [ ] Create `store/index.ts`
  - [ ] Configure store with RTK
  - [ ] Add middleware (thunk)
  - [ ] Add redux-persist
  - [ ] Export store
  - [ ] Export RootState type
  - [ ] Export AppDispatch type

### 4.2 Auth Slice
- [ ] Create `store/slices/authSlice.ts`
  - [ ] Define AuthState interface
  - [ ] Create initial state
  - [ ] Create setUser action
  - [ ] Create setLoading action
  - [ ] Create setError action
  - [ ] Create setBackendToken action
  - [ ] Create logout action
  - [ ] Create clearError action
  - [ ] Export selectors:
    - [ ] selectUser
    - [ ] selectIsAuthenticated
    - [ ] selectIsLoading
    - [ ] selectAuthError
    - [ ] selectBackendToken
  - [ ] Configure persist (user, isAuthenticated, backendToken)

### 4.3 UI Slice
- [ ] Create `store/slices/uiSlice.ts`
  - [ ] Define UIState interface
  - [ ] Create initial state
  - [ ] Create setTheme action
  - [ ] Create addToast action
  - [ ] Create removeToast action
  - [ ] Create setOnlineStatus action
  - [ ] Export selectors:
    - [ ] selectTheme
    - [ ] selectToasts
    - [ ] selectIsOnline
  - [ ] Configure persist (theme)

### 4.4 Offer Slice
- [ ] Create `store/slices/offerSlice.ts`
  - [ ] Define OfferState interface
  - [ ] Create initial state
  - [ ] Create setCurrentOffer action
  - [ ] Create setDraftOffer action
  - [ ] Create updateDraftOffer action
  - [ ] Create clearDraftOffer action
  - [ ] Create setEscrowFlow action
  - [ ] Export selectors
  - [ ] Configure persist (draftOffer)

### 4.5 Wallet Slice
- [ ] Create `store/slices/walletSlice.ts`
  - [ ] Define WalletState interface
  - [ ] Create initial state
  - [ ] Create setBalances action
  - [ ] Create setSelectedNetwork action
  - [ ] Export selectors

### 4.6 Root Reducer
- [ ] Create `store/rootReducer.ts`
  - [ ] Combine all slices
  - [ ] Configure persist whitelist

### 4.7 Persist Config
- [ ] Create `store/persist/persistConfig.ts`
  - [ ] Configure async-storage
  - [ ] Set storage key
  - [ ] Configure whitelist

### 4.8 Store Provider
- [ ] Create `components/providers/StoreProvider.tsx`
  - [ ] Wrap with Provider
  - [ ] Wrap with PersistGate

---

## PHASE 5: API SERVICES

### 5.1 Auth API
- [ ] Create `services/api/auth-api.ts`
  - [ ] signup(email, password, username)
  - [ ] login(email, password)
  - [ ] refreshToken()
  - [ ] deleteUser()
  - [ ] socialLoginSync(provider, idToken)
  - [ ] Add console logs for each method
  - [ ] Add error handling

### 5.2 Offers API
- [ ] Create `services/api/offers-api.ts`
  - [ ] createOffer(payload)
  - [ ] getOffers(params)
  - [ ] getBuyOffers(params)
  - [ ] getSellOffers(params)
  - [ ] getOffer(offerId)
  - [ ] updateOffer(offerId, payload)
  - [ ] deleteOffer(offerId)
  - [ ] pauseOffer(offerId)
  - [ ] resumeOffer(offerId)
  - [ ] Add console logs
  - [ ] Add error handling

### 5.3 Trades API
- [ ] Create `services/api/trades-api.ts`
  - [ ] createTrade(offerId, amount)
  - [ ] getTrades(params)
  - [ ] getActiveTrades()
  - [ ] getCompletedTrades()
  - [ ] getTrade(tradeId)
  - [ ] updateTradeStatus(tradeId, status)
  - [ ] sendMessage(tradeId, content)
  - [ ] getMessages(tradeId)
  - [ ] Add console logs
  - [ ] Add error handling

### 5.4 Wallet API
- [ ] Create `services/api/wallet-api.ts`
  - [ ] getWallet()
  - [ ] getBalance()
  - [ ] getTransactions(params)
  - [ ] deposit(amount, currency)
  - [ ] withdraw(amount, currency, address)
  - [ ] Add console logs
  - [ ] Add error handling

### 5.5 Escrow API
- [ ] Create `services/api/escrow-api.ts`
  - [ ] createEscrow(amount, currency)
  - [ ] getEscrow(escrowId)
  - [ ] getEscrows(params)
  - [ ] linkEscrow(onChainId, txHash)
  - [ ] disputeEscrow(escrowId, reason)
  - [ ] getEscrowStats()
  - [ ] Add console logs
  - [ ] Add error handling

### 5.6 Affiliate API
- [ ] Create `services/api/affiliate-api.ts`
  - [ ] getStats()
  - [ ] getReferrals(params)
  - [ ] getEarnings(params)
  - [ ] getTiers()
  - [ ] getPayouts(params)
  - [ ] generateLink(campaign?)
  - [ ] requestPayout(amount, method)
  - [ ] Add console logs
  - [ ] Add error handling

### 5.7 Reseller API
- [ ] Create `services/api/reseller-api.ts`
  - [ ] getStats()
  - [ ] getActiveResells(params)
  - [ ] getTrades(params)
  - [ ] createResell(offerId, markup)
  - [ ] Add console logs
  - [ ] Add error handling

### 5.8 Users API
- [ ] Create `services/api/users-api.ts`
  - [ ] getProfile(userId?)
  - [ ] updateProfile(payload)
  - [ ] getSettings()
  - [ ] updateSettings(payload)
  - [ ] getRatings(userId)
  - [ ] rateUser(userId, rating, comment)
  - [ ] getTopTraders(params)
  - [ ] Add console logs
  - [ ] Add error handling

### 5.9 KYC API
- [ ] Create `services/api/kyc-api.ts`
  - [ ] getStatus()
  - [ ] uploadDocument(type, file)
  - [ ] submitKYC()
  - [ ] getDocuments()
  - [ ] Add console logs
  - [ ] Add error handling

### 5.10 Payment Methods API
- [ ] Create `services/api/payment-methods-api.ts`
  - [ ] getPaymentMethods()
  - [ ] createPaymentMethod(type, details)
  - [ ] updatePaymentMethod(id, details)
  - [ ] deletePaymentMethod(id)
  - [ ] Add console logs
  - [ ] Add error handling

### 5.11 Prices API
- [ ] Create `services/api/prices-api.ts`
  - [ ] getPrices()
  - [ ] (Real-time via socket)
  - [ ] Add console logs

### 5.12 System API
- [ ] Create `services/api/system-api.ts`
  - [ ] getSystemStatus()
  - [ ] contact(name, email, message)
  - [ ] getPrivacyPolicy()
  - [ ] getTermsOfService()
  - [ ] Add console logs
  - [ ] Add error handling

### 5.13 API Index
- [ ] Create `services/api/index.ts`
  - [ ] Export all API services

---

## PHASE 6: HOOKS

### 6.1 Auth Hooks
- [ ] Create `hooks/auth/useAuth.ts`
  - [ ] Get auth state from Redux
  - [ ] Login function
  - [ ] Signup function
  - [ ] Logout function
  - [ ] Return user, isAuthenticated, isLoading, error
- [ ] Create `hooks/auth/useAuthState.ts`
  - [ ] Firebase onAuthStateChanged listener
  - [ ] Sync with Redux
  - [ ] Auto-refresh tokens
### 6.2 API Hooks (React Query)
- [ ] Create `hooks/api/useOffers.ts`
  - [ ] useOffers(params)
  - [ ] useBuyOffers(params)
  - [ ] useSellOffers(params)
  - [ ] useOffer(offerId)
  - [ ] useCreateOffer()
  - [ ] useUpdateOffer()
  - [ ] useDeleteOffer()
- [ ] Create `hooks/api/useTrades.ts`
  - [ ] useTrades(params)
  - [ ] useActiveTrades()
  - [ ] useCompletedTrades()
  - [ ] useTrade(tradeId)
  - [ ] useCreateTrade()
  - [ ] useUpdateTradeStatus()
- [ ] Create `hooks/api/useWallet.ts`
  - [ ] useWallet()
  - [ ] useBalance()
  - [ ] useTransactions(params)
  - [ ] useDeposit()
  - [ ] useWithdraw()
- [ ] Create `hooks/api/useAffiliate.ts`
  - [ ] useAffiliateStats()
  - [ ] useReferrals(params)
  - [ ] useEarnings(params)
  - [ ] useTiers()
  - [ ] usePayouts(params)
  - [ ] useRequestPayout()
- [ ] Create `hooks/api/useKYC.ts`
  - [ ] useKYCStatus()
  - [ ] useKYCDocuments()
  - [ ] useUploadDocument()
  - [ ] useSubmitKYC()
- [ ] Create `hooks/api/useProfile.ts`
  - [ ] useProfile(userId?)
  - [ ] useUpdateProfile()
  - [ ] useSettings()
  - [ ] useUpdateSettings()
  - [ ] useRatings(userId)
- [ ] Create `hooks/api/usePaymentMethods.ts`
  - [ ] usePaymentMethods()
  - [ ] useCreatePaymentMethod()
  - [ ] useUpdatePaymentMethod()
  - [ ] useDeletePaymentMethod()

### 6.3 Common Hooks
- [ ] Create `hooks/common/useSocket.ts`
  - [ ] Connection management
  - [ ] Event subscription
- [ ] Create `hooks/common/useTheme.ts`
  - [ ] Get theme from Redux
  - [ ] Toggle theme
  - [ ] System theme detection
- [ ] Create `hooks/common/useCopyToClipboard.ts`
  - [ ] Copy function
  - [ ] Copied state
  - [ ] Haptic feedback
- [ ] Create `hooks/common/useRefreshByUser.ts`
  - [ ] Pull-to-refresh state
  - [ ] Refresh function

---

## PHASE 7: UI COMPONENTS

### 7.1 Base Components
- [ ] Create `components/ui/Button.tsx`
  - [ ] Primary variant
  - [ ] Secondary variant
  - [ ] Outline variant
  - [ ] Ghost variant
  - [ ] Destructive variant
  - [ ] Loading state
  - [ ] Disabled state
  - [ ] Size variants (sm, md, lg)
  - [ ] Icon support
  - [ ] Haptic feedback
- [ ] Create `components/ui/Input.tsx`
  - [ ] Text input
  - [ ] Error state
  - [ ] Disabled state
  - [ ] Left/right icons
  - [ ] Label support
  - [ ] Helper text
- [ ] Create `components/ui/Card.tsx`
  - [ ] Padding variants
  - [ ] Border option
  - [ ] Shadow option
  - [ ] Press effect option
- [ ] Create `components/ui/Modal.tsx`
  - [ ] Bottom sheet style
  - [ ] Centered style
  - [ ] Close on backdrop tap
  - [ ] Animation
- [ ] Create `components/ui/Badge.tsx`
  - [ ] Color variants
  - [ ] Size variants
  - [ ] Dot indicator
- [ ] Create `components/ui/Avatar.tsx`
  - [ ] Image source
  - [ ] Initials fallback
  - [ ] Size variants
  - [ ] Online indicator
- [ ] Create `components/ui/Skeleton.tsx`
  - [ ] Text skeleton
  - [ ] Circle skeleton
  - [ ] Rectangle skeleton
  - [ ] Pulse animation
- [ ] Create `components/ui/Toast.tsx`
  - [ ] Success variant
  - [ ] Error variant
  - [ ] Warning variant
  - [ ] Info variant
  - [ ] Auto-dismiss
  - [ ] Action button
- [ ] Create `components/ui/Tabs.tsx`
  - [ ] Tab list
  - [ ] Tab item
  - [ ] Active state
  - [ ] Badge on tab
- [ ] Create `components/ui/Select.tsx`
  - [ ] Dropdown options
  - [ ] Search filter
  - [ ] Multi-select option
- [ ] Create `components/ui/Switch.tsx`
  - [ ] On/off states
  - [ ] Label
  - [ ] Disabled state
- [ ] Create `components/ui/Slider.tsx`
  - [ ] Value display
  - [ ] Min/max labels
  - [ ] Step increments
- [ ] Create `components/ui/Divider.tsx`
  - [ ] Horizontal/vertical
  - [ ] Text divider
- [ ] Create `components/ui/index.ts`
  - [ ] Export all components

### 7.2 Form Components
- [ ] Create `components/forms/FormField.tsx`
  - [ ] Label
  - [ ] Input wrapper
  - [ ] Error message
  - [ ] Required indicator
- [ ] Create `components/forms/PasswordInput.tsx`
  - [ ] Show/hide toggle
  - [ ] Strength indicator (optional)
- [ ] Create `components/forms/CurrencySelect.tsx`
  - [ ] Crypto selection
  - [ ] Fiat selection
  - [ ] Icon display
- [ ] Create `components/forms/PaymentMethodSelect.tsx`
  - [ ] Multi-select
  - [ ] Category grouping
  - [ ] Selected chips
- [ ] Create `components/forms/AmountInput.tsx`
  - [ ] Currency prefix/suffix
  - [ ] Numeric keyboard
  - [ ] Max button
- [ ] Create `components/forms/index.ts`
  - [ ] Export all components

### 7.3 Common Components
- [ ] Create `components/common/Header.tsx`
  - [ ] Back button
  - [ ] Title
  - [ ] Right actions
  - [ ] Safe area insets
- [ ] Create `components/common/TabBar.tsx`
  - [ ] Custom tab bar
  - [ ] Icons
  - [ ] Labels
  - [ ] Active indicator
- [ ] Create `components/common/EmptyState.tsx`
  - [ ] Icon
  - [ ] Title
  - [ ] Description
  - [ ] Action button
- [ ] Create `components/common/ErrorBoundary.tsx`
  - [ ] Catch errors
  - [ ] Fallback UI
  - [ ] Retry button
- [ ] Create `components/common/LoadingScreen.tsx`
  - [ ] Full screen loader
  - [ ] Logo animation
- [ ] Create `components/common/OfflineBanner.tsx`
  - [ ] Network status
  - [ ] Retry connection
- [ ] Create `components/common/RefreshControl.tsx`
  - [ ] Custom refresh indicator
- [ ] Create `components/common/index.ts`
  - [ ] Export all components

---

## PHASE 8: NAVIGATION SETUP

### 8.1 Root Layout
- [ ] Create `app/_layout.tsx`
  - [ ] Wrap with providers (Store, Query, Theme)
  - [ ] Setup navigation container
  - [ ] Handle deep links
  - [ ] Splash screen handling
  - [ ] Font loading

### 8.2 Auth Layout
- [ ] Create `app/(auth)/_layout.tsx`
  - [ ] Stack navigator
  - [ ] Auth theme/styling
  - [ ] Redirect if authenticated

### 8.3 Auth Screens
- [ ] Create `app/(auth)/login.tsx`
- [ ] Create `app/(auth)/signup.tsx`
- [ ] Create `app/(auth)/forgot-password.tsx`

### 8.4 Main Tab Layout
- [ ] Create `app/(tabs)/_layout.tsx`
  - [ ] Bottom tab navigator
  - [ ] Tab icons
  - [ ] Tab labels
  - [ ] Active/inactive colors
  - [ ] Badge counts

### 8.5 Tab Screens
- [ ] Create `app/(tabs)/index.tsx` (Dashboard)
- [ ] Create `app/(tabs)/marketplace.tsx`
- [ ] Create `app/(tabs)/wallet.tsx`
- [ ] Create `app/(tabs)/trades.tsx`
- [ ] Create `app/(tabs)/profile.tsx`

### 8.6 Stack Screens Layout
- [ ] Create `app/(screens)/_layout.tsx`
  - [ ] Stack navigator
  - [ ] Header configuration
  - [ ] Transition animations

### 8.7 Offer Screens
- [ ] Create `app/(screens)/offer/[id].tsx`
- [ ] Create `app/(screens)/offer/create.tsx`
- [ ] Create `app/(screens)/offer/resell.tsx`

### 8.8 Trade Screens
- [ ] Create `app/(screens)/trade/[id].tsx`
- [ ] Create `app/(screens)/trade/chat.tsx`

### 8.9 Affiliate Screens
- [ ] Create `app/(screens)/affiliate/index.tsx`
- [ ] Create `app/(screens)/affiliate/referrals.tsx`
- [ ] Create `app/(screens)/affiliate/payouts.tsx`

### 8.10 KYC Screens
- [ ] Create `app/(screens)/kyc/index.tsx`
- [ ] Create `app/(screens)/kyc/documents.tsx`

### 8.11 Settings Screens
- [ ] Create `app/(screens)/settings/index.tsx`
- [ ] Create `app/(screens)/settings/payment-methods.tsx`
- [ ] Create `app/(screens)/settings/security.tsx`

---

## PHASE 9: FEATURE COMPONENTS

### 9.1 Marketplace Components
- [ ] Create `components/features/marketplace/OfferCard.tsx`
- [ ] Create `components/features/marketplace/OfferList.tsx`
- [ ] Create `components/features/marketplace/OfferFilter.tsx`
- [ ] Create `components/features/marketplace/CryptoPrice.tsx`
- [ ] Create `components/features/marketplace/SellerInfo.tsx`

### 9.2 Trade Components
- [ ] Create `components/features/trade/TradeStatusTimeline.tsx`
- [ ] Create `components/features/trade/TradeDetails.tsx`
- [ ] Create `components/features/trade/TradeActions.tsx`
- [ ] Create `components/features/trade/TradeChat.tsx`
- [ ] Create `components/features/trade/MessageBubble.tsx`
- [ ] Create `components/features/trade/EscrowStatus.tsx`

### 9.3 Wallet Components
- [ ] Create `components/features/wallet/BalanceCard.tsx`
- [ ] Create `components/features/wallet/PortfolioChart.tsx`
- [ ] Create `components/features/wallet/TransactionItem.tsx`
- [ ] Create `components/features/wallet/TransactionList.tsx`
- [ ] Create `components/features/wallet/DepositAddress.tsx`
- [ ] Create `components/features/wallet/WithdrawForm.tsx`
- [ ] Create `components/features/wallet/NetworkSelector.tsx`

### 9.4 Affiliate Components
- [ ] Create `components/features/affiliate/StatsCards.tsx`
- [ ] Create `components/features/affiliate/ReferralLink.tsx`
- [ ] Create `components/features/affiliate/ReferralQRCode.tsx`
- [ ] Create `components/features/affiliate/ReferralsList.tsx`
- [ ] Create `components/features/affiliate/EarningsChart.tsx`
- [ ] Create `components/features/affiliate/TierProgress.tsx`
- [ ] Create `components/features/affiliate/PayoutForm.tsx`
- [ ] Create `components/features/affiliate/PayoutHistory.tsx`

### 9.5 KYC Components
- [ ] Create `components/features/kyc/KYCSteps.tsx`
- [ ] Create `components/features/kyc/DocumentUploader.tsx`
- [ ] Create `components/features/kyc/DocumentPreview.tsx`
- [ ] Create `components/features/kyc/VerificationStatus.tsx`
- [ ] Create `components/features/kyc/SelfieCapture.tsx`

### 9.6 Profile Components
- [ ] Create `components/features/profile/ProfileHeader.tsx`
- [ ] Create `components/features/profile/StatsRow.tsx`
- [ ] Create `components/features/profile/RatingDisplay.tsx`
- [ ] Create `components/features/profile/VerifiedBadge.tsx`
- [ ] Create `components/features/profile/EditProfileForm.tsx`

### 9.7 Offer Components
- [ ] Create `components/features/offer/OfferForm.tsx`
- [ ] Create `components/features/offer/OfferTypeSelector.tsx`
- [ ] Create `components/features/offer/PriceInput.tsx`
- [ ] Create `components/features/offer/LimitsInput.tsx`
- [ ] Create `components/features/offer/ResellMarkupSlider.tsx`
- [ ] Create `components/features/offer/OfferPreview.tsx`

---

## PHASE 10: SCREEN IMPLEMENTATIONS

### 10.1 Auth Screens
- [ ] Implement Login screen
  - [ ] Email input
  - [ ] Password input
  - [ ] Login button
  - [ ] Forgot password link
  - [ ] Sign up link
  - [ ] Social login buttons
  - [ ] Form validation
  - [ ] Error handling
  - [ ] Loading state
- [ ] Implement Signup screen
  - [ ] Username input
  - [ ] Email input
  - [ ] Password input
  - [ ] Confirm password input
  - [ ] Terms acceptance
  - [ ] Sign up button
  - [ ] Login link
  - [ ] Form validation
  - [ ] Error handling
  - [ ] Loading state
- [ ] Implement Forgot Password screen
  - [ ] Email input
  - [ ] Submit button
  - [ ] Success message
  - [ ] Back to login link

### 10.2 Dashboard Screen
- [ ] Implement Dashboard
  - [ ] Welcome header
  - [ ] Balance summary card
  - [ ] Active trades count
  - [ ] Quick actions (Buy/Sell/Deposit)
  - [ ] Recent activity list
  - [ ] Affiliate earnings summary

### 10.3 Marketplace Screen
- [ ] Implement Marketplace
  - [ ] Tab selector (Buy/Sell)
  - [ ] Filter button
  - [ ] Offer list with FlatList
  - [ ] Pull-to-refresh
  - [ ] Infinite scroll
  - [ ] Empty state
  - [ ] Loading skeleton

### 10.4 Wallet Screen
- [ ] Implement Wallet
  - [ ] Total balance header
  - [ ] Portfolio chart
  - [ ] Crypto balance cards
  - [ ] Quick actions (Deposit/Withdraw)
  - [ ] Transaction history list
  - [ ] Pull-to-refresh

### 10.5 Trades Screen
- [ ] Implement Trades
  - [ ] Tab selector (Active/Completed/Disputed)
  - [ ] Trade list
  - [ ] Trade card with status
  - [ ] Empty state
  - [ ] Pull-to-refresh

### 10.6 Profile Screen
- [ ] Implement Profile
  - [ ] Profile header
  - [ ] Stats display
  - [ ] Ratings section
  - [ ] Settings link
  - [ ] KYC status
  - [ ] Logout button

### 10.7 Offer Detail Screen
- [ ] Implement Offer Detail
  - [ ] Offer info card
  - [ ] Seller profile
  - [ ] Amount input
  - [ ] Payment method selection
  - [ ] Start trade button
  - [ ] Share button

### 10.8 Create Offer Screen
- [ ] Implement Create Offer
  - [ ] Multi-step form
  - [ ] Offer type selection
  - [ ] Crypto/fiat selection
  - [ ] Price configuration
  - [ ] Limits input
  - [ ] Payment methods
  - [ ] Description
  - [ ] Preview
  - [ ] Submit

### 10.9 Active Trade Screen
- [ ] Implement Active Trade
  - [ ] Status timeline
  - [ ] Trade details
  - [ ] Escrow status
  - [ ] Action buttons
  - [ ] Chat button
  - [ ] Dispute button

### 10.10 Trade Chat Screen
- [ ] Implement Trade Chat
  - [ ] Message list
  - [ ] Message input
  - [ ] Send button
  - [ ] Image picker
  - [ ] Real-time updates

### 10.11 Affiliate Dashboard Screen
- [ ] Implement Affiliate Dashboard
  - [ ] Stats cards
  - [ ] Referral link with QR
  - [ ] Share button
  - [ ] Tier progress
  - [ ] View referrals link
  - [ ] View earnings link

### 10.12 KYC Wizard Screen
- [ ] Implement KYC Wizard
  - [ ] Step indicator
  - [ ] Personal info form
  - [ ] Document upload
  - [ ] Selfie capture
  - [ ] Submit for review

### 10.13 Settings Screen
- [ ] Implement Settings
  - [ ] Account section
  - [ ] Payment methods section
  - [ ] Trading preferences section
  - [ ] Privacy section
  - [ ] Security section
  - [ ] Theme toggle
  - [ ] About section
  - [ ] Logout

---

## PHASE 11: REAL-TIME FEATURES

### 11.1 Socket Setup
- [ ] Connect socket on app launch
- [ ] Authenticate socket connection
- [ ] Handle reconnection

### 11.2 Real-time Offers
- [ ] Subscribe to new offers
- [ ] Subscribe to offer updates
- [ ] Update UI on events

### 11.3 Real-time Trades
- [ ] Subscribe to trade status changes
- [ ] Update trade screen on events

### 11.4 Real-time Chat
- [ ] Subscribe to trade messages
- [ ] Real-time message updates
- [ ] Typing indicator

### 11.5 Real-time Prices
- [ ] Subscribe to price updates
- [ ] Update balance displays

---

## PHASE 12: POLISH & TESTING

### 12.1 Error Handling
- [ ] Implement global error boundary
- [ ] Add error logging
- [ ] User-friendly error messages
- [ ] Retry mechanisms

### 12.2 Loading States
- [ ] Add skeleton screens to all lists
- [ ] Add loading spinners to actions
- [ ] Disable buttons during loading

### 12.3 Offline Support
- [ ] Add offline detection
- [ ] Show offline banner
- [ ] Cache critical data
- [ ] Queue actions for reconnection

### 12.4 Performance
- [ ] Memoize expensive components
- [ ] Optimize FlatList rendering
- [ ] Image caching
- [ ] Bundle size analysis

### 12.5 Accessibility
- [ ] Add accessibility labels
- [ ] Test with VoiceOver/TalkBack
- [ ] Ensure touch targets ≥44px
- [ ] Test color contrast

### 12.6 Testing
- [ ] Unit tests for utils
- [ ] Unit tests for hooks
- [ ] Component snapshot tests
- [ ] API mock tests

---

## PHASE 13: BUILD & DEPLOY

### 13.1 App Configuration
- [ ] Update app.json with app name
- [ ] Update bundle identifier
- [ ] Add app icons
- [ ] Add splash screen
- [ ] Configure EAS build

### 13.2 iOS Build
- [ ] Create Apple Developer account
- [ ] Create App Store Connect app
- [ ] Configure iOS permissions
- [ ] Build with EAS
- [ ] Submit to TestFlight

### 13.3 Android Build
- [ ] Create Google Play Console app
- [ ] Configure Android permissions
- [ ] Generate keystore
- [ ] Build with EAS
- [ ] Submit to Play Store

---

## NOTES

### Console Logging Pattern
```typescript
// Example console log pattern for all services
console.log('[ServiceName] methodName: Starting...');
console.log('[ServiceName] methodName: Params:', params);
console.log('[ServiceName] methodName: Success:', response);
console.error('[ServiceName] methodName: Error:', error);
```

### Error Handling Pattern
```typescript
// Example error handling pattern
try {
  // API call
} catch (error) {
  console.error('[ServiceName] methodName: Error:', error);
  if (axios.isAxiosError(error)) {
    // Handle API errors
  }
  throw error;
}
```

### File Size Guidelines
- Keep files under 300 lines
- Split large components into smaller parts
- Use barrel exports (index.ts)

---

*Checklist for Qic Trader Mobile App Implementation*
*Total items: 500+*
