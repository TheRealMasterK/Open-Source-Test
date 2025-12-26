/**
 * useTheme Hook - Enterprise Grade
 * Custom hook for managing app theme (light/dark mode)
 * Provides access to all design tokens
 */

import { useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store';
import { setTheme, ThemeMode, selectTheme } from '@/store/slices/uiSlice';
import {
  Colors,
  Gradients,
  Spacing,
  FontSize,
  FontFamily,
  FontWeight,
  LineHeight,
  Shadows,
  ShadowsDark,
  BorderRadius,
  Animation,
  Blur,
  IconSize,
  AvatarSize,
  ButtonHeight,
  InputHeight,
  ZIndex,
  Opacity,
} from '@/config/theme';

export function useTheme() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectTheme);
  const systemColorScheme = useColorScheme();

  /**
   * Get the effective theme (resolves 'system' to actual theme)
   */
  const effectiveTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme || 'dark';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  /**
   * Check if current theme is dark
   */
  const isDark = effectiveTheme === 'dark';

  /**
   * Get current color palette
   */
  const currentColors = useMemo(() => {
    return {
      ...Colors,
      ...(isDark ? Colors.dark : Colors.light),
    };
  }, [isDark]);

  /**
   * Get theme-aware shadows
   */
  const currentShadows = useMemo(() => {
    return isDark ? ShadowsDark : Shadows;
  }, [isDark]);

  /**
   * Get theme-aware gradients
   */
  const currentGradients = useMemo(() => {
    return {
      ...Gradients,
      glass: isDark ? Gradients.glassDark : Gradients.glassLight,
      card: isDark ? Gradients.darkCard : ['#FFFFFF', '#F8FAFC'],
      elevated: isDark ? Gradients.darkElevated : ['#FFFFFF', '#FFFFFF'],
    };
  }, [isDark]);

  /**
   * Set theme mode
   */
  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      console.log('[useTheme] Setting theme mode:', mode);
      dispatch(setTheme(mode));
    },
    [dispatch]
  );

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    console.log('[useTheme] Toggling theme to:', newTheme);
    dispatch(setTheme(newTheme));
  }, [isDark, dispatch]);

  /**
   * Get themed styles helper
   */
  const getThemedStyle = useCallback(
    <T extends Record<string, unknown>>(lightStyle: T, darkStyle: T): T => {
      return isDark ? darkStyle : lightStyle;
    },
    [isDark]
  );

  /**
   * Get color by name with theme awareness
   */
  const getColor = useCallback(
    (colorKey: keyof typeof Colors.light) => {
      return isDark ? Colors.dark[colorKey] : Colors.light[colorKey];
    },
    [isDark]
  );

  /**
   * Get gradient by name
   */
  const getGradient = useCallback(
    (gradientKey: keyof typeof Gradients) => {
      return Gradients[gradientKey];
    },
    []
  );

  /**
   * Full theme object for convenience
   */
  const theme = useMemo(
    () => ({
      colors: currentColors,
      gradients: currentGradients,
      spacing: Spacing,
      fontSize: FontSize,
      fontFamily: FontFamily,
      fontWeight: FontWeight,
      lineHeight: LineHeight,
      shadows: currentShadows,
      borderRadius: BorderRadius,
      animation: Animation,
      blur: Blur,
      iconSize: IconSize,
      avatarSize: AvatarSize,
      buttonHeight: ButtonHeight,
      inputHeight: InputHeight,
      zIndex: ZIndex,
      opacity: Opacity,
      isDark,
    }),
    [currentColors, currentGradients, currentShadows, isDark]
  );

  return {
    // Current state
    themeMode,
    effectiveTheme,
    isDark,

    // Colors and styles
    colors: currentColors,
    gradients: currentGradients,
    spacing: Spacing,
    fontSize: FontSize,
    fontFamily: FontFamily,
    fontWeight: FontWeight,
    lineHeight: LineHeight,
    shadows: currentShadows,
    borderRadius: BorderRadius,
    animation: Animation,
    blur: Blur,
    iconSize: IconSize,
    avatarSize: AvatarSize,
    buttonHeight: ButtonHeight,
    inputHeight: InputHeight,
    zIndex: ZIndex,
    opacity: Opacity,

    // Full theme object
    theme,

    // Actions
    setTheme: setThemeMode,
    toggleTheme,

    // Helpers
    getThemedStyle,
    getColor,
    getGradient,
  };
}

export default useTheme;
