/**
 * StatCard Component
 * Dashboard stat card with gradient icon and value display
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  subtitle?: string;
  gradientColors: [string, string];
}

export function StatCard({ icon, value, label, subtitle, gradientColors }: StatCardProps) {
  const { colors } = useTheme();

  console.log('[StatCard] Rendering:', label, value);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessibilityLabel={`${label}: ${value}${subtitle ? `, ${subtitle}` : ''}`}
      accessibilityRole="text"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={24} color={Colors.white} />
      </LinearGradient>
      <View style={styles.textContainer}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: FontSize.xs,
  },
});

export default StatCard;
