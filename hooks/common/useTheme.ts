/**
 * useTheme Hook
 * Custom hook for managing app theme (light/dark mode)
 */

import { useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store';
import { setTheme, ThemeMode } from '@/store/slices/uiSlice';
import { Colors, Spacing, FontSize, FontFamily, Shadows, BorderRadius } from '@/config/theme';

export function useTheme() {
  const dispatch = useAppDispatch();
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const systemColorScheme = useColorScheme();

  /**
   * Get the effective theme (resolves 'system' to actual theme)
   */
  const effectiveTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme || 'light';
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
   * Full theme object for convenience
   */
  const theme = useMemo(
    () => ({
      colors: currentColors,
      spacing: Spacing,
      fontSize: FontSize,
      fontFamily: FontFamily,
      shadows: Shadows,
      borderRadius: BorderRadius,
      isDark,
    }),
    [currentColors, isDark]
  );

  return {
    // Current state
    themeMode,
    effectiveTheme,
    isDark,

    // Colors and styles
    colors: currentColors,
    spacing: Spacing,
    fontSize: FontSize,
    fontFamily: FontFamily,
    shadows: Shadows,
    borderRadius: BorderRadius,

    // Full theme object
    theme,

    // Actions
    setTheme: setThemeMode,
    toggleTheme,

    // Helpers
    getThemedStyle,
    getColor,
  };
}

export default useTheme;
