/**
 * Dashboard Stat Card Component
 * Displays individual stat with gradient icon
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export interface DashboardStatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  subtitle?: string;
  gradientColors: readonly [string, string];
  isLoading?: boolean;
}

export function DashboardStatCard({
  icon,
  value,
  label,
  subtitle,
  gradientColors,
  isLoading,
}: DashboardStatCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}>
      <LinearGradient
        colors={[...gradientColors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statIconContainer}>
        <Ionicons name={icon} size={24} color={Colors.white} />
      </LinearGradient>
      <View style={styles.statTextContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.textSecondary} />
        ) : (
          <>
            <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
            {subtitle && (
              <Text style={[styles.statSubtitle, { color: colors.textTertiary }]}>
                {subtitle}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: {
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  statSubtitle: {
    fontSize: FontSize.xs,
  },
});

export default DashboardStatCard;
