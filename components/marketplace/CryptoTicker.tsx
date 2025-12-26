/**
 * CryptoTicker Component
 * Displays crypto price information with 24h change
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export interface CryptoTickerProps {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  trades: number;
  color: string;
  onPress?: () => void;
}

export function CryptoTicker({
  symbol,
  name,
  price,
  change,
  isPositive,
  trades,
  color,
  onPress,
}: CryptoTickerProps) {
  const { colors } = useTheme();

  console.log('[CryptoTicker] Rendering:', symbol, price);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      accessibilityLabel={`${name} price ${price}, ${isPositive ? 'up' : 'down'} ${change}`}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.iconText, { color }]}>{symbol.charAt(0)}</Text>
        </View>
        <View style={styles.nameContainer}>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{symbol}</Text>
          </View>
          <Text
            style={[
              styles.change,
              { color: isPositive ? Colors.success.DEFAULT : Colors.danger.DEFAULT },
            ]}
          >
            {isPositive ? '+' : ''}{change}
          </Text>
        </View>
      </View>
      <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
      <Text style={[styles.trades, { color: colors.textSecondary }]}>
        Active Trades: {trades.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  iconText: {
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  change: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  price: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  trades: {
    fontSize: FontSize.xs,
  },
});

export default CryptoTicker;
