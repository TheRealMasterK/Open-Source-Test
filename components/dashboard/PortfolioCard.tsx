/**
 * PortfolioCard Component
 * Premium balance card with light/dark mode support, haptics, and accessibility
 */

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { AnimatedView, PulseGlow, CountUpText } from '@/components/ui/animations';
import { GradientButton } from '@/components/ui';
import * as Haptics from 'expo-haptics';

// Theme-aware gradient colors
const CARD_GRADIENTS = {
  dark: ['#0A1628', '#152238', '#1E3A5F'] as const,
  light: ['#E6F7FF', '#D6EFF9', '#C1E4F4'] as const,
};

const DECORATIVE_COLORS = {
  dark: {
    circle1: ['rgba(0, 163, 246, 0.3)', 'transparent'] as const,
    circle2: ['rgba(139, 92, 246, 0.2)', 'transparent'] as const,
  },
  light: {
    circle1: ['rgba(0, 163, 246, 0.2)', 'transparent'] as const,
    circle2: ['rgba(139, 92, 246, 0.15)', 'transparent'] as const,
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
  const { colors, shadows, isDark } = useTheme();

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
    <AnimatedView animation="fadeSlideUp" staggerIndex={1}>
      <PulseGlow
        glowColor={Colors.primary.DEFAULT}
        glowIntensity="medium"
        pulseSpeed="slow"
        enabled={isDark}
      >
        <View
          style={[styles.container, shadows.xl]}
          accessibilityRole="summary"
          accessibilityLabel={`Portfolio balance ${hideBalance ? 'hidden' : `$${balance.toFixed(2)}`}, ${isPositiveChange ? 'up' : 'down'} ${Math.abs(balanceChange)}% in last 24 hours`}
        >
          {/* Background Gradient */}
          <LinearGradient
            colors={isDark ? CARD_GRADIENTS.dark : CARD_GRADIENTS.light}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.backgroundGradient}
          />

          {/* Decorative Elements */}
          <View style={styles.decorativeContainer}>
            <LinearGradient
              colors={isDark ? DECORATIVE_COLORS.dark.circle1 : DECORATIVE_COLORS.light.circle1}
              style={styles.decorativeCircle1}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <LinearGradient
              colors={isDark ? DECORATIVE_COLORS.dark.circle2 : DECORATIVE_COLORS.light.circle2}
              style={styles.decorativeCircle2}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
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
                <CountUpText
                  value={balance}
                  prefix="$"
                  decimals={2}
                  duration={1200}
                  style={[styles.balanceText, { color: textPrimary }]}
                />
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
            <View
              style={[styles.holdingsPreview, { backgroundColor: overlayBg }]}
              accessibilityLabel="Holdings overview: USDT primary, BTC secondary"
            >
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
      </PulseGlow>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: Spacing.lg,
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
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
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
