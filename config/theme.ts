/**
 * Theme Configuration - Enterprise Grade
 * Single source of truth for colors, spacing, shadows
 * Premium QicTrader Design System
 */

export const Colors = {
  // Primary Brand Color - Cyan Blue (Premium)
  primary: {
    DEFAULT: '#00A3F6',
    dark: '#0284c7',
    light: '#38bdf8',
    lighter: '#7DD3FC',
    50: '#e6f7ff',
    100: '#b3e5fc',
    500: '#00A3F6',
    600: '#0284c7',
    700: '#006494',
    900: '#003554',
  },

  // Secondary - Orange/Coral for Sell actions
  secondary: {
    DEFAULT: '#F97316',
    light: '#FB923C',
    dark: '#EA580C',
    lighter: '#FDBA74',
  },

  // Premium Accent Colors
  accent: {
    gold: '#FFD700',
    goldDark: '#B8860B',
    goldLight: '#FFE55C',
    platinum: '#E5E4E2',
    purple: '#8B5CF6',
    purpleLight: '#A78BFA',
    pink: '#EC4899',
    pinkLight: '#F472B6',
    teal: '#14B8A6',
    tealLight: '#2DD4BF',
  },

  // Status Colors
  success: {
    DEFAULT: '#10B981',
    light: '#34D399',
    dark: '#059669',
    bg: 'rgba(16, 185, 129, 0.15)',
    bgSolid: '#ECFDF5',
  },
  danger: {
    DEFAULT: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    bg: 'rgba(239, 68, 68, 0.15)',
    bgSolid: '#FEF2F2',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    bg: 'rgba(245, 158, 11, 0.15)',
    bgSolid: '#FFFBEB',
  },
  info: {
    DEFAULT: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    bg: 'rgba(59, 130, 246, 0.15)',
    bgSolid: '#EFF6FF',
  },

  // Trade Action Colors
  buy: {
    DEFAULT: '#00A3F6',
    bg: 'rgba(0, 163, 246, 0.15)',
    bgSolid: '#E6F7FF',
  },
  sell: {
    DEFAULT: '#F97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    bgSolid: '#FFF7ED',
  },

  // Cryptocurrency Colors
  crypto: {
    USDT: '#26A17B',
    BTC: '#F7931A',
    ETH: '#627EEA',
    ZAR: '#007A4D',
    SOL: '#9945FF',
    BNB: '#F3BA2F',
    XRP: '#23292F',
    USDC: '#2775CA',
  },

  // Chart Colors
  chart: {
    light: {
      1: '#00A3F6',
      2: '#10B981',
      3: '#F59E0B',
      4: '#8B5CF6',
      5: '#EC4899',
      6: '#14B8A6',
    },
    dark: {
      1: '#00A3F6',
      2: '#34D399',
      3: '#FBBF24',
      4: '#A78BFA',
      5: '#F472B6',
      6: '#2DD4BF',
    },
  },

  // Light Theme - Clean white design
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundGray: '#F1F5F9',
    backgroundGrayLight: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    surfaceHover: '#E2E8F0',
    surfacePressed: '#CBD5E1',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    cardGlass: 'rgba(255, 255, 255, 0.85)',
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textPlaceholder: '#6B7280', // Improved contrast (4.5:1 on light bg)
    textDisabled: '#CBD5E1',
    border: '#E2E8F0',
    borderSubtle: 'rgba(0, 0, 0, 0.08)',
    borderLight: '#F1F5F9',
    borderFocus: '#00A3F6',
    input: '#F1F5F9',
    inputBg: '#F8FAFC',
    inputBorder: '#E2E8F0',
    ring: '#00A3F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    avatarBg: '#DBEAFE',
    avatarText: '#2563EB',
    badgeBg: '#F1F5F9',
    badgeText: '#475569',
    navBg: '#FFFFFF',
    tabBarBg: '#FFFFFF',
    shimmer: '#E2E8F0',
    shimmerHighlight: '#F8FAFC',
    divider: '#E2E8F0',
    skeleton: '#E2E8F0',
  },

  // Dark Theme - QicTrader Navy Blue (Premium)
  dark: {
    background: '#0A0E17',
    backgroundSecondary: '#0F1419',
    backgroundGray: '#111827',
    backgroundGrayLight: '#1F2937',
    surface: '#151B28',
    surfaceSecondary: '#1E293B',
    surfaceHover: '#2D3B4F',
    surfacePressed: '#334155',
    card: '#151B28',
    cardElevated: '#1E293B',
    cardGlass: 'rgba(21, 27, 40, 0.85)',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textPlaceholder: '#6B7280', // Improved contrast (visible on dark bg)
    textDisabled: '#374151',
    border: 'rgba(255, 255, 255, 0.1)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',
    borderLight: '#1E293B',
    borderFocus: '#00A3F6',
    input: '#1E293B',
    inputBg: '#151B28',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    ring: '#00A3F6',
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.6)',
    avatarBg: 'rgba(0, 163, 246, 0.2)',
    avatarText: '#00A3F6',
    badgeBg: '#1E293B',
    badgeText: '#94A3B8',
    navBg: '#0A0E17',
    tabBarBg: '#0F1419',
    shimmer: '#1E293B',
    shimmerHighlight: '#2D3B4F',
    divider: 'rgba(255, 255, 255, 0.1)',
    skeleton: '#1E293B',
  },

  // Common Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Premium Gradients
