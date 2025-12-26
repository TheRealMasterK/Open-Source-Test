/**
 * QIC Trader Typography System
 * Matches Web App Design System - Poppins font family
 */

/**
 * Font Family Configuration
 */
export const fontFamily = {
  primary: 'Poppins',
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

/**
 * Font Sizes - Matches Web App Type Scale
 */
export const fontSize = {
  // Extra small
  xxs: 10,
  xs: 12,
  // Small
  sm: 14,
  // Base/Default
  md: 16,
  base: 16,
  // Large
  lg: 18,
  // Extra Large
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

/**
 * Line Heights
 */
export const lineHeight = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
} as const;

/**
 * Typography Variants - Pre-configured text styles
 */
export const typography = {
  // Display - Hero headlines
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight.tight,
  },

  // H1 - Page titles
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight.snug,
  },

  // H2 - Section headers
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.snug,
  },

  // H3 - Card titles
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.normal,
  },

  // H4 - Subsections
  h4: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.normal,
  },

  // H5 - Labels
  h5: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.relaxed,
  },

  // Body Large - Lead text
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.loose,
  },

  // Body - Default text
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.loose,
  },

  // Body Small - Secondary text
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.relaxed,
  },

  // Caption - Captions, hints
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
  },

  // Overline - Labels, tags
  overline: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    lineHeight: lineHeight.snug,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },

  // Button text
  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
  },

  // Button small
  buttonSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },

  // Input text
  input: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
  },

  // Label
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },
} as const;

/**
 * Legacy fonts export (backward compatibility)
 */
export const fonts = {
  primary: fontFamily.primary,
  regular: fontFamily.regular,
  bold: fontFamily.bold,
  medium: fontFamily.medium,

  weights: fontWeights,
  sizes: fontSize,

  // Legacy style function
  style: (
    size: number = 16,
    weight: string = 'regular',
    _isItalic: boolean = false
  ): { fontFamily: string; fontSize: number } => {
    let family: string = fontFamily.regular;

    if (weight === '700' || weight === 'bold') {
      family = fontFamily.bold;
    } else if (weight === '600' || weight === 'semiBold') {
      family = fontFamily.semiBold;
    } else if (weight === '500' || weight === 'medium') {
      family = fontFamily.medium;
    }

    return {
      fontFamily: family,
      fontSize: size,
    };
  },
};

export default {
  fontFamily,
  fontWeights,
  fontSize,
  lineHeight,
  typography,
  fonts,
};
