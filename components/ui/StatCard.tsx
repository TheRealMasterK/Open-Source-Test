/**
 * StatCard Component - Premium Enterprise UI
 * Dashboard stat card with trend indicators and premium styling
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  FontSize,
  FontFamily,
  BorderRadius,
  Gradients,
} from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type StatVariant = 'default' | 'gradient' | 'outlined' | 'glass';
type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    direction: TrendDirection;
    value: string;
    label?: string;
  };
  icon?: React.ReactNode;
  iconBgColor?: string;
  variant?: StatVariant;
  gradientColors?: readonly [string, string, ...string[]];
  onPress?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  icon,
  iconBgColor,
  variant = 'default',
  gradientColors,
  onPress,
  style,
  compact = false,
}: StatCardProps) {
  const { isDark, colors, shadows } = useTheme();

  console.log('[StatCard] Rendering:', { label, value, variant, trend });

  const getTrendColor = (): string => {
    if (!trend) return colors.textSecondary;
    switch (trend.direction) {
      case 'up':
        return Colors.success.DEFAULT;
      case 'down':
        return Colors.danger.DEFAULT;
      default:
        return colors.textSecondary;
    }
  };

  const getTrendIcon = (): keyof typeof Ionicons.glyphMap => {
    if (!trend) return 'remove';
    switch (trend.direction) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  const renderContent = () => (
    <>
      <View style={styles.header}>
        {icon && (
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconBgColor || (isDark
                  ? 'rgba(0, 163, 246, 0.15)'
                  : 'rgba(0, 163, 246, 0.1)'),
              },
            ]}
          >
            {icon}
          </View>
        )}
        <Text
          style={[
            styles.label,
            {
              color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
              fontSize: compact ? FontSize.xs : FontSize.sm,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      <View style={styles.valueContainer}>
        <Text
          style={[
            styles.value,
            {
              color: variant === 'gradient' ? Colors.white : colors.text,
              fontSize: compact ? FontSize.xl : FontSize['2xl'],
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
        {subValue && (
          <Text
            style={[
              styles.subValue,
              {
                color: variant === 'gradient' ? 'rgba(255,255,255,0.7)' : colors.textTertiary,
              },
            ]}
          >
            {subValue}
          </Text>
        )}
      </View>

      {trend && (
        <View style={styles.trendContainer}>
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor:
                  trend.direction === 'up'
                    ? Colors.success.bg
                    : trend.direction === 'down'
                    ? Colors.danger.bg
                    : 'transparent',
              },
            ]}
          >
            <Ionicons
              name={getTrendIcon()}
              size={14}
              color={getTrendColor()}
            />
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>
              {trend.value}
            </Text>
          </View>
          {trend.label && (
            <Text
              style={[
                styles.trendLabel,
                {
                  color: variant === 'gradient' ? 'rgba(255,255,255,0.6)' : colors.textTertiary,
                },
              ]}
            >
              {trend.label}
            </Text>
          )}
        </View>
      )}
    </>
  );

  const baseStyle: ViewStyle = {
    padding: compact ? Spacing.md : Spacing.lg,
    borderRadius: BorderRadius.xl,
    minHeight: compact ? 100 : 130,
    ...shadows.card,
  };

  if (variant === 'gradient') {
    const colors = gradientColors || (Gradients.primary as readonly [string, string]);
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.85 : 1}
        style={[shadows.button, style]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, baseStyle]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={[
        styles.card,
        baseStyle,
        {
          backgroundColor: isDark ? colors.card : colors.card,
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: isDark ? colors.border : colors.border,
        },
        variant === 'glass' && {
          backgroundColor: isDark ? colors.cardGlass : colors.cardGlass,
        },
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  label: {
    fontFamily: FontFamily.medium,
    flex: 1,
  },
  valueContainer: {
    marginBottom: Spacing.xs,
  },
  value: {
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginTop: Spacing.xxs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  trendValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    marginLeft: Spacing.xxs,
  },
  trendLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    marginLeft: Spacing.sm,
  },
});

export default StatCard;
