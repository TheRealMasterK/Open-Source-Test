/**
 * GlassCard Component - Premium Enterprise UI
 * Glass morphism card with blur effect and gradient border
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, BorderRadius, Gradients } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type GlassVariant = 'default' | 'elevated' | 'accent' | 'success' | 'danger' | 'premium';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  style?: ViewStyle;
  onPress?: TouchableOpacityProps['onPress'];
  padding?: keyof typeof Spacing | number;
  noPadding?: boolean;
  borderGradient?: boolean;
  intensity?: number;
}

export function GlassCard({
  children,
  variant = 'default',
  style,
  onPress,
  padding = 'md',
  noPadding = false,
  borderGradient = false,
  intensity = 20,
}: GlassCardProps) {
  const { isDark, shadows } = useTheme();

  console.log('[GlassCard] Rendering with variant:', variant, 'isDark:', isDark);

  const getPadding = (): number => {
    if (noPadding) return 0;
    if (typeof padding === 'number') return padding;
    return Spacing[padding];
  };

  const getBorderGradientColors = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'accent':
      case 'premium':
        return Gradients.mesh1 as unknown as readonly [string, string, ...string[]];
      case 'success':
        return Gradients.success as readonly [string, string];
      case 'danger':
        return Gradients.danger as readonly [string, string];
      default:
        return Gradients.primary as readonly [string, string];
    }
  };

  const getBackgroundColor = (): string => {
    if (isDark) {
      switch (variant) {
        case 'elevated':
          return 'rgba(30, 41, 59, 0.8)';
        case 'accent':
          return 'rgba(0, 163, 246, 0.1)';
        case 'success':
          return 'rgba(16, 185, 129, 0.1)';
        case 'danger':
          return 'rgba(239, 68, 68, 0.1)';
        case 'premium':
          return 'rgba(139, 92, 246, 0.1)';
        default:
          return 'rgba(21, 27, 40, 0.85)';
      }
    } else {
      switch (variant) {
        case 'elevated':
          return 'rgba(255, 255, 255, 0.95)';
        case 'accent':
          return 'rgba(0, 163, 246, 0.08)';
        case 'success':
          return 'rgba(16, 185, 129, 0.08)';
        case 'danger':
          return 'rgba(239, 68, 68, 0.08)';
        case 'premium':
          return 'rgba(139, 92, 246, 0.08)';
        default:
          return 'rgba(255, 255, 255, 0.85)';
      }
    }
  };

  const getBorderColor = (): string => {
    if (isDark) {
      switch (variant) {
        case 'accent':
          return 'rgba(0, 163, 246, 0.3)';
        case 'success':
          return 'rgba(16, 185, 129, 0.3)';
        case 'danger':
          return 'rgba(239, 68, 68, 0.3)';
        case 'premium':
          return 'rgba(139, 92, 246, 0.3)';
        default:
          return 'rgba(255, 255, 255, 0.1)';
      }
    } else {
      switch (variant) {
        case 'accent':
          return 'rgba(0, 163, 246, 0.2)';
        case 'success':
          return 'rgba(16, 185, 129, 0.2)';
        case 'danger':
          return 'rgba(239, 68, 68, 0.2)';
        case 'premium':
          return 'rgba(139, 92, 246, 0.2)';
        default:
          return 'rgba(0, 0, 0, 0.08)';
      }
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    padding: getPadding(),
    borderRadius: BorderRadius.xl,
    borderWidth: borderGradient ? 0 : 1,
    borderColor: getBorderColor(),
    overflow: 'hidden',
  };

  const renderContent = () => (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );

  const renderWithGradientBorder = () => (
    <LinearGradient
      colors={getBorderGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientBorder, { borderRadius: BorderRadius.xl + 1 }]}
    >
      <View
        style={[
          styles.innerCard,
          {
            backgroundColor: isDark ? Colors.dark.card : Colors.light.card,
            padding: getPadding(),
            borderRadius: BorderRadius.xl,
          },
          style,
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[shadows.card, variant === 'elevated' && shadows.cardHover]}
      >
        {borderGradient ? renderWithGradientBorder() : renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[shadows.card, variant === 'elevated' && shadows.cardHover]}>
      {borderGradient ? renderWithGradientBorder() : renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 1.5,
  },
  innerCard: {
    overflow: 'hidden',
  },
});

export default GlassCard;
