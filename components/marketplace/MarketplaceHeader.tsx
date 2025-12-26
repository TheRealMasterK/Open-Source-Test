/**
 * MarketplaceHeader Component
 * Header section with search and stats
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, BorderRadius, Spacing } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface MarketplaceHeaderProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  activeOffers: number;
  tradingHours: string;
}

export default function MarketplaceHeader({
  searchValue,
  onSearchChange,
  activeOffers,
  tradingHours,
}: MarketplaceHeaderProps) {
  const { colors } = useTheme();

  console.log('[MarketplaceHeader] Rendering with', activeOffers, 'active offers');

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>Marketplace</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Find the best offers to buy or sell cryptocurrency
      </Text>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textPlaceholder} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search amount or payment method..."
          placeholderTextColor={colors.textPlaceholder}
          value={searchValue}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.success.DEFAULT} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>Secure Escrow</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color={Colors.primary.DEFAULT} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {activeOffers.toLocaleString()} Active
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={16} color={Colors.warning.DEFAULT} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>{tradingHours} Trading</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    height: 48,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSize.base,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: FontSize.xs,
    marginLeft: 6,
    fontWeight: '500',
  },
});
