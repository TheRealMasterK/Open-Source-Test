/**
 * IconButton Component
 * Button with only an icon
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';

interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  loading?: boolean;
  style?: ViewStyle;
}

const sizeMap = {
  sm: { button: 32, icon: 18 },
  md: { button: 40, icon: 22 },
  lg: { button: 48, icon: 26 },
};

export function IconButton({
  icon,
  size = 'md',
  variant = 'default',
  loading = false,
  disabled,
  style,
  onPress,
  ...rest
}: IconButtonProps) {
  const { isDark, colors } = useTheme();

  const dimensions = sizeMap[size];
  const isDisabled = disabled || loading;

  const getBackgroundColor = (): string => {
    if (isDisabled) {
      return isDark ? Colors.dark.surfaceSecondary : Colors.light.surfaceSecondary;
    }

    switch (variant) {
      case 'primary':
        return Colors.primary.DEFAULT;
      case 'danger':
        return Colors.danger.DEFAULT;
      case 'ghost':
        return 'transparent';
      default:
        return colors.surface;
    }
  };

  const getIconColor = (): string => {
    if (isDisabled) {
      return colors.textTertiary;
    }

    switch (variant) {
      case 'primary':
      case 'danger':
        return Colors.white;
      case 'ghost':
        return colors.textSecondary;
      default:
        return colors.text;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          width: dimensions.button,
          height: dimensions.button,
          borderRadius: dimensions.button / 2,
          backgroundColor: getBackgroundColor(),
        },
        variant === 'default' && {
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <Ionicons
          name={icon}
          size={dimensions.icon}
          color={getIconColor()}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
