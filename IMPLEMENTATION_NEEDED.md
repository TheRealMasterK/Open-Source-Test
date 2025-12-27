# 🚧 Implementation Needed

This document tracks what still needs to be implemented in the QIC Trader Mobile App.

## ✅ What's Already Working

- Authentication (Firebase + Backend JWT)
- Profile screen with stats
- Dashboard with trading overview
- Navigation structure
- Theme system (light/dark mode)
- KYC flow UI
- Marketplace browsing
- Basic wallet UI

---

## ❌ **Priority 1: Critical Missing Features**

### 1. Wallet Operations API Integration

**Location:** `app/wallet/`

- [ ] **Withdraw** - `withdraw.tsx:79`
  - Currently: Mock delay
  - Needs: Real API call to `/api/wallet/withdraw`
  - Required data: `{ crypto, amount, address, network }`

- [ ] **Transfer** - `transfer.tsx:66`
  - Currently: Mock delay  
  - Needs: Real API call to `/api/wallet/transfer`
  - Required data: `{ crypto, amount, fromWallet, toWallet }`

- [ ] **Deposit Address** - `deposit.tsx`
  - Currently: Hardcoded example address
  - Needs: API call to `/api/wallet/deposit-address`
  - Should generate unique address per crypto/network

**Implementation Steps:**
```typescript
// services/api/wallet-api.ts
export async function withdrawCrypto(data: WithdrawRequest) {
  return httpClient.post('/wallet/withdraw', data);
}

export async function transferCrypto(data: TransferRequest) {
  return httpClient.post('/wallet/transfer', data);
}

export async function getDepositAddress(crypto: string, network: string) {
  return httpClient.get(`/wallet/deposit-address/${crypto}/${network}`);
}
```

---

### 2. Settings Screen Features

**Location:** `app/settings/index.tsx`

Currently all placeholders - need full implementation:

#### Edit Profile
- [ ] Create edit profile modal/screen
- [ ] API endpoint: `PUT /api/user/profile`
- [ ] Fields: displayName, avatar, phone, bio
- [ ] Image upload for avatar

#### Payment Methods
- [ ] List payment methods: `GET /api/payment-methods`
- [ ] Add method: `POST /api/payment-methods`
- [ ] Delete method: `DELETE /api/payment-methods/:id`
- [ ] Edit method: `PUT /api/payment-methods/:id`
- [ ] UI for bank accounts, mobile money, cards

#### Security Settings
- [ ] Change password: `POST /api/auth/change-password`
- [ ] Enable/disable 2FA: `POST /api/auth/2fa/toggle`
- [ ] View active sessions: `GET /api/auth/sessions`
- [ ] Revoke sessions: `DELETE /api/auth/sessions/:id`

#### Notification Preferences
- [ ] Get preferences: `GET /api/user/notification-preferences`
- [ ] Update: `PUT /api/user/notification-preferences`
- [ ] Toggle options: trade updates, price alerts, system notifications

#### Language & Currency
- [ ] Language selector UI
- [ ] Currency preference API
- [ ] Persist in user settings

**Implementation:**
```typescript
// Create: services/api/settings-api.ts
// Create: app/settings/profile.tsx
// Create: app/settings/payment-methods.tsx
// Create: app/settings/security.tsx
// Create: app/settings/notifications.tsx
```

---

### 3. Trade Flow Implementation

**Missing Components:**

- [ ] Trade detail screen (`app/trades/[id].tsx`) - needs full chat, actions
- [ ] Trade chat with real-time messages (Socket.io)
- [ ] Escrow status tracking
- [ ] Payment proof upload
- [ ] Dispute system
- [ ] Release/Cancel actions

**APIs Needed:**
```typescript
POST /api/trades/:id/message
POST /api/trades/:id/upload-proof
POST /api/trades/:id/confirm-payment
POST /api/trades/:id/release
POST /api/trades/:id/cancel
POST /api/trades/:id/dispute
```

---

