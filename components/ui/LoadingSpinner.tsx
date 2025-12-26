/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, FontSize } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type SpinnerSize = 'small' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  overlay?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  color,
  text,
  fullScreen = false,
  style,
  overlay = false,
}: LoadingSpinnerProps) {
  const { colors, isDark } = useTheme();

  const spinnerColor = color || Colors.primary.DEFAULT;

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: colors.background }, style]}>
        <ActivityIndicator size={size} color={spinnerColor} />
        {text && <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>}
      </View>
    );
  }

  if (overlay) {
    return (
      <View
        style={[
          styles.overlay,
          { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)' },
          style,
        ]}>
        <View style={[styles.overlayContent, { backgroundColor: colors.surface }]}>
          <ActivityIndicator size={size} color={spinnerColor} />
          {text && <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  overlayContent: {
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
