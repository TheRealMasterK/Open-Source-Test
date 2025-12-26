# QIC TRADER MOBILE APP - REQUIREMENTS DOCUMENT

## Overview
This document outlines all requirements for building a React Native (Expo) mobile application that replicates the functionality of the QIC Trader Web App - a P2P cryptocurrency trading platform.

**Template Source:** [Sonnysam/starter-template-expo](https://github.com/Sonnysam/starter-template-expo)

**Excluded Features:** Push notifications (as requested)

---

## TABLE OF CONTENTS
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Feature Requirements](#feature-requirements)
4. [Implementation Checklist](#implementation-checklist)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [Design System](#design-system)

---

## TECH STACK

### Core Framework
| Package | Version | Purpose |
|---------|---------|---------|
| expo | ^54.0.0 | React Native framework |
| react | 19.1.0 | UI library |
| react-native | 0.81.4 | Mobile runtime |
| typescript | ~5.9.2 | Type safety |

### Navigation
| Package | Version | Purpose |
|---------|---------|---------|
| expo-router | ~6.0.5 | File-based routing |
| @react-navigation/native | ^7.0.3 | Navigation primitives |
| react-native-screens | ~4.16.0 | Native screen containers |
| react-native-gesture-handler | ~2.28.0 | Gesture support |

### State Management (ADD THESE)
| Package | Version | Purpose |
|---------|---------|---------|
| @reduxjs/toolkit | ^2.3.0 | Redux state management |
| react-redux | ^9.1.0 | React bindings for Redux |
| redux-persist | ^6.0.0 | State persistence |
| @tanstack/react-query | ^5.90.0 | Server state management |

### Backend & Auth
| Package | Version | Purpose |
|---------|---------|---------|
| firebase | ^12.2.1 | Authentication & Firestore |
| @react-native-async-storage/async-storage | 2.2.0 | Local storage |

### Styling
| Package | Version | Purpose |
|---------|---------|---------|
| nativewind | latest | Tailwind CSS for RN |
| tailwindcss | ^3.4.0 | Utility-first CSS |

### Additional Dependencies (TO ADD)
| Package | Purpose |
|---------|---------|
| axios | HTTP client |
| socket.io-client | Real-time WebSocket |
| expo-secure-store | Secure token storage |
| expo-image-picker | Document/image upload |
| expo-document-picker | KYC document upload |
| expo-camera | Selfie verification |
| expo-clipboard | Copy wallet addresses |
| expo-haptics | Tactile feedback |
| react-native-qrcode-svg | QR code generation |
| react-native-svg | SVG support |
| @wagmi/core | Web3 wallet (optional) |
| viem | Blockchain interactions |
| walletconnect/modal | WalletConnect v2 |
| react-native-chart-kit | Trading charts |
| date-fns | Date formatting |
| zod | Form validation |
| react-hook-form | Form management |

---

## PROJECT STRUCTURE

```
/src
├── /app                          # Expo Router pages
│   ├── (auth)/                   # Auth screens (login, signup, forgot)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Main tab navigator
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home/Dashboard
│   │   ├── marketplace.tsx       # Marketplace
│   │   ├── wallet.tsx            # Wallet
│   │   ├── trades.tsx            # Trade history
│   │   └── profile.tsx           # Profile & Settings
│   ├── (screens)/                # Stack screens
│   │   ├── offer/
│   │   │   ├── [id].tsx          # Offer details
│   │   │   ├── create.tsx        # Create offer
│   │   │   └── resell.tsx        # Resell offer
│   │   ├── trade/
│   │   │   ├── [id].tsx          # Active trade
│   │   │   └── chat.tsx          # Trade chat
│   │   ├── affiliate/
│   │   │   ├── index.tsx         # Affiliate dashboard
│   │   │   ├── referrals.tsx     # Referral list
│   │   │   └── payouts.tsx       # Payout history
│   │   ├── kyc/
│   │   │   ├── index.tsx         # KYC wizard
│   │   │   └── documents.tsx     # Document upload
│   │   └── settings/
│   │       ├── index.tsx
│   │       ├── payment-methods.tsx
│   │       └── security.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
│
├── /components                   # Reusable components
│   ├── /ui                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   ├── /forms                    # Form components
│   │   ├── FormField.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── CurrencySelect.tsx
│   │   ├── PaymentMethodSelect.tsx
│   │   └── index.ts
│   ├── /features                 # Feature components
│   │   ├── /marketplace
│   │   ├── /trade
│   │   ├── /wallet
│   │   ├── /affiliate
│   │   └── /kyc
│   └── /common                   # Common components
│       ├── Header.tsx
│       ├── TabBar.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       └── LoadingScreen.tsx
│
├── /hooks                        # Custom hooks
│   ├── /auth
│   │   ├── useAuth.ts
│   │   └── useAuthState.ts
│   ├── /api
│   │   ├── useOffers.ts
│   │   ├── useTrades.ts
│   │   ├── useWallet.ts
│   │   ├── useAffiliate.ts
│   │   └── useKYC.ts
│   └── /common
│       ├── useSocket.ts
│       ├── useTheme.ts
│       └── useCopyToClipboard.ts
│
├── /services                     # API services
│   ├── api/
│   │   ├── http-client.ts
│   │   ├── token-manager.ts
│   │   ├── auth-api.ts
│   │   ├── offers-api.ts
│   │   ├── trades-api.ts
│   │   ├── wallet-api.ts
│   │   ├── escrow-api.ts
│   │   ├── affiliate-api.ts
│   │   ├── reseller-api.ts
│   │   ├── kyc-api.ts
│   │   ├── users-api.ts
│   │   ├── payment-methods-api.ts
│   │   ├── prices-api.ts
│   │   └── system-api.ts
│   └── socket/
│       └── socket-client.ts
│
├── /store                        # Redux store
│   ├── index.ts
│   ├── rootReducer.ts
│   ├── /slices
│   │   ├── authSlice.ts
│   │   ├── uiSlice.ts
│   │   ├── offerSlice.ts
│   │   └── walletSlice.ts
│   └── /persist
│       └── persistConfig.ts
│
├── /types                        # TypeScript types
│   ├── auth.types.ts
│   ├── offer.types.ts
│   ├── trade.types.ts
│   ├── wallet.types.ts
│   ├── escrow.types.ts
│   ├── affiliate.types.ts
│   ├── reseller.types.ts
│   ├── kyc.types.ts
│   ├── user.types.ts
│   ├── payment-method.types.ts
│   └── index.ts
│
├── /utils                        # Utilities
│   ├── logger.ts
│   ├── validation.ts
│   ├── formatters.ts
│   ├── crypto-utils.ts
│   └── constants.ts
│
├── /config                       # Configuration
│   ├── firebase.ts
│   ├── api.config.ts
│   ├── crypto.config.ts
│   ├── theme.ts
│   └── env.ts
│
├── /lib                          # External integrations
│   ├── firebase.ts
│   └── web3/
│       ├── config.ts
│       └── escrow-contract.ts
│
└── /assets                       # Static assets
    ├── /images
    ├── /icons
    │   └── /crypto
    └── /fonts
```

---

## FEATURE REQUIREMENTS

### 1. AUTHENTICATION MODULE

#### 1.1 Email/Password Auth
- [ ] User registration with email, password, username
- [ ] Email/password login
- [ ] Password reset flow
- [ ] Form validation with error messages
- [ ] Secure token storage (expo-secure-store)
- [ ] Auto-login on app launch if token valid
- [ ] Logout functionality
- [ ] Account deletion

#### 1.2 Social Authentication
- [ ] Google OAuth login
- [ ] Apple Sign In (iOS required)
- [ ] OAuth profile sync with backend

#### 1.3 Session Management
- [ ] JWT token management
- [ ] Token refresh mechanism (1hr expiry, 5min buffer)
- [ ] Token persistence across app restarts
- [ ] Auth state listener (Firebase onAuthStateChanged)

---

### 2. MARKETPLACE MODULE

#### 2.1 Browse Offers
- [ ] List all active offers
- [ ] Filter by: crypto type, fiat currency, payment method, price range
- [ ] Sort by: price, newest, trade volume
- [ ] Pull-to-refresh functionality
- [ ] Infinite scroll pagination
- [ ] Real-time offer updates (WebSocket)

#### 2.2 Offer Cards
- [ ] Display: crypto type, price, limits, payment methods
- [ ] Seller info: name, rating, success rate, total trades
- [ ] Verified badge for KYC'd users
- [ ] Tap to view full details

#### 2.3 Offer Details Screen
- [ ] Full offer information
- [ ] Seller profile summary
- [ ] "Start Trade" button
- [ ] Amount input with fiat conversion
- [ ] Payment method selection

---

### 3. OFFER MANAGEMENT MODULE

#### 3.1 Create Offer
- [ ] Offer type selection (Buy/Sell)
- [ ] Cryptocurrency selection (USDT, BTC, ETH)
- [ ] Price input (fixed or floating rate)
- [ ] Min/max transaction limits
- [ ] Payment methods multi-select
- [ ] Description/terms input
- [ ] Draft auto-save
- [ ] Form validation

#### 3.2 My Offers
- [ ] List user's offers (active, paused, completed)
- [ ] Edit offer functionality
- [ ] Pause/resume offer
- [ ] Delete offer
- [ ] View offer statistics

#### 3.3 Resell Offers
- [ ] Select existing offer to resell
- [ ] Markup slider (percentage or fixed)
- [ ] Preview calculated price
- [ ] Create resell offer
- [ ] Manage active resells

---

### 4. TRADING MODULE

#### 4.1 Trade Execution
- [ ] Initiate trade from offer
- [ ] Enter trade amount
- [ ] Confirm trade details
- [ ] Escrow initiation

#### 4.2 Active Trade Screen
- [ ] Trade status timeline (pending → active → completed)
- [ ] Escrow status indicator
- [ ] Countdown timer (if applicable)
- [ ] "Mark Payment Sent" button (buyer)
- [ ] "Release Funds" button (seller)
- [ ] "Dispute" button
- [ ] Trade details summary

#### 4.3 Trade Chat
- [ ] Real-time messaging (WebSocket)
- [ ] Message history
- [ ] Image sharing (payment proof)
- [ ] Message timestamps
- [ ] Typing indicator

#### 4.4 Trade History
- [ ] List of all trades (active, completed, cancelled, disputed)
- [ ] Filter by status
- [ ] Trade details on tap
- [ ] Rating/feedback submission

---

### 5. ESCROW MODULE

#### 5.1 Custodial Escrow
- [ ] Display escrow status
- [ ] Escrow amount and currency
- [ ] Release request handling
- [ ] Dispute initiation

#### 5.2 Smart Contract Escrow (Optional/Phase 2)
- [ ] WalletConnect integration
- [ ] BSC network support
- [ ] On-chain escrow creation
- [ ] Transaction hash tracking
- [ ] Blockchain explorer links

---

### 6. WALLET MODULE

#### 6.1 Balance Display
- [ ] Multi-crypto balances (USDT, BTC, ETH)
- [ ] Fiat equivalents (USD, ZAR)
- [ ] Portfolio distribution chart
- [ ] Real-time price updates

#### 6.2 Deposit
- [ ] Generate deposit address per network
- [ ] QR code for wallet address
- [ ] Copy address to clipboard
- [ ] Network selection (Tron, BSC, etc.)
- [ ] Deposit instructions

#### 6.3 Withdraw
- [ ] Select cryptocurrency
- [ ] Enter withdrawal address
- [ ] Address validation
- [ ] Amount input
- [ ] Fee display
- [ ] Confirmation modal
- [ ] 2FA verification (if enabled)

#### 6.4 Transaction History
- [ ] List all transactions
- [ ] Filter by type (deposit, withdrawal, trade, escrow)
- [ ] Transaction details on tap
- [ ] Transaction hash links

---

### 7. AFFILIATE MODULE

#### 7.1 Affiliate Dashboard
- [ ] Total referrals count
- [ ] Active/inactive referral stats
- [ ] Total earnings display
- [ ] Pending vs paid earnings
- [ ] Current tier badge
- [ ] Progress to next tier

#### 7.2 Referral Link
- [ ] Unique referral code
- [ ] Shareable referral link
- [ ] QR code generation
- [ ] Share via native share sheet
- [ ] Campaign tracking links

#### 7.3 Referrals List
- [ ] List of referred users
- [ ] Referral status (pending, active, inactive)
- [ ] Earnings per referral
- [ ] Total trades per referral

#### 7.4 Earnings & Payouts
- [ ] Earnings history
- [ ] Earnings chart visualization
- [ ] Payout request form
- [ ] Payment method selection
- [ ] Payout history
- [ ] Payout status tracking

#### 7.5 Tiers
- [ ] Tier information display
- [ ] Commission rates per tier
- [ ] Benefits per tier
- [ ] Progress indicator

---

### 8. KYC MODULE

#### 8.1 Verification Wizard
- [ ] Step-by-step progress indicator
- [ ] Personal info form
- [ ] Document type selection

#### 8.2 Document Upload
- [ ] Government ID upload (front/back)
- [ ] Selfie capture with camera
- [ ] Address proof upload
- [ ] File size/type validation (10MB max, JPG/PNG/PDF)
- [ ] Document preview
- [ ] Re-upload option

#### 8.3 Verification Status
- [ ] Progress indicator
- [ ] Status per document
- [ ] Verified badge display
- [ ] Rejection feedback

---

### 9. USER PROFILE MODULE

#### 9.1 Profile Display
- [ ] Display name, avatar, bio
- [ ] Country/location
- [ ] Trading stats: total trades, success rate, avg response time
- [ ] Rating display (stars + count)
- [ ] Verified badge

#### 9.2 Profile Editing
- [ ] Edit display name
- [ ] Edit bio
- [ ] Upload profile photo
- [ ] Update country

#### 9.3 User Ratings
- [ ] List of received ratings
- [ ] Rating breakdown
- [ ] View individual reviews

#### 9.4 Public Profile View
- [ ] View other traders' profiles
- [ ] See their ratings and stats
- [ ] View their active offers

---

### 10. SETTINGS MODULE

#### 10.1 Account Settings
- [ ] Email display
- [ ] Change password
- [ ] Delete account

#### 10.2 Payment Methods
- [ ] List saved payment methods
- [ ] Add bank account
- [ ] Add e-wallet
- [ ] Add mobile money
- [ ] Edit payment method
- [ ] Delete payment method
- [ ] Set default method

#### 10.3 Trading Preferences
- [ ] Default cryptocurrency
- [ ] Default fiat currency
- [ ] Auto-confirm trades toggle
- [ ] Trade timeout settings

#### 10.4 Privacy Settings
- [ ] Show online status toggle
- [ ] Show last active toggle
- [ ] Show trading stats toggle

#### 10.5 Security Settings
- [ ] Enable/disable 2FA
- [ ] Login alerts toggle
- [ ] Active sessions

#### 10.6 Theme
- [ ] Light/dark mode toggle
- [ ] System default option

---

### 11. REAL-TIME FEATURES

#### 11.1 WebSocket Integration
- [ ] Socket.io client setup
- [ ] Auto-reconnection
- [ ] Event listeners:
  - [ ] New offers
  - [ ] Offer updates
  - [ ] Trade status changes
  - [ ] Trade messages
  - [ ] Price updates
  - [ ] Escrow updates

---

### 12. COMMON FEATURES

#### 12.1 Error Handling
- [ ] Global error boundary
- [ ] API error handling
- [ ] Network error detection
- [ ] User-friendly error messages
- [ ] Retry mechanisms

#### 12.2 Loading States
- [ ] Skeleton screens
- [ ] Loading spinners
- [ ] Pull-to-refresh indicators

#### 12.3 Offline Support
- [ ] Offline detection banner
- [ ] Cached data display
- [ ] Queue actions for reconnection

---

## IMPLEMENTATION CHECKLIST

### PHASE 1: PROJECT SETUP (Week 1)

#### 1.1 Initialize Project
- [ ] Clone template from GitHub
- [ ] Install additional dependencies
- [ ] Configure TypeScript
- [ ] Setup ESLint & Prettier
- [ ] Configure NativeWind/Tailwind

#### 1.2 Configure Firebase
- [ ] Create Firebase project (or use existing)
- [ ] Add iOS & Android apps
- [ ] Download config files
- [ ] Initialize Firebase in app
- [ ] Setup Firestore rules

#### 1.3 Setup Redux Store
- [ ] Create store configuration
- [ ] Setup redux-persist
- [ ] Create auth slice
- [ ] Create UI slice
- [ ] Create offer slice
- [ ] Configure React Query

#### 1.4 Configure Navigation
- [ ] Setup Expo Router layouts
- [ ] Create auth flow navigation
- [ ] Create main tab navigator
- [ ] Setup protected routes
- [ ] Configure deep linking

#### 1.5 Environment Configuration
- [ ] Create .env files
- [ ] Setup env validation
- [ ] Configure API base URLs
- [ ] Setup feature flags

---

### PHASE 2: AUTHENTICATION (Week 2)

#### 2.1 Auth Screens
- [ ] Create login screen
- [ ] Create signup screen
- [ ] Create forgot password screen
- [ ] Style all auth screens (light/dark)

#### 2.2 Auth Logic
- [ ] Implement Firebase Auth
- [ ] Email/password auth
- [ ] Google OAuth
- [ ] Apple Sign In
- [ ] Token management
- [ ] Auth state persistence

#### 2.3 Auth API Integration
- [ ] Connect to backend signup
- [ ] Connect to backend login
- [ ] Token refresh flow
- [ ] Social login sync

---

### PHASE 3: CORE INFRASTRUCTURE (Week 2-3)

#### 3.1 API Client
- [ ] Create HTTP client with axios
- [ ] Add auth header interceptor
- [ ] Add error handling
- [ ] Add request logging
- [ ] Setup timeout handling

#### 3.2 Token Manager
- [ ] Implement secure token storage
- [ ] Token refresh mechanism
- [ ] Token expiry handling
- [ ] Logout cleanup

#### 3.3 Socket Client
- [ ] Setup Socket.io client
- [ ] Connection management
- [ ] Event handlers
- [ ] Reconnection logic

#### 3.4 Types & Interfaces
- [ ] Define all TypeScript types
- [ ] Create type exports
- [ ] Add JSDoc comments

---

### PHASE 4: UI COMPONENTS (Week 3-4)

#### 4.1 Base Components
- [ ] Button (variants: primary, secondary, outline, ghost)
- [ ] Input (text, password, number)
- [ ] Card
- [ ] Modal/BottomSheet
- [ ] Badge
- [ ] Avatar
- [ ] Skeleton
- [ ] Toast/Snackbar

#### 4.2 Form Components
- [ ] FormField wrapper
- [ ] PasswordInput with toggle
- [ ] Select/Dropdown
- [ ] MultiSelect
- [ ] Slider
- [ ] Switch
- [ ] Checkbox

#### 4.3 Common Components
- [ ] Header with back button
- [ ] Custom TabBar
- [ ] EmptyState
- [ ] ErrorBoundary
- [ ] LoadingScreen
- [ ] RefreshControl wrapper

---

### PHASE 5: MARKETPLACE (Week 4-5)

#### 5.1 Marketplace Screen
- [ ] Offer list with FlatList
- [ ] Pull-to-refresh
- [ ] Infinite scroll
- [ ] Filter sheet
- [ ] Sort options

#### 5.2 Offer Components
- [ ] OfferCard component
- [ ] OfferFilter component
- [ ] CryptoSelector component
- [ ] PriceDisplay component

#### 5.3 Offer Details
- [ ] Offer detail screen
- [ ] Seller profile card
- [ ] Start trade form
- [ ] Amount calculator

#### 5.4 API Integration
- [ ] Connect offers API
- [ ] Implement useOffers hook
- [ ] Setup real-time updates

---

### PHASE 6: OFFER MANAGEMENT (Week 5-6)

#### 6.1 Create Offer
- [ ] Offer type selector
- [ ] Crypto/fiat selection
- [ ] Price input with rate type
- [ ] Limits input
- [ ] Payment methods multi-select
- [ ] Description input
- [ ] Review & submit

#### 6.2 My Offers
- [ ] User offers list
- [ ] Edit offer screen
- [ ] Pause/resume actions
- [ ] Delete confirmation

#### 6.3 Resell Flow
- [ ] Offer selection screen
- [ ] Markup configuration
- [ ] Preview & create

---

### PHASE 7: TRADING (Week 6-7)

#### 7.1 Trade Initiation
- [ ] Start trade screen
- [ ] Amount input
- [ ] Payment method selection
- [ ] Confirmation modal

#### 7.2 Active Trade
- [ ] Trade status screen
- [ ] Status timeline
- [ ] Escrow indicator
- [ ] Action buttons
- [ ] Timer component

#### 7.3 Trade Chat
- [ ] Chat UI
- [ ] Message input
- [ ] Image picker
- [ ] Real-time messages

#### 7.4 Trade History
- [ ] History list
- [ ] Status filters
- [ ] Trade detail view
- [ ] Rating modal

---

### PHASE 8: WALLET (Week 7-8)

#### 8.1 Wallet Screen
- [ ] Balance cards
- [ ] Portfolio chart
- [ ] Quick actions

#### 8.2 Deposit Flow
- [ ] Network selection
- [ ] Address display
- [ ] QR code
- [ ] Copy functionality

#### 8.3 Withdraw Flow
- [ ] Crypto selection
- [ ] Address input
- [ ] Amount input
- [ ] Fee display
- [ ] Confirmation

#### 8.4 Transactions
- [ ] Transaction list
- [ ] Type filters
- [ ] Transaction details

---

### PHASE 9: AFFILIATE (Week 8-9)

#### 9.1 Affiliate Dashboard
- [ ] Stats cards
- [ ] Tier display
- [ ] Progress bar

#### 9.2 Referral Management
- [ ] Referral link card
- [ ] QR code modal
- [ ] Share functionality
- [ ] Referrals list

#### 9.3 Earnings & Payouts
- [ ] Earnings chart
- [ ] Earnings list
- [ ] Payout request form
- [ ] Payout history

---

### PHASE 10: KYC (Week 9)

#### 10.1 KYC Wizard
- [ ] Step indicator
- [ ] Personal info form
- [ ] Document type selection

#### 10.2 Document Upload
- [ ] Camera integration
- [ ] Gallery picker
- [ ] Document preview
- [ ] Upload progress

#### 10.3 Status Display
- [ ] Verification status
- [ ] Document statuses
- [ ] Rejection handling

---

### PHASE 11: PROFILE & SETTINGS (Week 9-10)

#### 11.1 Profile Screen
- [ ] Profile display
- [ ] Edit profile
- [ ] Photo upload
- [ ] Stats display

#### 11.2 Settings Screen
- [ ] Settings list
- [ ] Payment methods management
- [ ] Privacy settings
- [ ] Security settings
- [ ] Theme toggle

---

### PHASE 12: POLISH & TESTING (Week 10-11)

#### 12.1 Error Handling
- [ ] Global error boundary
- [ ] API error handling
- [ ] Network error handling
- [ ] Retry logic

#### 12.2 Performance
- [ ] Image optimization
- [ ] List virtualization
- [ ] Memoization
- [ ] Bundle analysis

#### 12.3 Testing
- [ ] Unit tests for utils
- [ ] Component tests
- [ ] API integration tests
- [ ] E2E tests (optional)

#### 12.4 Accessibility
- [ ] Screen reader support
- [ ] Touch targets
- [ ] Color contrast
- [ ] Font scaling

---

## API INTEGRATION

### Base Configuration
```typescript
// config/api.config.ts
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  TIMEOUT: 30000,
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
};
```

### API Endpoints Summary

| Service | Endpoints |
|---------|-----------|
| Auth | signup, login, refreshToken, deleteUser, socialLoginSync |
| Offers | create, getAll, getBuy, getSell, getById, update, delete, pause, resume |
| Trades | create, getAll, getActive, getCompleted, updateStatus, sendMessage, getMessages |
| Wallet | get, getBalance, getTransactions, deposit, withdraw |
| Escrow | create, get, getAll, link, dispute, getStats |
| Affiliate | getStats, getReferrals, getEarnings, getTiers, getPayouts, generateLink, requestPayout |
| Reseller | getStats, getActiveResells, getTrades, createResell |
| Users | getProfile, updateProfile, getSettings, updateSettings, getRatings, rateUser |
| KYC | getStatus, uploadDocument, submitKYC, getDocuments |
| PaymentMethods | getAll, create, update, delete |
| Prices | getPrices (real-time via socket) |
| System | getStatus, contact |

---

## STATE MANAGEMENT

### Redux Slices

```typescript
// Auth Slice
interface AuthState {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  backendToken: string | null;
}

// UI Slice
interface UIState {
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  toasts: Toast[];
}

// Offer Slice
interface OfferState {
  currentOffer: Offer | null;
  draftOffer: Partial<CreateOfferPayload>;
  escrowFlow: EscrowFlowState;
}

// Wallet Slice
interface WalletState {
  balances: WalletBalances;
  selectedNetwork: string;
}
```

### React Query Keys

```typescript
export const queryKeys = {
  offers: ['offers'],
  buyOffers: ['offers', 'buy'],
  sellOffers: ['offers', 'sell'],
  offer: (id: string) => ['offers', id],
  trades: ['trades'],
  activeTrades: ['trades', 'active'],
  trade: (id: string) => ['trades', id],
  wallet: ['wallet'],
  balance: ['wallet', 'balance'],
  transactions: ['wallet', 'transactions'],
  affiliate: ['affiliate'],
  referrals: ['affiliate', 'referrals'],
  earnings: ['affiliate', 'earnings'],
  kyc: ['kyc'],
  profile: (id?: string) => id ? ['profile', id] : ['profile'],
  settings: ['settings'],
  paymentMethods: ['paymentMethods'],
};
```

---

## DESIGN SYSTEM

### Colors

```typescript
export const colors = {
  // Primary
  primary: {
    DEFAULT: '#00a3f6',
    dark: '#0082c4',
    light: '#33b5f8',
  },

  // Success/Danger/Warning
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',

  // Crypto Colors
  crypto: {
    USDT: '#26A17B',
    BTC: '#F7931A',
    ETH: '#627EEA',
  },

  // Light Theme
  light: {
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
  },

  // Dark Theme
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
  },
};
```

### Spacing

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};
```

### Typography

```typescript
export const typography = {
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
};
```

### Border Radius

```typescript
export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

---

## ENVIRONMENT VARIABLES

```bash
# .env
EXPO_PUBLIC_API_BASE_URL=https://api.qictrader.com
EXPO_PUBLIC_SOCKET_URL=https://api.qictrader.com

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Web3 (Optional)
EXPO_PUBLIC_USE_TESTNET=true

# Feature Flags
EXPO_PUBLIC_ENABLE_DEBUG_LOGS=true
```

---

## RESOURCES

### Template
- **GitHub:** [Sonnysam/starter-template-expo](https://github.com/Sonnysam/starter-template-expo)
- **Includes:** Expo SDK 54, React 19, TypeScript, Firebase, NativeWind, Expo Router

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase React Native](https://rnfirebase.io/)
- [NativeWind](https://www.nativewind.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)

### Additional Resources
- [React Native Firebase Guide](https://rnfirebase.io/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [WalletConnect v2 React Native](https://docs.walletconnect.com/2.0/react-native/installation)

---

## NOTES

1. **No Push Notifications** - As requested, notification features are excluded
2. **Redux for State** - Per project preference, using Redux instead of Zustand
3. **Existing Backend** - App connects to the same backend API as the web app
4. **Web3 Optional** - Smart contract escrow can be Phase 2
5. **iOS/Android Parity** - All features should work on both platforms

---

*Document generated for Qic Trader Mobile App development*
*Last updated: December 2024*
