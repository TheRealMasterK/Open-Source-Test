# Sentry Setup Guide

Sentry has been configured for error tracking and performance monitoring in the Qic Trader mobile app.

## 📦 Installed Packages

- `@sentry/react-native` - Sentry SDK for React Native
- `sentry-expo` - Expo integration for Sentry

## ⚙️ Configuration Files

### 1. **config/sentry.config.ts**
Main Sentry configuration with initialization and helper functions:
- `initSentry()` - Initialize Sentry
- `setSentryUser()` - Set user context
- `clearSentryUser()` - Clear user context
- `captureException()` - Manually capture errors
- `captureMessage()` - Log messages
- `addBreadcrumb()` - Add debugging breadcrumbs

### 2. **utils/sentry.ts**
Utility functions for common logging scenarios:
- `logApiError()` - Log API errors
- `logAuthError()` - Log authentication errors
- `logNavigation()` - Track navigation
- `logTradeAction()` - Track trade operations
- `logPaymentAction()` - Track payment operations
- `logKYCAction()` - Track KYC operations
- `logPerformance()` - Track performance metrics

### 3. **app/_layout.tsx**
Sentry is initialized at app startup.

### 4. **hooks/auth/useAuth.ts**
Updated to track user context on login/signup and clear on logout.

## 🔑 Getting Your Sentry DSN

1. **Create a Sentry Account**
   - Go to https://sentry.io/signup/
   - Sign up for a free account

2. **Create a New Project**
   - Click "Create Project"
   - Select "React Native" as the platform
   - Name it "Qic Trader Mobile" (or your preferred name)
   - Click "Create Project"

3. **Copy Your DSN**
   - After creating the project, you'll see your DSN
   - It looks like: `https://xxxxxxxxxxxxx@xxxxx.ingest.sentry.io/xxxxxx`

4. **Add DSN to Your Environment**
   - Create a `.env` file (copy from `.env.example` if needed)
   - Add: `EXPO_PUBLIC_SENTRY_DSN=your-dsn-here`

## 🚀 Usage Examples

### Capture Errors
```typescript
import { captureException } from '@/utils/sentry';

try {
  // Your code
} catch (error) {
  captureException(error, { context: 'additional info' });
}
```

### Log API Errors
```typescript
import { logApiError } from '@/utils/sentry';

try {
  const response = await api.get('/endpoint');
} catch (error) {
  logApiError(error, '/endpoint', { userId: user.id });
}
```

### Track Navigation
```typescript
import { logNavigation } from '@/utils/sentry';

logNavigation('TradeDetails', { tradeId: '123' });
```

### Add Breadcrumbs
```typescript
import { addBreadcrumb } from '@/utils/sentry';

addBreadcrumb({
  message: 'User clicked buy button',
  category: 'user_action',
  level: 'info',
  data: { amount: 100, currency: 'USD' }
});
```

### Track Performance
```typescript
import { startTransaction } from '@/utils/sentry';

const transaction = startTransaction('LoadTradesList', 'api.call');
try {
  await fetchTrades();
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('unknown_error');
} finally {
  transaction.finish();
}
```

## 🔒 Environment Variables

Add to your `.env` file:
```bash
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
```

## 🛠️ Build Configuration

### For EAS Build
If using EAS Build, make sure your environment variables are set in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SENTRY_DSN": "your-production-dsn"
      }
    }
  }
}
```

### Rebuild Native Projects
After adding Sentry, you need to rebuild the native projects:

```bash
# Clean and rebuild
expo prebuild --clean

# For iOS
expo run:ios

# For Android
expo run:android
```

## 📊 Features Enabled

- ✅ **Error Tracking** - Automatic capture of JavaScript errors
- ✅ **Crash Reporting** - Native crash tracking for iOS and Android
- ✅ **Performance Monitoring** - Track app performance and API calls
- ✅ **User Context** - Track which users experience errors
- ✅ **Breadcrumbs** - See user actions leading to errors
- ✅ **Session Tracking** - Monitor app sessions
- ✅ **Release Tracking** - Track errors by app version

## 🧪 Testing Sentry

To test if Sentry is working:

```typescript
import { captureMessage } from '@/utils/sentry';

// Trigger a test event
captureMessage('Sentry test message', 'info');

// Or trigger an error
throw new Error('Sentry test error');
```

Check your Sentry dashboard at https://sentry.io to see the events.

## 📝 Notes

- Sentry is **disabled** in development mode by default to avoid noise
- Set `enableInExpoDevelopment: true` in `sentry.config.ts` if you want it enabled in dev
- Errors are automatically captured - manual logging is for additional context
- User information is automatically cleared on logout

## 🔗 Resources

- [Sentry React Native Documentation](https://docs.sentry.io/platforms/react-native/)
- [Sentry Expo Documentation](https://docs.sentry.io/platforms/react-native/manual-setup/expo/)
- [Sentry Dashboard](https://sentry.io/)

## 🐛 Troubleshooting

**Sentry not initializing?**
- Check that `EXPO_PUBLIC_SENTRY_DSN` is set in your `.env` file
- Verify the DSN is correct (copy from Sentry dashboard)
- Check console for Sentry initialization messages

**No events showing in Sentry?**
- Ensure you're not in development mode (or enable `enableInExpoDevelopment`)
- Check your internet connection
- Verify the DSN is correct
- Check Sentry quota limits (free tier has limits)

**Build errors?**
- Run `expo prebuild --clean` to regenerate native projects
- Make sure all dependencies are installed: `npm install`
