/**
 * Dashboard Activity Item Component
 * Displays a single activity entry
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { RecentActivity } from '@/types/dashboard.types';

// Map activity types to icons and colors
const ACTIVITY_CONFIG: Record<RecentActivity['type'], {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}> = {
  trade: { icon: 'swap-horizontal', color: '#00A3F6' },
  escrow: { icon: 'lock-closed', color: '#F59E0B' },
  rating: { icon: 'star', color: '#10B981' },
  offer: { icon: 'pricetag', color: '#8B5CF6' },
  wallet: { icon: 'wallet', color: '#06B6D4' },
};

export interface DashboardActivityItemProps {
  activity: RecentActivity;
}

export function DashboardActivityItem({ activity }: DashboardActivityItemProps) {
  const { colors } = useTheme();
  const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.trade;

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    } catch {
      return timestamp;
    }
  };

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconContainer, { backgroundColor: `${config.color}20` }]}>
        <Ionicons name={config.icon} size={18} color={config.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>
          {activity.description}
        </Text>
        <View style={styles.activityMeta}>
          <Text style={[styles.activityTimestamp, { color: colors.textTertiary }]}>
            {formatTimestamp(activity.timestamp)}
          </Text>
          {activity.status && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    activity.status === 'completed' ? '#10B98120' :
                    activity.status === 'active' ? '#00A3F620' :
                    activity.status === 'pending' ? '#F59E0B20' : '#6B728020',
                },
              ]}>
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      activity.status === 'completed' ? '#10B981' :
                      activity.status === 'active' ? '#00A3F6' :
                      activity.status === 'pending' ? '#F59E0B' : '#6B7280',
                  },
                ]}>
                {activity.status}
              </Text>
            </View>
          )}
        </View>
      </View>
      {activity.amount && activity.currency && (
        <Text style={[styles.activityAmount, { color: colors.text }]}>
          {activity.currency} {activity.amount.toLocaleString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  activityTimestamp: {
    fontSize: FontSize.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activityAmount: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});

export default DashboardActivityItem;
