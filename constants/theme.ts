/**
 * QIC Trader Theme Configuration
 * Single source of truth for design tokens
 * Matches Web App Design System
 */

import { brand, semantic, lightTheme, darkTheme, crypto, chartColors } from './colors';
import { fontFamily, fontSize, lineHeight, typography } from './fonts';

/**
 * Spacing System - 4px base unit
 */
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

/**
 * Border Radius - Matches Web App
 */
export const borderRadius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

/**
 * Shadows for Light Mode
 */
export const shadowsLight = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
} as const;

/**
 * Shadows for Dark Mode
 */
export const shadowsDark = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 10,
  },
} as const;

/**
 * Z-Index Scale
 */
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  overlay: 90,
  max: 100,
} as const;

/**
 * Animation Durations (ms)
 */
export const duration = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

/**
 * Touch Target Sizes (accessibility)
 */
export const hitSlop = {
  small: { top: 8, right: 8, bottom: 8, left: 8 },
  medium: { top: 12, right: 12, bottom: 12, left: 12 },
  large: { top: 16, right: 16, bottom: 16, left: 16 },
} as const;

/**
 * Icon Sizes
 */
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

/**
 * Avatar Sizes
 */
export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
  '3xl': 96,
} as const;

/**
 * Button Heights
 */
export const buttonHeight = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
} as const;

/**
 * Input Heights
 */
export const inputHeight = {
  sm: 36,
  md: 44,
  lg: 52,
} as const;

/**
 * Complete Theme Object
 */
export const theme = {
  colors: {
    brand,
    semantic,
    crypto,
    chart: chartColors,
    light: lightTheme,
    dark: darkTheme,
  },
  typography: {
    fontFamily,
    fontSize,
    lineHeight,
    variants: typography,
  },
  spacing,
  borderRadius,
  shadows: {
    light: shadowsLight,
    dark: shadowsDark,
  },
  zIndex,
  duration,
  hitSlop,
  iconSize,
  avatarSize,
  buttonHeight,
  inputHeight,
} as const;

/**
 * Get theme-specific values
 */
export const getTheme = (isDark: boolean) => ({
  colors: isDark ? darkTheme : lightTheme,
  shadows: isDark ? shadowsDark : shadowsLight,
  chartColors: isDark ? chartColors.dark : chartColors.light,
  ...theme.typography,
  spacing,
  borderRadius,
  zIndex,
  duration,
  hitSlop,
  iconSize,
  avatarSize,
  buttonHeight,
  inputHeight,
});

export default theme;
