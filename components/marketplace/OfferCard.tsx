/**
 * OfferCard Component - Premium Design
 * Enhanced offer card with animations, skeleton loading, and modern UI
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Gradients } from '@/config/theme';
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
  index?: number;
}

// Avatar gradient colors
const AVATAR_GRADIENTS: readonly [string, string][] = [
  ['#00A3F6', '#0066CC'],
  ['#10B981', '#059669'],
  ['#F59E0B', '#D97706'],
  ['#8B5CF6', '#7C3AED'],
  ['#EC4899', '#DB2777'],
  ['#14B8A6', '#0D9488'],
];

function getAvatarGradient(name: string): readonly [string, string] {
  const index = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

// Skeleton Loading Component
export function OfferCardSkeleton() {
  const { colors, isDark } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
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
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const skeletonBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={styles.traderInfo}>
          <Animated.View style={[styles.skeletonAvatar, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
          <View style={styles.traderDetails}>
            <Animated.View style={[styles.skeletonName, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonRating, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
          </View>
        </View>
        <Animated.View style={[styles.skeletonDate, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Animated.View style={[styles.skeletonLabel, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.skeletonValue, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
        </View>
        <View style={styles.infoItem}>
          <Animated.View style={[styles.skeletonLabel, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.skeletonValue, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
        </View>
        <View style={styles.priceContainer}>
          <Animated.View style={[styles.skeletonPrice, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.skeletonPriceSub, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Animated.View style={[styles.skeletonButton, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonButtonSmall, { backgroundColor: skeletonBg, opacity: shimmerOpacity }]} />
      </View>
    </View>
  );
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
  index = 0,
}: OfferCardProps) {
  const { colors, isDark, shadows } = useTheme();
  const avatarGradient = getAvatarGradient(traderName);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Entrance animation
  useEffect(() => {
    const delay = index * 100; // Staggered animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  // Press animation handlers
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const actionGradient = offerType === 'buy' ? Gradients.buy : Gradients.sell;
  const actionText = offerType === 'buy' ? `Buy ${cryptoType}` : `Sell ${cryptoType}`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
        shadows.md,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {/* Top Row - Trader Info & Date */}
        <View style={styles.topRow}>
          <View style={styles.traderInfo}>
            {/* Avatar with gradient */}
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={avatarGradient as unknown as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{traderInitials}</Text>
              </LinearGradient>
              <View style={[styles.onlineIndicator, { borderColor: colors.card }]} />
            </View>

            {/* Name & Rating */}
            <View style={styles.traderDetails}>
              <View style={styles.nameRow}>
                <Text style={[styles.traderName, { color: colors.text }]} numberOfLines={1}>
                  {traderName}
                </Text>
                {isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.primary.DEFAULT} />
                  </View>
                )}
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {rating.toFixed(1)}
                </Text>
                <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
                <Text style={[styles.tradesText, { color: colors.textSecondary }]}>
                  {tradeCount} trades
                </Text>
              </View>
            </View>
          </View>

          {/* Date Badge */}
          <View style={[styles.dateBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
            <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
            <Text style={[styles.dateText, { color: colors.textTertiary }]}>{lastSeen}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]} />

        {/* Middle Section - Info Grid */}
        <View style={styles.infoGrid}>
          {/* Payment Method */}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Payment</Text>
            <View style={styles.paymentRow}>
              <Ionicons name="card-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                {paymentMethods[0] || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Range */}
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Limit</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {minLimit} – {maxLimit}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>Rate</Text>
            <Text style={[styles.priceValue, { color: offerType === 'buy' ? Colors.buy.DEFAULT : Colors.sell.DEFAULT }]}>
              {price} <Text style={styles.priceCurrency}>{currency}</Text>
            </Text>
            <Text style={[styles.priceSubtext, { color: colors.textTertiary }]}>
              per {cryptoType}
            </Text>
          </View>
        </View>

        {/* Bottom Row - Actions */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.actionButtonWrapper}
            onPress={onPress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={actionGradient as unknown as readonly [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>{actionText}</Text>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={14} color={Colors.white} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {onResell && (
            <TouchableOpacity
              style={[styles.resellButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}
              onPress={onResell}
              activeOpacity={0.7}
            >
              <Text style={[styles.resellButtonText, { color: colors.text }]}>Resell</Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  pressable: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  traderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success.DEFAULT,
    borderWidth: 2,
  },
  traderDetails: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  traderName: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    maxWidth: 150,
  },
  verifiedBadge: {
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },
  tradesText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  dateText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  priceCurrency: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  priceSubtext: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButtonWrapper: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  arrowContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resellButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resellButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  // Skeleton styles
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  skeletonName: {
    width: 100,
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonRating: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  skeletonDate: {
    width: 60,
    height: 24,
    borderRadius: 12,
  },
  skeletonLabel: {
    width: 50,
    height: 10,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonValue: {
    width: 70,
    height: 14,
    borderRadius: 4,
  },
  skeletonPrice: {
    width: 80,
    height: 22,
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonPriceSub: {
    width: 60,
    height: 10,
    borderRadius: 4,
  },
  skeletonButton: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.lg,
  },
  skeletonButtonSmall: {
    width: 70,
    height: 38,
    borderRadius: BorderRadius.lg,
  },
});