### 4. Offer Management

**Location:** `app/offers/create.tsx` & `app/offers/[id].tsx`

- [ ] Create offer form validation
- [ ] Price calculation engine
- [ ] Min/max limits
- [ ] Payment methods selection
- [ ] Trading instructions
- [ ] Edit existing offers
- [ ] Toggle offer active/inactive
- [ ] Delete offers

**APIs:**
```typescript
GET /api/offers/my-offers
POST /api/offers
PUT /api/offers/:id
DELETE /api/offers/:id
PATCH /api/offers/:id/toggle
```

---

## 🔄 **Priority 2: Real-Time Features**

### WebSocket Integration

**Location:** `services/socket/` (needs creation)

**Events to Handle:**
```typescript
// Incoming
'offer:new'
'offer:update'
'trade:status'
'trade:message'
'price:update'
'escrow:update'

// Outgoing
'trade:typing'
'trade:read'
```

**Implementation:**
```typescript
// services/socket/socket-client.ts
import io from 'socket.io-client';
import { ENV } from '@/config/env';

export const socket = io(ENV.SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

// hooks/useSocket.ts
export function useSocket() {
  useEffect(() => {
    if (isAuthenticated) {
      socket.auth = { token };
      socket.connect();
      
      return () => socket.disconnect();
    }
  }, [isAuthenticated]);
}
```

---

## 📊 **Priority 3: Enhanced Features**

### Analytics & Charts

- [ ] Portfolio value chart (wallet screen)
- [ ] Trade volume history
- [ ] Price trend charts
- [ ] Affiliate earnings chart

**Library:** Use `react-native-chart-kit` or `victory-native`

### KYC Document Upload

- [ ] Camera integration for selfie
- [ ] Document scanner
- [ ] Image compression
- [ ] Upload progress
- [ ] Document verification status

### Affiliate System

- [ ] Referral link sharing
- [ ] QR code generation
- [ ] Referral list with stats
- [ ] Earnings breakdown
- [ ] Payout requests

---

## 🔧 **Priority 4: API Service Files to Create**

Based on the needs above:

```bash
services/api/
├── wallet-api.ts          # ❌ Create
├── settings-api.ts        # ❌ Create  
├── payment-methods-api.ts # ❌ Create
├── offers-api.ts          # ❌ Extend current
├── trades-api.ts          # ❌ Extend current
├── kyc-api.ts             # ❌ Create
└── affiliate-api.ts       # ❌ Create
```

---

## 🎨 **Priority 5: UI Components to Build**

From CHECKLIST.md analysis:

### Wallet Components
- [ ] `PortfolioChart.tsx` - Line/area chart for balance history
- [ ] `TransactionList.tsx` - Scrollable transaction history
- [ ] `NetworkSelector.tsx` - Choose blockchain network
- [ ] `DepositAddress.tsx` - QR code + copy address

### Trade Components  
- [ ] `TradeStatusTimeline.tsx` - Visual progress tracker
- [ ] `MessageBubble.tsx` - Chat message component
- [ ] `EscrowStatus.tsx` - Escrow amount & countdown
- [ ] `PaymentProofViewer.tsx` - Image viewer for receipts

### Marketplace Components
- [ ] `OfferFilter.tsx` - Advanced filtering UI
- [ ] `CryptoPrice.tsx` - Live price ticker
- [ ] `SellerInfo.tsx` - Trader rating & stats

### Affiliate Components
- [ ] `ReferralQRCode.tsx` - QR code for sharing
- [ ] `EarningsChart.tsx` - Earnings over time
- [ ] `TierProgress.tsx` - Progress to next tier

---

## 🐛 **Known Issues to Fix**

1. **Token Refresh** - Currently implemented but needs testing
2. **Error Handling** - Add global error boundary
3. **Offline Mode** - Cache critical data
4. **Loading States** - Add skeleton screens everywhere
5. **Form Validation** - Add comprehensive validation

---

## 📋 **Implementation Order**

