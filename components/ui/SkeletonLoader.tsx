/**
 * SkeletonLoader Component
 * Animated placeholder for loading states
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius, Spacing } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export interface SkeletonLoaderProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%' as const,
  height = 20,
  borderRadius = BorderRadius.md,
  style,
}: SkeletonLoaderProps) {
  const { colors, isDark } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const backgroundColor = isDark ? colors.surfaceSecondary : colors.backgroundGray;
  const shimmerColor = isDark ? colors.surface : colors.backgroundGrayLight;

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, backgroundColor, opacity },
        style,
      ]}
    />
  );
}

// Pre-built skeleton variants
export function SkeletonText({ lines = 1, style }: { lines?: number; style?: ViewStyle }) {
  return (
    <View style={[styles.textContainer, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          height={14}
          width={index === lines - 1 ? '60%' : '100%'}
          style={index < lines - 1 ? styles.textLine : undefined}
        />
      ))}
    </View>
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      <View style={styles.cardHeader}>
        <SkeletonLoader width={48} height={48} borderRadius={24} />
        <View style={styles.cardHeaderText}>
          <SkeletonLoader width={120} height={16} />
          <SkeletonLoader width={80} height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonText lines={2} style={{ marginTop: Spacing.md }} />
      <SkeletonLoader height={44} borderRadius={BorderRadius.lg} style={{ marginTop: Spacing.md }} />
    </View>
  );
}

export function SkeletonAvatar({ size = 48 }: { size?: number }) {
  return <SkeletonLoader width={size} height={size} borderRadius={size / 2} />;
}

export function SkeletonList({ count = 3, style }: { count?: number; style?: ViewStyle }) {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <SkeletonAvatar size={40} />
          <View style={styles.listContent}>
            <SkeletonLoader width={140} height={14} />
            <SkeletonLoader width={100} height={12} style={{ marginTop: 6 }} />
          </View>
          <SkeletonLoader width={60} height={24} borderRadius={BorderRadius.sm} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  textContainer: {
    gap: 8,
  },
  textLine: {
    marginBottom: 8,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  listContent: {
    flex: 1,
  },
});

export default SkeletonLoader;
