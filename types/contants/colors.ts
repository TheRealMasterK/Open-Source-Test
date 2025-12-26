/**
 * Color Types - Matches Web App Design System
 */

export interface BrandColors {
  blue: string;
  blueLight: string;
  blueDark: string;
  blueBg: string;
  green: string;
  greenDark: string;
  red: string;
  redDark: string;
}

export interface SemanticColors {
  success: string;
  successBg: string;
  successDark: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;
}

export interface ChartColors {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface CryptoColors {
  usdt: string;
  btc: string;
  eth: string;
}

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  backgroundGray: string;
  backgroundGrayLight: string;
  foreground: string;
  card: string;
  cardForeground: string;
  cardElevated: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  borderSubtle: string;
  input: string;
  inputBg: string;
  inputBorder: string;
  ring: string;
  surface: string;
  surfaceHover: string;
  surfaceDark: string;
  textSecondary: string;
  textTertiary: string;
  textPlaceholder: string;
  avatarBg: string;
  avatarText: string;
  badgeBg: string;
  badgeText: string;
  tableHeader: string;
  tableRowHover: string;
  overlay: string;
}

export interface ColorScheme {
  light: ThemeColors;
  dark: ThemeColors;
  brand: BrandColors;
  semantic: SemanticColors;
  chart: ChartColors;
  crypto: CryptoColors;
}

// Legacy Props type for backward compatibility
export type Props = {
  primary: string;
  black: string;
  grey: string;
  lightGrey: string;
  gray: string;
  secondary: string;
  white: string;
  red: string;
  orange: string;
  success: string;
};