export const Gradients = {
  // Primary Gradients
  primary: ['#00A3F6', '#0284c7'],
  primaryDiagonal: ['#38bdf8', '#00A3F6', '#0284c7'],
  primarySoft: ['rgba(0, 163, 246, 0.2)', 'rgba(2, 132, 199, 0.1)'],

  // Premium Gradients
  gold: ['#FFD700', '#B8860B'],
  goldSoft: ['rgba(255, 215, 0, 0.2)', 'rgba(184, 134, 11, 0.1)'],
  platinum: ['#E5E4E2', '#BCC6CC'],

  // Status Gradients
  success: ['#34D399', '#10B981'],
  danger: ['#F87171', '#EF4444'],
  warning: ['#FBBF24', '#F59E0B'],

  // Trade Gradients
  buy: ['#38bdf8', '#00A3F6'],
  sell: ['#FB923C', '#F97316'],

  // Crypto Gradients
  btc: ['#FFB347', '#F7931A'],
  eth: ['#8B9DC3', '#627EEA'],
  usdt: ['#50C878', '#26A17B'],

  // Premium Dark Gradients
  darkCard: ['#1E293B', '#151B28'],
  darkElevated: ['#2D3B4F', '#1E293B'],
  darkNavy: ['#151B28', '#0A0E17'],

  // Glass Gradients (for glass morphism)
  glassLight: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
  glassDark: ['rgba(21, 27, 40, 0.9)', 'rgba(15, 20, 25, 0.8)'],

  // Mesh Gradients (multi-color premium)
  mesh1: ['#00A3F6', '#8B5CF6', '#EC4899'],
  mesh2: ['#10B981', '#14B8A6', '#00A3F6'],
  mesh3: ['#F59E0B', '#F97316', '#EF4444'],

  // Hero/Feature Gradients
  hero: ['#0A0E17', '#151B28', '#1E293B'],
  heroAccent: ['rgba(0, 163, 246, 0.3)', 'rgba(139, 92, 246, 0.2)', 'transparent'],
} as const;

export const Spacing = {
  0: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
  '6xl': 128,
} as const;

export const FontSize = {
  xxs: 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 64,
} as const;

export const FontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
} as const;

export const LineHeight = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
} as const;

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
} as const;

