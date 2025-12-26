/**
 * ActivityItem Component
 * Displays a single activity item in the recent activity list
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export interface ActivityItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  timestamp: string;
}

export function ActivityItem({ icon, iconColor, title, timestamp }: ActivityItemProps) {
  const { colors } = useTheme();

  console.log('[ActivityItem] Rendering:', title);

  return (
    <View
      style={styles.container}
      accessibilityLabel={`${title}, ${timestamp}`}
      accessibilityRole="text"
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>{timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: FontSize.xs,
  },
});

export default ActivityItem;
