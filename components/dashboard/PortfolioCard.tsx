/**
 * PortfolioCard Component
 * Premium 3D balance card with light/dark mode support, haptics, and accessibility
 */

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { GradientButton } from '@/components/ui';
import * as Haptics from 'expo-haptics';

// Theme-aware gradient colors for 3D effect
const CARD_GRADIENTS = {
  dark: ['#0D1B2A', '#1B2838', '#1E3A5F', '#152238'] as const,
  light: ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC'] as const,
};

// 3D highlight gradient (top edge)
const HIGHLIGHT_GRADIENTS = {
  dark: ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)', 'transparent'] as const,
  light: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.4)', 'transparent'] as const,
};

// 3D shadow gradient (bottom edge)
const SHADOW_GRADIENTS = {
  dark: ['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)'] as const,
  light: ['transparent', 'rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.1)'] as const,
};

const DECORATIVE_COLORS = {
  dark: {
    circle1: ['rgba(0, 163, 246, 0.25)', 'rgba(0, 163, 246, 0.05)', 'transparent'] as const,
    circle2: ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)', 'transparent'] as const,
  },
  light: {
    circle1: ['rgba(0, 163, 246, 0.15)', 'rgba(0, 163, 246, 0.05)', 'transparent'] as const,
    circle2: ['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.03)', 'transparent'] as const,
  },
};

interface PortfolioCardProps {
  balance: number;
  balanceChange?: number;
  isLoading?: boolean;
  hideBalance?: boolean;
  onToggleVisibility?: () => void;
}

