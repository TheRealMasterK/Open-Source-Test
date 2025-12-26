/**
 * Firebase Configuration
 * Initializes Firebase app with environment variables
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import ENV from './env';

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
  } else {
    if (__DEV__) {
      console.log('[Firebase] Using existing Firebase app');
    }
    app = getApp();
  }

  // Initialize services
  auth = getAuth(app);
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
