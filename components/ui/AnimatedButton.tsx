/**
 * AnimatedButton Component
 * A button with press animation feedback for better UX
 */

import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  Animated,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, ButtonHeight } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: AnimatedButtonProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  console.log('[AnimatedButton] Rendering:', title, variant, size);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
      tension: 300,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 300,
    }).start();
  }, [scaleAnim]);

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: ButtonHeight[size],
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: Spacing.sm,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: Colors.primary.DEFAULT };
      case 'secondary':
        return { ...baseStyle, backgroundColor: Colors.secondary.DEFAULT };
      case 'outline':
        return { ...baseStyle, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border };
      case 'ghost':
        return { ...baseStyle, backgroundColor: 'transparent' };
      case 'danger':
        return { ...baseStyle, backgroundColor: Colors.danger.DEFAULT };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'sm' ? FontSize.sm : size === 'xl' ? FontSize.lg : FontSize.base,
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return { ...baseStyle, color: Colors.white };
      case 'outline':
      case 'ghost':
        return { ...baseStyle, color: colors.text };
      default:
        return baseStyle;
    }
  };

  const iconColor = ['primary', 'secondary', 'danger'].includes(variant) ? Colors.white : colors.text;
  const iconSize = size === 'sm' ? 16 : size === 'xl' ? 24 : 20;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && styles.fullWidth, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          getButtonStyles(),
          disabled && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator color={iconColor} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons name={icon} size={iconSize} color={iconColor} />
            )}
            <Text style={[getTextStyles(), textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Ionicons name={icon} size={iconSize} color={iconColor} />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

export default AnimatedButton;
