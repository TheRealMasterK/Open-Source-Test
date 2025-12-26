/**
 * StatsOverview Component - Premium Enterprise Design
 * Dashboard stats grid with unique accent colors and premium styling
 */

import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { AnimatedView, GlassCard, SkeletonCard } from '@/components/ui';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - Spacing.sm) / 2;

interface StatItem {
  id: string;
  icon: string;
  value: number | string;
  label: string;
  subtitle?: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
  isLoading?: boolean;
  selectedPeriod?: string;
  onPeriodChange?: () => void;
}

// Premium stat configurations with unique accent colors
const STAT_CONFIG: Record<string, {
  color: string;
  bgColor: string;
  gradient: readonly [string, string];
  icon: keyof typeof Ionicons.glyphMap;
}> = {
  'active-trades': {
    color: Colors.primary.DEFAULT,
    bgColor: 'rgba(0, 163, 246, 0.15)',
    gradient: ['rgba(0, 163, 246, 0.2)', 'rgba(0, 163, 246, 0.05)'] as const,
    icon: 'swap-horizontal',
  },
  'completed': {
    color: Colors.success.DEFAULT,
    bgColor: 'rgba(16, 185, 129, 0.15)',
    gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)'] as const,
    icon: 'checkmark-circle',
  },
  'volume': {
    color: Colors.accent.purple,
    bgColor: 'rgba(139, 92, 246, 0.15)',
    gradient: ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)'] as const,
    icon: 'trending-up',
  },
  'escrow': {
    color: Colors.warning.DEFAULT,
    bgColor: 'rgba(245, 158, 11, 0.15)',
    gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)'] as const,
    icon: 'shield-checkmark',
  },
};

const DEFAULT_STATS: StatItem[] = [
  { id: 'active-trades', icon: 'swap-horizontal', value: 0, label: 'Active Trades', subtitle: 'In progress' },
  { id: 'completed', icon: 'checkmark-circle', value: 0, label: 'Completed', subtitle: 'All time' },
  { id: 'volume', icon: 'trending-up', value: '$0', label: 'Volume', subtitle: 'This month' },
  { id: 'escrow', icon: 'shield-checkmark', value: '$0', label: 'In Escrow', subtitle: 'Secured' },
];

// Individual Stat Card Component
const StatCardItem = memo(function StatCardItem({
  stat,
  index
}: {
  stat: StatItem;
  index: number;
}) {
  const { colors, isDark, shadows } = useTheme();
  const config = STAT_CONFIG[stat.id] || STAT_CONFIG['active-trades'];

  console.log('[StatCardItem] Rendering:', stat.id, stat.value);

  return (
    <AnimatedView
      animation="scale"
      staggerIndex={index}
      staggerDelay={80}
    >
      <View style={[
        styles.statCard,
        {
          backgroundColor: isDark ? colors.card : colors.card,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        },
        shadows.card,
      ]}>
        {/* Accent gradient overlay */}
        <LinearGradient
          colors={config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />

        {/* Top accent line */}
        <View style={[styles.accentLine, { backgroundColor: config.color }]} />

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon} size={20} color={config.color} />
        </View>

        {/* Value */}
        <Text
          style={[styles.value, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {stat.value}
        </Text>

        {/* Label */}
        <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
          {stat.label}
        </Text>

        {/* Subtitle badge */}
        {stat.subtitle && (
          <View style={[styles.subtitleBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
              {stat.subtitle}
            </Text>
          </View>
        )}
      </View>
    </AnimatedView>
  );
});

export const StatsOverview = memo(function StatsOverview({
  stats,
  isLoading = false,
  selectedPeriod = 'This Month',
  onPeriodChange,
}: StatsOverviewProps) {
  const { colors, isDark } = useTheme();

  console.log('[StatsOverview] Rendering, isLoading:', isLoading, 'stats count:', stats?.length);

  const displayStats = useMemo(() =>
    stats && stats.length > 0 ? stats : DEFAULT_STATS,
    [stats]
  );

  const handlePeriodPress = useCallback(() => {
    console.log('[StatsOverview] Period selector pressed');
    Haptics.selectionAsync();
    onPeriodChange?.();
  }, [onPeriodChange]);

  if (isLoading) {
    return (
      <AnimatedView animation="fadeSlideUp" staggerIndex={4}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={[styles.skeletonTitle, { backgroundColor: colors.skeleton }]} />
          </View>
          <View style={styles.grid}>
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} style={styles.skeletonCard} />
            ))}
          </View>
        </View>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView animation="fadeSlideUp" staggerIndex={4}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>Your Stats</Text>
            <View style={[styles.liveIndicator, { backgroundColor: Colors.success.bg }]}>
              <View style={styles.liveDot} />
              <Text style={[styles.liveText, { color: Colors.success.DEFAULT }]}>Live</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.periodSelector, {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            }]}
            onPress={handlePeriodPress}
            activeOpacity={0.7}
            accessibilityLabel={`Selected period: ${selectedPeriod}`}
            accessibilityHint="Double tap to change time period"
            accessibilityRole="button"
          >
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.periodText, { color: colors.textSecondary }]}>
              {selectedPeriod}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          {displayStats.map((stat, index) => (
            <StatCardItem key={stat.id} stat={stat} index={index} />
          ))}
        </View>
      </View>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    letterSpacing: -0.3,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success.DEFAULT,
  },
  liveText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  periodText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: CARD_WIDTH,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    right: Spacing.md,
    height: 2,
    borderRadius: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.xxs,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    marginBottom: Spacing.xs,
  },
  subtitleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.sm,
  },
  subtitle: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.medium,
  },
  skeletonTitle: {
    width: 100,
    height: 20,
    borderRadius: BorderRadius.sm,
  },
  skeletonCard: {
    width: CARD_WIDTH,
    height: 140,
    borderRadius: BorderRadius.xl,
  },
});

export default StatsOverview;
