/**
 * Card Component
 * Reusable card container with variants
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: TouchableOpacityProps['onPress'];
  padding?: keyof typeof Spacing | number;
  noPadding?: boolean;
}

export function Card({
  children,
  variant = 'default',
  style,
  onPress,
  padding = 'md',
  noPadding = false,
}: CardProps) {
  const { isDark } = useTheme();

  const getBackgroundColor = (): string => {
    return isDark ? Colors.dark.surface : Colors.light.surface;
  };

  const getBorderColor = (): string => {
    return isDark ? Colors.dark.border : Colors.light.border;
  };

  const getPadding = (): number => {
    if (noPadding) return 0;
    if (typeof padding === 'number') return padding;
    return Spacing[padding];
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    padding: getPadding(),
    borderRadius: BorderRadius.lg,
    ...(variant === 'outlined' && {
      borderWidth: 1,
      borderColor: getBorderColor(),
    }),
    ...(variant === 'elevated' && {
      ...(isDark ? {} : Shadows.md),
    }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.card, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
