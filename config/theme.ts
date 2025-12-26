/**
 * Theme Configuration
 * Single source of truth for colors, spacing, shadows
 */

export const Colors = {
  // Primary Brand Color
  primary: {
    DEFAULT: '#00a3f6',
    dark: '#0082c4',
    light: '#33b5f8',
    50: '#e6f7ff',
    100: '#b3e5fc',
    500: '#00a3f6',
    600: '#0082c4',
    700: '#006494',
  },

  // Status Colors
  success: {
    DEFAULT: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  danger: {
    DEFAULT: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
  warning: {
    DEFAULT: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  info: {
    DEFAULT: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },

  // Cryptocurrency Colors
  crypto: {
    USDT: '#26A17B',
    BTC: '#F7931A',
    ETH: '#627EEA',
  },

  // Light Theme
  light: {
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceSecondary: '#f1f5f9',
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
  },

  // Dark Theme
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    border: '#334155',
    borderLight: '#1e293b',
  },

  // Common Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const FontFamily = {
  regular: 'Poppins',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

export const BorderRadius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  fontSize: FontSize,
  fontFamily: FontFamily,
  borderRadius: BorderRadius,
  shadows: Shadows,
} as const;

export default Theme;
