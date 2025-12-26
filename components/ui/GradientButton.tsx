/**
 * GradientButton Component - Premium Enterprise UI
 * Button with gradient background and glow effect
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Colors,
  Spacing,
  FontSize,
  FontFamily,
  BorderRadius,
  Gradients,
  ButtonHeight,
} from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type GradientVariant = 'primary' | 'success' | 'danger' | 'warning' | 'premium' | 'gold' | 'buy' | 'sell';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface GradientButtonProps {
  title: string;
  variant?: GradientVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  glow?: boolean;
}

export function GradientButton({
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
  glow = true,
}: GradientButtonProps) {
  const { isDark, shadows } = useTheme();

  console.log('[GradientButton] Rendering:', { variant, size, loading, disabled });

  const isDisabled = disabled || loading;

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    if (isDisabled) {
      return isDark
        ? ['#374151', '#1F2937'] as const
        : ['#D1D5DB', '#9CA3AF'] as const;
    }

    switch (variant) {
      case 'success':
        return Gradients.success as readonly [string, string];
      case 'danger':
        return Gradients.danger as readonly [string, string];
      case 'warning':
        return Gradients.warning as readonly [string, string];
      case 'premium':
        return ['#8B5CF6', '#7C3AED'] as const;
      case 'gold':
        return Gradients.gold as readonly [string, string];
      case 'buy':
        return Gradients.buy as readonly [string, string];
      case 'sell':
        return Gradients.sell as readonly [string, string];
      default:
        return Gradients.primary as readonly [string, string];
    }
  };

  const getGlowShadow = () => {
    if (isDisabled || !glow) return {};

    switch (variant) {
      case 'success':
        return shadows.glowSuccess;
      case 'danger':
        return shadows.glowDanger;
      default:
        return shadows.glow;
    }
  };

  const getHeight = (): number => {
    return ButtonHeight[size];
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'xs':
        return FontSize.xs;
      case 'sm':
        return FontSize.sm;
      case 'lg':
        return FontSize.lg;
      case 'xl':
        return FontSize.xl;
      default:
        return FontSize.base;
    }
  };

  const getPaddingHorizontal = (): number => {
    switch (size) {
      case 'xs':
        return Spacing.sm;
      case 'sm':
        return Spacing.md;
      case 'lg':
        return Spacing.xl;
      case 'xl':
        return Spacing['2xl'];
      default:
        return Spacing.lg;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        glow && !isDisabled && getGlowShadow(),
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            height: getHeight(),
            paddingHorizontal: getPaddingHorizontal(),
            borderRadius: BorderRadius.lg,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text
              style={[
                styles.text,
                {
                  fontSize: getTextSize(),
                  color: isDisabled ? Colors.dark.textTertiary : Colors.white,
                },
                textStyle,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {title}
            </Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: BorderRadius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  text: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default GradientButton;
