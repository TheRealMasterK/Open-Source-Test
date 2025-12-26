/**
 * useAuth Hook
 * Provides authentication functionality
 */

import { useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setUser,
  setFirebaseUser,
  setLoading,
  setError,
  setBackendToken,
  logout as logoutAction,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
} from '@/store/slices/authSlice';
import { authApi } from '@/services/api';
import { LoginPayload, SignupPayload } from '@/types';
import { setSentryUser, clearSentryUser } from '@/config/sentry.config';
import { restoreTokens, setToken, getToken, getTokenExpiry } from '@/services/api/token-manager';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (payload: LoginPayload) => {
      console.log('[useAuth] login: Starting for', payload.email);
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        const firebaseUser = userCredential.user;

        console.log('[useAuth] login: Firebase success, UID:', firebaseUser.uid);

        dispatch(
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          })
        );
        // Only dispatch serializable fields to avoid Redux warnings
        dispatch(setFirebaseUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        } as any));

        // Set Sentry user context
        setSentryUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          username: firebaseUser.displayName || undefined,
        });

        // Sync with backend and store token in Redux
        try {
          const authResponse = await authApi.login(payload);
          console.log('[useAuth] login: Backend sync success');
          // Store token in Redux state (also stored in SecureStore by authApi)
          if (authResponse.token && authResponse.expiresAt) {
            dispatch(setBackendToken({ token: authResponse.token, expiresAt: authResponse.expiresAt }));
            console.log('[useAuth] login: Token set in Redux');
          }
        } catch (backendError) {
          console.warn('[useAuth] login: Backend sync failed', backendError);
        }

        return firebaseUser;
      } catch (err: unknown) {
        console.error('[useAuth] login: Error', err);
        const message = getErrorMessage(err);
        dispatch(setError(message));
        throw new Error(message);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Sign up with email and password
   */
  const signup = useCallback(
    async (payload: SignupPayload) => {
      console.log('[useAuth] signup: Starting for', payload.email);
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        const firebaseUser = userCredential.user;

        console.log('[useAuth] signup: Firebase success, UID:', firebaseUser.uid);

        // Update display name
        if (payload.username || payload.displayName) {
          await updateProfile(firebaseUser, {
            displayName: payload.displayName || payload.username,
          });
        }

        dispatch(
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: payload.displayName || payload.username || null,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          })
        );
        // Only dispatch serializable fields to avoid Redux warnings
        dispatch(setFirebaseUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: payload.displayName || payload.username || firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        } as any));

        // Set Sentry user context
        setSentryUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          username: payload.displayName || payload.username || undefined,
        });

        // Sync with backend and store token in Redux
        try {
          const authResponse = await authApi.signup(payload);
          console.log('[useAuth] signup: Backend sync success');
          // Store token in Redux state (also stored in SecureStore by authApi)
          if (authResponse.token && authResponse.expiresAt) {
            dispatch(setBackendToken({ token: authResponse.token, expiresAt: authResponse.expiresAt }));
            console.log('[useAuth] signup: Token set in Redux');
          }
        } catch (backendError) {
          console.warn('[useAuth] signup: Backend sync failed', backendError);
        }

        return firebaseUser;
      } catch (err: unknown) {
        console.error('[useAuth] signup: Error', err);
        const message = getErrorMessage(err);
        dispatch(setError(message));
        throw new Error(message);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    console.log('[useAuth] logout: Starting');
    dispatch(setLoading(true));

    try {
      await signOut(auth);
      await authApi.logout();
      dispatch(logoutAction());
      clearSentryUser();
      console.log('[useAuth] logout: Success');
    } catch (err) {
      console.error('[useAuth] logout: Error', err);
      // Still logout locally even if there's an error
      dispatch(logoutAction());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Clear auth error
   */
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  /**
   * Sync backend token on app start
   * Tries to restore from storage first, then refreshes if needed
   */
  const syncBackendToken = useCallback(async (): Promise<boolean> => {
    console.log('[useAuth] syncBackendToken: Starting token sync...');

    try {
      // First try to restore token from secure storage
      const existingToken = await getToken();
      if (existingToken) {
        console.log('[useAuth] syncBackendToken: Token restored from storage');
        // Also update Redux with the restored token
        const expiry = getTokenExpiry();
        if (expiry) {
          dispatch(setBackendToken({ token: existingToken, expiresAt: expiry }));
          console.log('[useAuth] syncBackendToken: Token set in Redux');
        }
        return true;
      }

      // No stored token - need to get a fresh one from backend
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        console.log('[useAuth] syncBackendToken: No Firebase user, skipping');
        return false;
      }

      // Get Firebase ID token
      console.log('[useAuth] syncBackendToken: Getting Firebase ID token...');
      const idToken = await firebaseUser.getIdToken(true);

      // Sync with backend using the refresh endpoint
      console.log('[useAuth] syncBackendToken: Syncing with backend...');
      const response = await authApi.refreshToken(idToken);

      if (response.token && response.expiresAt) {
        console.log('[useAuth] syncBackendToken: Backend sync success');
        dispatch(setBackendToken({ token: response.token, expiresAt: response.expiresAt }));
        return true;
      }

      console.warn('[useAuth] syncBackendToken: No token in response');
      return false;
    } catch (error) {
      console.error('[useAuth] syncBackendToken: Error', error);
      return false;
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    syncBackendToken,
  };
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code || error.message;

    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  return 'An unexpected error occurred.';
}

export default useAuth;