### Week 1: Wallet & Payments
1. Wallet API integration (withdraw, transfer, deposit)
2. Payment methods CRUD
3. Transaction history

### Week 2: Settings & Profile
1. Edit profile functionality
2. Security settings
3. Notification preferences
4. Theme persistence

### Week 3: Trading Features
1. Trade chat with Socket.io
2. Payment proof upload
3. Escrow tracking
4. Dispute system

### Week 4: Offers & Marketplace
1. Create/edit offers
2. Advanced filters
3. Price calculations
4. Auto-refresh offers

### Week 5: Enhanced Features
1. Charts & analytics
2. KYC document upload
3. Affiliate dashboard
4. Real-time notifications

### Week 6: Polish & Testing
1. Error handling
2. Loading states
3. Offline support
4. Performance optimization
5. Bug fixes

---

## 🔗 **API Endpoints Documentation Needed**

Request backend team to document:

```
POST   /api/wallet/withdraw
POST   /api/wallet/transfer
GET    /api/wallet/deposit-address/:crypto/:network
GET    /api/wallet/transactions
PUT    /api/user/profile
GET    /api/payment-methods
POST   /api/payment-methods
PUT    /api/payment-methods/:id
DELETE /api/payment-methods/:id
POST   /api/trades/:id/message
POST   /api/trades/:id/upload-proof
POST   /api/offers
PUT    /api/offers/:id
GET    /api/affiliate/stats
POST   /api/kyc/documents
```

---

## ✅ **Checklist Summary**

**Critical (Must Have):**
- [ ] Wallet operations (withdraw, transfer, deposit)
- [ ] Settings functionality (profile, payments, security)
- [ ] Trade chat & actions
- [ ] Offer management

**Important (Should Have):**
- [ ] WebSocket real-time updates
- [ ] Charts & analytics
- [ ] KYC document handling
- [ ] Affiliate features

**Nice to Have:**
- [ ] Advanced filters
- [ ] Offline mode
- [ ] Push notifications (excluded by design)
- [ ] Multi-language

---

**Last Updated:** December 27, 2025
**Status:** Ready for implementation

---

## 📋 **Additional Gaps & Missing Features**

### **Missing Screens/Routes**

1. **Offer Resell Screen** - `app/offers/resell/[id].tsx`
   - Referenced in marketplace but doesn't exist
   - Need: Reseller markup UI, price calculation, create resell offer

2. **Settings Sub-Screens**
   - `app/settings/profile.tsx` - Edit profile form
   - `app/settings/payment-methods.tsx` - CRUD for payment methods  
   - `app/settings/security.tsx` - Password, 2FA, sessions
   - `app/settings/notifications.tsx` - Notification preferences
   - `app/settings/language.tsx` - Language selector
   - `app/settings/currency.tsx` - Default currency

3. **Wallet Sub-Screens Missing**
   - Transaction filters/search
   - Export transaction history
   - Address book for frequent addresses

---

### **Integration Status Check**

✅ **API Services Already Created:**
- `wallet-api.ts` - ✅ Exists (withdraw, deposit, transfer implemented)
- `users-api.ts` - ✅ Exists (profile, settings implemented)
- `payment-methods-api.ts` - ✅ Exists
- `offers-api.ts` - ✅ Exists
- `trades-api.ts` - ✅ Exists  
- `kyc-api.ts` - ✅ Exists
- `affiliate-api.ts` - ✅ Exists

