/**
 * Firebase Configuration
 * Initializes Firebase app with environment variables
 * Includes persistence for React Native
 */

import { Platform } from 'react-native';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from './env';

// Conditionally import React Native persistence (only available on native platforms)
let getReactNativePersistence: ((storage: typeof AsyncStorage) => unknown) | undefined;
if (Platform.OS !== 'web') {
  // @ts-ignore - getReactNativePersistence exists in RN bundle but TypeScript types are missing
  getReactNativePersistence = require('firebase/auth').getReactNativePersistence;
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: ENV.FIREBASE.API_KEY,
  authDomain: ENV.FIREBASE.AUTH_DOMAIN,
  projectId: ENV.FIREBASE.PROJECT_ID,
  storageBucket: ENV.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE.MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE.APP_ID,
  measurementId: ENV.FIREBASE.MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  if (!getApps().length) {
    if (__DEV__) {
      console.log('[Firebase] Initializing Firebase app...');
    }
    app = initializeApp(firebaseConfig);
    if (__DEV__) {
      console.log('[Firebase] Firebase app initialized successfully');
    }

    // Initialize Auth with persistence
    // Use browser persistence for web, AsyncStorage for native
    if (__DEV__) {
      console.log('[Firebase] Initializing Auth with persistence for platform:', Platform.OS);
    }

    if (Platform.OS === 'web') {
      // Web: use browser local persistence
      auth = initializeAuth(app, {
        persistence: browserLocalPersistence,
      });
    } else if (getReactNativePersistence) {
      // Native: use AsyncStorage persistence
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      // Fallback: no persistence
      console.warn('[Firebase] No persistence available, using default');
      auth = getAuth(app);
    }

    if (__DEV__) {
      console.log('[Firebase] Auth initialized with persistence');
    }
  } else {
    if (__DEV__) {
      console.log('[Firebase] Using existing Firebase app');
    }
    app = getApp();
    // Get existing auth instance
    auth = getAuth(app);
  }

  // Initialize other services
  db = getFirestore(app);
  storage = getStorage(app);

  if (__DEV__) {
    console.log('[Firebase] Firebase services initialized successfully');
    console.log('[Firebase] Project ID:', ENV.FIREBASE.PROJECT_ID);
  }
} catch (error) {
  console.error('[Firebase] Error initializing Firebase:', error);
  throw error;
}

export { app, auth, db, storage };
export default app;
