/**
 * Authentication Types
 */

import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  backendToken: string | null;
  tokenExpiresAt: number | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number;
}

export interface BackendToken {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

export interface SocialLoginPayload {
  provider: 'google' | 'apple';
  idToken: string;
}

export type AuthProvider = 'email' | 'google' | 'apple';
