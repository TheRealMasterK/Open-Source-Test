/**
 * Button Component
 * Reusable button with variants and loading state
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...rest
}: ButtonProps) {
  const { isDark } = useTheme();

  const isDisabled = disabled || loading;

  const getBackgroundColor = (): string => {
    if (isDisabled) {
      return isDark ? Colors.dark.surfaceSecondary : Colors.light.surfaceSecondary;
    }

    switch (variant) {
      case 'primary':
        return Colors.primary.DEFAULT;
      case 'secondary':
        return isDark ? Colors.dark.surface : Colors.light.surface;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return Colors.danger.DEFAULT;
      default:
        return Colors.primary.DEFAULT;
    }
  };

  const getTextColor = (): string => {
    if (isDisabled) {
      return isDark ? Colors.dark.textTertiary : Colors.light.textTertiary;
    }

    switch (variant) {
      case 'primary':
      case 'danger':
        return Colors.white;
      case 'secondary':
        return isDark ? Colors.dark.text : Colors.light.text;
      case 'outline':
        return Colors.primary.DEFAULT;
      case 'ghost':
        return isDark ? Colors.dark.text : Colors.light.text;
      default:
        return Colors.white;
    }
  };

  const getBorderColor = (): string => {
    if (variant === 'outline') {
      return isDisabled
        ? isDark
          ? Colors.dark.border
          : Colors.light.border
        : Colors.primary.DEFAULT;
    }
    return 'transparent';
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.md,
          minHeight: 36,
        };
      case 'lg':
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.xl,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.lg,
          minHeight: 48,
        };
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return FontSize.sm;
      case 'lg':
        return FontSize.lg;
      default:
        return FontSize.base;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        getSizeStyles(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getTextSize(),
                marginLeft: leftIcon ? Spacing.xs : 0,
                marginRight: rightIcon ? Spacing.xs : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
