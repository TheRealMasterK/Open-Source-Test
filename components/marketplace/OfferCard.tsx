/**
 * OfferCard Component
 * Displays a single offer in the marketplace
 * Matches QicTrader web app design
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export interface OfferCardProps {
  id: string;
  traderName: string;
  traderInitials: string;
  isVerified: boolean;
  rating: number;
  tradeCount: number;
  cryptoType: 'BTC' | 'ETH' | 'USDT';
  price: string;
  currency: string;
  available: string;
  minLimit: string;
  maxLimit: string;
  paymentMethods: string[];
  lastSeen: string;
  offerType: 'buy' | 'sell';
  onPress?: () => void;
  onResell?: () => void;
}

const AVATAR_COLORS = [
  '#00A3F6', // Primary blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
];

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function OfferCard({
  traderName,
  traderInitials,
  isVerified,
  rating,
  tradeCount,
  cryptoType,
  price,
  currency,
  available,
  minLimit,
  maxLimit,
  paymentMethods,
  lastSeen,
  offerType,
  onPress,
  onResell,
}: OfferCardProps) {
  const { colors, isDark } = useTheme();
  const avatarColor = getAvatarColor(traderName);

  console.log('[OfferCard] Rendering offer from:', traderName);

  const actionButtonColor = offerType === 'buy' ? Colors.primary.DEFAULT : Colors.secondary.DEFAULT;
  const actionButtonText = offerType === 'buy' ? `Buy ${cryptoType}` : `Sell ${cryptoType}`;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessible={true}
      accessibilityLabel={`${offerType === 'buy' ? 'Buy' : 'Sell'} ${cryptoType} offer from ${traderName} at ${price} ${currency}`}
    >
      {/* Top Row - Trader Info & Last Seen */}
      <View style={styles.topRow}>
        {/* Trader Info */}
        <View style={styles.traderInfo}>
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{traderInitials}</Text>
            <View style={[styles.onlineIndicator, { borderColor: colors.card }]} />
          </View>

          {/* Name & Rating */}
          <View style={styles.traderDetails}>
            <View style={styles.nameRow}>
              <Text style={[styles.traderName, { color: colors.text }]} numberOfLines={1}>
                {traderName}
              </Text>
              {isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.primary.DEFAULT}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                {rating.toFixed(1)} • {tradeCount} trades
              </Text>
            </View>
          </View>
        </View>

        {/* Last Seen */}
        <View style={styles.lastSeenContainer}>
          <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.lastSeenText, { color: colors.textTertiary }]}>{lastSeen}</Text>
        </View>
      </View>

      {/* Middle Row - Payment Method & Range */}
      <View style={styles.middleRow}>
        <View style={styles.infoColumn}>
          <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Payment Method</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {paymentMethods[0] || 'N/A'}
          </Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Range</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {minLimit} – {maxLimit} {currency}
          </Text>
        </View>
        <View style={styles.priceColumn}>
          <Text style={[styles.priceValue, { color: colors.text }]}>
            {price} {currency}
          </Text>
          <Text style={[styles.priceSubtext, { color: colors.textTertiary }]}>
            1 {cryptoType} = {available}
          </Text>
        </View>
      </View>

      {/* Bottom Row - Action Buttons */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: actionButtonColor }]}
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityLabel={actionButtonText}
          accessibilityRole="button"
          accessibilityHint={`Opens ${offerType} flow with ${traderName}`}
        >
          <Text style={styles.actionButtonText}>{actionButtonText}</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.white} />
        </TouchableOpacity>

        {offerType === 'sell' && onResell && (
          <TouchableOpacity
            style={[styles.resellButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={onResell}
            activeOpacity={0.8}
            accessibilityLabel="Resell this offer"
            accessibilityRole="button"
            accessibilityHint="Create a resale offer based on this listing"
          >
            <Text style={[styles.resellButtonText, { color: colors.text }]}>Resell This Offer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  traderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success.DEFAULT,
    borderWidth: 2,
  },
  traderDetails: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  traderName: {
    fontSize: FontSize.base,
    fontWeight: '600',
    maxWidth: 140,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
  lastSeenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSeenText: {
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  infoColumn: {
    flex: 1,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: FontSize.xs,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  priceSubtext: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    flex: 1,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginRight: 6,
  },
  resellButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  resellButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
