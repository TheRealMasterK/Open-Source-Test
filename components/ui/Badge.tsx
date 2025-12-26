/**
 * Badge Component
 * Status badges and labels
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'primary';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  outline?: boolean;
}

export function Badge({
  text,
  variant = 'default',
  size = 'sm',
  style,
  textStyle,
  outline = false,
}: BadgeProps) {
  const { colors } = useTheme();

  const getColors = (): { bg: string; text: string; border: string } => {
    switch (variant) {
      case 'success':
        return {
          bg: outline ? 'transparent' : Colors.success.DEFAULT + '20',
          text: Colors.success.DEFAULT,
          border: Colors.success.DEFAULT,
        };
      case 'danger':
        return {
          bg: outline ? 'transparent' : Colors.danger.DEFAULT + '20',
          text: Colors.danger.DEFAULT,
          border: Colors.danger.DEFAULT,
        };
      case 'warning':
        return {
          bg: outline ? 'transparent' : Colors.warning.DEFAULT + '20',
          text: Colors.warning.dark,
          border: Colors.warning.DEFAULT,
        };
      case 'info':
        return {
          bg: outline ? 'transparent' : Colors.info.DEFAULT + '20',
          text: Colors.info.DEFAULT,
          border: Colors.info.DEFAULT,
        };
      case 'primary':
        return {
          bg: outline ? 'transparent' : Colors.primary.DEFAULT + '20',
          text: Colors.primary.DEFAULT,
          border: Colors.primary.DEFAULT,
        };
      default:
        return {
          bg: outline ? 'transparent' : colors.surfaceSecondary,
          text: colors.textSecondary,
          border: colors.border,
        };
    }
  };

  const badgeColors = getColors();

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'md':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.xs,
        };
      default:
        return {
          paddingHorizontal: Spacing.sm,
          paddingVertical: 2,
        };
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getSizeStyles(),
        {
          backgroundColor: badgeColors.bg,
          borderColor: outline ? badgeColors.border : 'transparent',
          borderWidth: outline ? 1 : 0,
        },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: badgeColors.text,
            fontSize: size === 'md' ? FontSize.sm : FontSize.xs,
          },
          textStyle,
        ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;