// Enhanced Shadows for Enterprise UI
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
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
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.2,
    shadowRadius: 35,
    elevation: 15,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  button: {
    shadowColor: '#00A3F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#00A3F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  glowSuccess: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  glowDanger: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  inner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 0,
  },
} as const;

export const ShadowsDark = {
  none: Shadows.none,
  xs: {
    ...Shadows.xs,
    shadowOpacity: 0.3,
  },
  sm: {
    ...Shadows.sm,
    shadowOpacity: 0.4,
  },
  md: {
    ...Shadows.md,
    shadowOpacity: 0.5,
  },
  lg: {
    ...Shadows.lg,
    shadowOpacity: 0.6,
  },
  xl: {
    ...Shadows.xl,
    shadowOpacity: 0.7,
  },
  '2xl': {
    ...Shadows['2xl'],
    shadowOpacity: 0.8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  button: {
    shadowColor: '#00A3F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: '#00A3F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },
  glowSuccess: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },
  glowDanger: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },
  inner: Shadows.inner,
} as const;

// Animation Durations
export const Animation = {
  duration: {
    instant: 0,
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 800,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const;

// Blur values for glass morphism
export const Blur = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 40,
} as const;

export const IconSize = {
  xxs: 10,
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

export const AvatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
  '3xl': 96,
  '4xl': 128,
} as const;

export const ButtonHeight = {
  xs: 32,
  sm: 36,
  md: 44,
  lg: 52,
  xl: 60,
} as const;

export const InputHeight = {
  sm: 40,
  md: 48,
  lg: 56,
  xl: 64,
} as const;

// Layout Constants - for consistent screen layouts
export const Layout = {
  // Screen padding
  screenPaddingHorizontal: 16, // Spacing.md
  screenPaddingVertical: 24, // Spacing.lg

  // Card padding
  cardPadding: 16, // Spacing.md
  cardPaddingLarge: 24, // Spacing.lg

  // Tab bar heights (platform-specific in actual usage)
  tabBarHeightIOS: 88,
  tabBarHeightAndroid: 64,

  // Header heights
  headerHeight: 56,
  headerHeightLarge: 96,

  // Bottom safe area padding
  bottomSafeArea: 32, // Spacing.xl

  // Max content width (for tablets)
  maxContentWidth: 600,

  // Grid
  gridGutter: 8, // Spacing.sm
  gridColumns: 2,

  // Touch targets (accessibility)
  minTouchTarget: 44,

  // Animation
  animationDuration: 200,
  animationDurationSlow: 300,
} as const;

// Z-Index scale
export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
  max: 100,
} as const;

// Opacity values
export const Opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  80: 0.8,
  90: 0.9,
  100: 1,
} as const;

export const Theme = {
  colors: Colors,
  gradients: Gradients,
  spacing: Spacing,
  fontSize: FontSize,
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  lineHeight: LineHeight,
  borderRadius: BorderRadius,
  shadows: Shadows,
  shadowsDark: ShadowsDark,
  animation: Animation,
  blur: Blur,
  iconSize: IconSize,
  avatarSize: AvatarSize,
  buttonHeight: ButtonHeight,
  inputHeight: InputHeight,
  layout: Layout,
  zIndex: ZIndex,
  opacity: Opacity,
} as const;

/**
 * Helper to get theme-specific colors
 */
export const getThemeColors = (isDark: boolean) => {
  return isDark ? Colors.dark : Colors.light;
};

/**
 * Helper to get theme-specific shadows
 */
export const getThemeShadows = (isDark: boolean) => {
  return isDark ? ShadowsDark : Shadows;
};

/**
 * Helper to get chart colors for current theme
 */
export const getChartColors = (isDark: boolean) => {
  return isDark ? Colors.chart.dark : Colors.chart.light;
};

/**
 * Helper to get gradient for current theme
 */
export const getGradient = (name: keyof typeof Gradients) => {
  return Gradients[name];
};

export default Theme;