export const PortfolioCard = memo(function PortfolioCard({
  balance,
  balanceChange = 2.4,
  isLoading = false,
  hideBalance = false,
  onToggleVisibility,
}: PortfolioCardProps) {
  const { isDark } = useTheme();

  console.log('[PortfolioCard] Rendering, balance:', balance, 'loading:', isLoading);

  const isPositiveChange = balanceChange >= 0;
  const changeColor = isPositiveChange ? Colors.success.light : Colors.danger.light;
  const changeIcon = isPositiveChange ? 'trending-up' : 'trending-down';

  // Text colors based on theme
  const textPrimary = isDark ? Colors.white : Colors.dark.text;
  const textSecondary = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)';
  const textTertiary = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
  const overlayBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  const handleVisibilityToggle = useCallback(() => {
    console.log('[PortfolioCard] Toggle visibility');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleVisibility?.();
  }, [onToggleVisibility]);

  const handleDeposit = useCallback(() => {
    console.log('[PortfolioCard] Deposit pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/wallet/deposit' as never);
  }, []);

  const handleWithdraw = useCallback(() => {
    console.log('[PortfolioCard] Withdraw pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/wallet/withdraw' as never);
  }, []);

  const handleMore = useCallback(() => {
    console.log('[PortfolioCard] More pressed');
    Haptics.selectionAsync();
    router.push('/(tabs)/wallet');
  }, []);

  return (
    <View style={styles.card3DWrapper}>
      {/* 3D Shadow Layer (underneath) */}
      <View style={[styles.shadowLayer, { backgroundColor: isDark ? '#000' : 'rgba(0,50,100,0.15)' }]} />

      {/* Main Card */}
      <View
        style={[styles.container, styles.card3D]}
        accessibilityRole="summary"
        accessibilityLabel={`Portfolio balance ${hideBalance ? 'hidden' : `$${balance.toFixed(2)}`}`}
      >
        {/* Background Gradient */}
        <LinearGradient
          colors={isDark ? CARD_GRADIENTS.dark : CARD_GRADIENTS.light}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />

        {/* 3D Top Highlight Edge */}
        <LinearGradient
          colors={isDark ? HIGHLIGHT_GRADIENTS.dark : HIGHLIGHT_GRADIENTS.light}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.topHighlight}
        />

        {/* 3D Left Highlight Edge */}
        <LinearGradient
          colors={isDark ? HIGHLIGHT_GRADIENTS.dark : HIGHLIGHT_GRADIENTS.light}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.leftHighlight}
        />

        {/* 3D Bottom Shadow Edge */}
        <LinearGradient
          colors={isDark ? SHADOW_GRADIENTS.dark : SHADOW_GRADIENTS.light}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bottomShadow}
        />

        {/* 3D Inner Border */}
        <View style={[styles.innerBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)' }]} />

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <LinearGradient
            colors={isDark ? DECORATIVE_COLORS.dark.circle1 : DECORATIVE_COLORS.light.circle1}
            style={styles.decorativeCircle1}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <LinearGradient
            colors={isDark ? DECORATIVE_COLORS.dark.circle2 : DECORATIVE_COLORS.light.circle2}
            style={styles.decorativeCircle2}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.labelContainer}>
              <View style={styles.statusDot} />
              <Text style={[styles.label, { color: textSecondary }]}>Portfolio Balance</Text>
            </View>
            <TouchableOpacity
              onPress={handleVisibilityToggle}
              style={styles.visibilityButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={hideBalance ? 'Show balance' : 'Hide balance'}
              accessibilityRole="button"
            >
              <Ionicons
                name={hideBalance ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={textTertiary}
              />
            </TouchableOpacity>
          </View>

          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            {isLoading ? (
              <Text style={[styles.balanceText, { color: textPrimary }]}>$•••••</Text>
            ) : hideBalance ? (
              <Text style={[styles.balanceText, { color: textPrimary }]}>$••••••</Text>
            ) : (
              <Text style={[styles.balanceText, { color: textPrimary }]}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            )}
          </View>

          {/* Change Indicator */}
          <View style={styles.changeRow}>
            <View style={[styles.changeBadge, { backgroundColor: `${changeColor}25` }]}>
              <Ionicons name={changeIcon} size={14} color={changeColor} />
              <Text style={[styles.changeText, { color: changeColor }]}>
                {isPositiveChange ? '+' : ''}{balanceChange.toFixed(1)}%
              </Text>
            </View>
            <Text style={[styles.periodText, { color: textTertiary }]}>Last 24 hours</Text>
          </View>

          {/* Crypto Holdings Mini Preview */}
          <View style={[styles.holdingsPreview, { backgroundColor: overlayBg }]}>
            <View style={styles.holdingItem}>
              <View style={[styles.cryptoIcon, { backgroundColor: Colors.crypto.USDT }]}>
                <Text style={styles.cryptoIconText}>₮</Text>
              </View>
              <View style={styles.holdingInfo}>
                <Text style={[styles.holdingName, { color: textPrimary }]}>USDT</Text>
                <Text style={[styles.holdingAmount, { color: textTertiary }]}>Primary</Text>
              </View>
            </View>
            <View style={[styles.holdingDivider, { backgroundColor: dividerColor }]} />
            <View style={styles.holdingItem}>
              <View style={[styles.cryptoIcon, { backgroundColor: Colors.crypto.BTC }]}>
                <Text style={styles.cryptoIconText}>₿</Text>
              </View>
              <View style={styles.holdingInfo}>
                <Text style={[styles.holdingName, { color: textPrimary }]}>BTC</Text>
                <Text style={[styles.holdingAmount, { color: textTertiary }]}>Secondary</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <GradientButton
              title="Deposit"
              size="sm"
              variant="buy"
              onPress={handleDeposit}
              glow={false}
              leftIcon={<Ionicons name="arrow-down-circle" size={18} color={Colors.white} />}
              style={styles.actionButton}
            />
            <GradientButton
              title="Withdraw"
              size="sm"
              variant="sell"
              onPress={handleWithdraw}
              glow={false}
              leftIcon={<Ionicons name="arrow-up-circle" size={18} color={Colors.white} />}
              style={styles.actionButton}
            />
            <TouchableOpacity
              style={[styles.moreButton, { backgroundColor: overlayBg }]}
              onPress={handleMore}
              accessibilityLabel="More wallet options"
              accessibilityRole="button"
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  // 3D Card Wrapper
  card3DWrapper: {
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  // 3D Shadow layer underneath card
  shadowLayer: {
    position: 'absolute',
    top: 8,
    left: 4,
    right: -4,
    bottom: -8,
    borderRadius: BorderRadius['2xl'],
    opacity: 0.4,
  },
  // 3D Card transform
  card3D: {
    transform: [
      { perspective: 1000 },
      { rotateX: '-2deg' },
    ],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  container: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 1,
  },
  leftHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 40,
    zIndex: 1,
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    zIndex: 2,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.8,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.6,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    zIndex: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success.DEFAULT,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    letterSpacing: 0.5,
  },
  visibilityButton: {
    padding: Spacing.xs,
  },
  balanceContainer: {
    marginVertical: Spacing.sm,
  },
  balanceText: {
    fontSize: FontSize['5xl'],
    fontFamily: FontFamily.bold,
    letterSpacing: -1.5,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  changeText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  periodText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  holdingsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  holdingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  holdingDivider: {
    width: 1,
    height: 32,
  },
  cryptoIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoIconText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  holdingAmount: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
  },
  moreButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PortfolioCard;