⚠️ **But Screens Aren't Using Them:**
- [app/wallet/withdraw.tsx](app/wallet/withdraw.tsx#L79) uses mock instead of `wallet-api.withdraw()`
- [app/wallet/transfer.tsx](app/wallet/transfer.tsx#L66) uses mock instead of implementing transfer
- [app/settings/index.tsx](app/settings/index.tsx) has `console.log` instead of `users-api.updateProfile()`

**Action:** Wire up existing API services to screens!

---

### **Testing Infrastructure** 

❌ **No tests exist:**
- No `*.test.ts` files
- No `*.spec.ts` files  
- No test coverage

**Needed:**
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest
npm install --save-dev @testing-library/jest-native

# Create test structure
__tests__/
├── components/          # Component tests
├── screens/            # Screen tests
├── hooks/              # Hook tests
├── utils/              # Utility tests
└── integration/        # Integration tests
```

**Priority Tests:**
1. Authentication flow
2. Wallet operations
3. Trade creation
4. Offer management
5. Form validation
6. API service mocking

---

### **Accessibility Improvements**

✅ **Some accessibility exists:**
- Dashboard components have labels
- Wallet components have labels
- Market trends have labels

❌ **Missing accessibility:**
- Profile screen - no labels
- Settings items - no labels
- Trade screens - no labels
- Forms - incomplete labels
- Modal screens - no announce on open
- Error messages - no screen reader announcements

**Action Items:**
```tsx
// Add to all interactive elements
accessibilityLabel="Descriptive action"
accessibilityRole="button"
accessibilityHint="What will happen when pressed"

// Add to forms
accessibilityLabel="Email input field"
accessibilityHint="Enter your email address"

// Add to error states
<Text accessibilityLiveRegion="polite" accessibilityRole="alert">
  {errorMessage}
</Text>
```

---

### **Performance Optimizations Needed**

1. **Image Optimization**
   - No lazy loading for images
   - No image caching strategy
   - Missing placeholder images

2. **List Performance**
   - Some lists don't use `FlatList` (should for large lists)
   - Missing `keyExtractor` optimization
   - No `getItemLayout` for fixed height items

3. **Re-render Prevention**
   - Add `React.memo` to expensive components
   - Use `useCallback` for event handlers
   - Use `useMemo` for computed values

4. **Bundle Size**
   - No code splitting
   - All icons loaded upfront
   - Consider using Hermes engine optimization

**Implementation:**
```tsx
// Example: Memoize expensive components
const OfferCard = React.memo(({ offer, onPress }) => {
  // ... component code
}, (prevProps, nextProps) => {
  return prevProps.offer.id === nextProps.offer.id;
});

// Example: Optimize callbacks
const handlePress = useCallback(() => {
  router.push(`/offers/${id}`);
}, [id]);

// Example: FlatList optimization
<FlatList
  data={offers}
  renderItem={renderOffer}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

---

### **Error Handling Enhancements**

❌ **Missing:**
- Global error boundary
- Retry mechanism UI
- Offline error handling
- Network timeout handling
- API error code mapping

**Create:**
```tsx
// components/providers/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    logger.error('ErrorBoundary', error, errorInfo);
    Sentry.captureException(error);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} onRetry={this.reset} />;
    }
    return this.props.children;
  }
}

// utils/error-handler.ts
export function mapApiError(error: ApiError): UserFriendlyMessage {
  const errorMap = {
    'INSUFFICIENT_BALANCE': 'You don't have enough balance',
    'INVALID_ADDRESS': 'Invalid wallet address',
    'TRADE_NOT_FOUND': 'Trade not found',
    // ... more mappings
  };
  return errorMap[error.code] || 'Something went wrong';
}
```

---

### **Security Enhancements**

1. **Input Validation**
   - Add comprehensive form validation
   - Sanitize user inputs
   - Validate addresses before transactions

2. **Secure Storage**
   - ✅ Already using expo-secure-store
   - ❌ Need to encrypt sensitive local data
   - ❌ Add biometric authentication option

3. **Network Security**
   - ✅ HTTPS enforced
   - ❌ Add certificate pinning
   - ❌ Add request signing for critical operations

4. **Session Management**
   - ✅ Token refresh implemented
   - ❌ Add session timeout
   - ❌ Add concurrent session detection
   - ❌ Add suspicious activity alerts

---

### **Developer Experience**

**Missing:**
- ❌ Storybook for component development
- ❌ Automated changelog generation
- ❌ Commit message linting
- ❌ Pre-commit hooks
- ❌ CI/CD pipeline configuration
- ❌ API documentation generation

**Add:**
```bash
# Pre-commit hooks
npm install --save-dev husky lint-staged

# Commit linting
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Storybook
npx sb init --type react_native
```

---

### **Documentation Gaps**

**Missing:**
- ❌ Component API documentation
- ❌ Screen flow diagrams
- ❌ State management documentation
- ❌ API integration guide
- ❌ Deployment guide (iOS/Android)
- ❌ Contribution guidelines
- ❌ Architecture decision records (ADRs)

**Create:**
```
docs/
├── ARCHITECTURE.md      # System architecture
├── COMPONENTS.md        # Component usage guide
├── STATE_MANAGEMENT.md  # Redux/Query patterns
├── API_INTEGRATION.md   # Backend integration
├── DEPLOYMENT.md        # Build & deploy guide
├── CONTRIBUTING.md      # How to contribute
└── CHANGELOG.md         # Version history
```

---

### **Build & Deployment**

**Missing:**
- ❌ EAS Build configuration
- ❌ App Store metadata
- ❌ Google Play metadata
- ❌ Privacy policy link
- ❌ Terms of service link
- ❌ App icon variants (all sizes)
- ❌ Splash screen variants
- ❌ App screenshots for stores
- ❌ Beta testing setup (TestFlight/Internal Testing)

**Create:**
```bash
# EAS Build setup
npm install -g eas-cli
eas build:configure

# Create app.json metadata
# Add store assets to assets/store/
```

---

### **Analytics & Monitoring**

**Partial Implementation:**
- ✅ Sentry error tracking
- ❌ User analytics (screen views, events)
- ❌ Performance monitoring
- ❌ Crash reporting dashboard
- ❌ User session recording
- ❌ A/B testing framework

**Add:**
```bash
# Analytics
npm install @segment/analytics-react-native
# or
npm install @react-native-firebase/analytics

# Performance
npm install @react-native-firebase/perf
```

---

### **Internationalization (i18n)**

❌ **Not implemented:**
- No translation system
- Hardcoded English strings
- No locale switching
- No RTL support
- No date/currency formatting per locale

**Implementation:**
```bash
npm install react-i18next i18next

# Create locales/
locales/
├── en.json
├── fr.json
└── es.json
```

---

### **Push Notifications Setup**

**Note:** Excluded by design, but infrastructure should exist for future:

```bash
# If needed later:
npm install expo-notifications
npm install @notifee/react-native  # For advanced features
```

---

## 🎯 **Revised Priority Order**

### **Phase 1: Critical Fixes (Week 1)**
1. ✅ Wire up wallet API to screens (replace mocks)
2. ✅ Implement settings functionality (profile, payments, security)
3. ✅ Add global error boundary
4. ✅ Create missing settings sub-screens

### **Phase 2: Core Features (Week 2-3)**
1. ✅ Complete trade flow with Socket.io
2. ✅ Implement offer resell screen
3. ✅ Add comprehensive form validation
4. ✅ Implement payment proof upload

### **Phase 3: Enhancement (Week 4-5)**
1. ✅ Add accessibility labels everywhere
2. ✅ Optimize list performance (FlatList)
3. ✅ Implement retry mechanisms
4. ✅ Add loading skeletons
5. ✅ Charts & analytics

### **Phase 4: Quality & Polish (Week 6)**
1. ✅ Write unit tests (>60% coverage target)
2. ✅ Add Storybook for components
3. ✅ Performance profiling & optimization
4. ✅ Security audit
5. ✅ Accessibility audit

### **Phase 5: Deployment Prep (Week 7)**
1. ✅ EAS Build setup
2. ✅ Store assets & metadata
3. ✅ Beta testing
4. ✅ Documentation completion
5. ✅ Final QA

---

**Last Updated:** December 27, 2025
**Comprehensive Status:** Detailed implementation roadmap complete
