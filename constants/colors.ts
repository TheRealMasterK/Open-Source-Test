/**
 * QIC Trader Color System
 * Matches Web App Design System for consistency
 */

import { ColorScheme, Props } from '../types/contants/colors';

/**
 * Brand Colors - Always consistent across themes
 */
export const brand = {
  blue: '#00a3f6',
  blueLight: '#38bdf8',
  blueDark: '#0284c7',
  blueBg: 'rgba(0, 163, 246, 0.1)',
  green: '#10b981',
  greenDark: '#059669',
  red: '#ef4444',
  redDark: '#dc2626',
} as const;

/**
 * Semantic Colors - Status indicators
 */
export const semantic = {
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  successDark: '#059669',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.1)',
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.1)',
} as const;

/**
 * Chart Colors - Data visualization
 */
export const chartColors = {
  light: {
    chart1: '#3b82f6',
    chart2: '#10b981',
    chart3: '#f59e0b',
    chart4: '#8b5cf6',
    chart5: '#ec4899',
  },
  dark: {
    chart1: '#60a5fa',
    chart2: '#34d399',
    chart3: '#fbbf24',
    chart4: '#a78bfa',
    chart5: '#f472b6',
  },
} as const;

/**
 * Crypto Colors - Cryptocurrency branding
 */
export const crypto = {
  usdt: '#26A17B',
  btc: '#F7931A',
  eth: '#627EEA',
} as const;

/**
 * Light Theme Colors
 */
export const lightTheme = {
  background: '#ffffff',
  backgroundSecondary: '#ffffff',
  backgroundGray: '#F6F6F6',
  backgroundGrayLight: '#EFEFEF',
  foreground: '#0f172a',
  card: '#ffffff',
  cardForeground: '#0f172a',
  cardElevated: '#ffffff',
  primary: '#0f172a',
  primaryForeground: '#f8fafc',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#475569',
  accent: '#f1f5f9',
  accentForeground: '#0f172a',
  border: '#e2e8f0',
  borderSubtle: 'rgba(0, 0, 0, 0.08)',
  input: '#e2e8f0',
  inputBg: '#f8fafc',
  inputBorder: '#e2e8f0',
  ring: '#94a3b8',
  surface: '#f8fafc',
  surfaceHover: '#f1f5f9',
  surfaceDark: '#e2e8f0',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textPlaceholder: '#9ca3af',
  avatarBg: '#dbeafe',
  avatarText: '#2563eb',
  badgeBg: '#f1f5f9',
  badgeText: '#475569',
  tableHeader: '#f8fafc',
  tableRowHover: '#f1f5f9',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

/**
 * Dark Theme Colors
 */
export const darkTheme = {
  background: '#000000',
  backgroundSecondary: '#111111',
  backgroundGray: '#040607',
  backgroundGrayLight: '#191F2A',
  foreground: '#f8fafc',
  card: '#191F2A',
  cardForeground: '#f8fafc',
  cardElevated: '#334155',
  primary: '#f8fafc',
  primaryForeground: '#0f172a',
  secondary: '#334155',
  secondaryForeground: '#f8fafc',
  muted: '#334155',
  mutedForeground: '#94a3b8',
  accent: '#334155',
  accentForeground: '#f8fafc',
  border: 'rgba(255, 255, 255, 0.1)',
  borderSubtle: 'rgba(255, 255, 255, 0.1)',
  input: 'rgba(255, 255, 255, 0.15)',
  inputBg: '#1e293b',
  inputBorder: 'rgba(255, 255, 255, 0.15)',
  ring: '#64748b',
  surface: '#1e293b',
  surfaceHover: '#334155',
  surfaceDark: '#0f172a',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  textPlaceholder: '#64748b',
  avatarBg: 'rgba(59, 130, 246, 0.2)',
  avatarText: '#60a5fa',
  badgeBg: '#334155',
  badgeText: '#94a3b8',
  tableHeader: '#1e293b',
  tableRowHover: '#334155',
  overlay: 'rgba(0, 0, 0, 0.75)',
} as const;

/**
 * Complete Color Scheme Export
 */
export const colorScheme: ColorScheme = {
  light: lightTheme,
  dark: darkTheme,
  brand,
  semantic,
  chart: chartColors.light,
  crypto,
};

/**
 * Legacy Colors Export (backward compatibility)
 */
export const Colors: Props = {
  primary: brand.blue,
  black: '#0f172a',
  grey: '#64748b',
  lightGrey: '#f1f5f9',
  gray: '#334155',
  secondary: '#94a3b8',
  white: '#ffffff',
  red: semantic.error,
  orange: semantic.warning,
  success: semantic.success,
};

/**
 * Helper function to get theme colors
 */
export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkTheme : lightTheme;
};

/**
 * Helper function to get semantic color with background
 */
export const getStatusColor = (
  status: 'success' | 'warning' | 'error' | 'info'
) => {
  return {
    color: semantic[status],
    background: semantic[`${status}Bg` as keyof typeof semantic],
  };
};

export default {
  brand,
  semantic,
  chart: chartColors,
  crypto,
  light: lightTheme,
  dark: darkTheme,
  Colors,
};
