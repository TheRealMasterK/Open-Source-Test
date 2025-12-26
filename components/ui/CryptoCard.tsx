/**
 * CryptoCard Component - Premium Enterprise UI
 * Premium cryptocurrency balance card with gradient and animations
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  FontSize,
  FontFamily,
  BorderRadius,
  Gradients,
  IconSize,
} from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type CryptoType = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'SOL' | 'BNB' | 'ZAR' | 'XRP';

interface CryptoCardProps {
  crypto: CryptoType;
  balance: string;
  fiatValue: string;
  change24h?: {
    value: string;
    isPositive: boolean;
  };
  onPress?: () => void;
  onSend?: () => void;
  onReceive?: () => void;
  style?: ViewStyle;
  featured?: boolean;
}

const cryptoConfig: Record<CryptoType, {
  name: string;
  gradient: readonly [string, string];
  icon: string;
}> = {
  BTC: { name: 'Bitcoin', gradient: Gradients.btc, icon: 'logo-bitcoin' },
  ETH: { name: 'Ethereum', gradient: Gradients.eth, icon: 'diamond-outline' },
  USDT: { name: 'Tether', gradient: Gradients.usdt, icon: 'cash-outline' },
  USDC: { name: 'USD Coin', gradient: ['#2775CA', '#1A5DAB'] as const, icon: 'cash-outline' },
  SOL: { name: 'Solana', gradient: ['#9945FF', '#7B2FE3'] as const, icon: 'planet-outline' },
  BNB: { name: 'BNB', gradient: ['#F3BA2F', '#C99A1F'] as const, icon: 'logo-bitcoin' },
  ZAR: { name: 'South African Rand', gradient: ['#007A4D', '#005A38'] as const, icon: 'cash-outline' },
  XRP: { name: 'Ripple', gradient: ['#23292F', '#1A1F24'] as const, icon: 'water-outline' },
};

export function CryptoCard({
  crypto,
  balance,
  fiatValue,
  change24h,
  onPress,
  onSend,
  onReceive,
  style,
  featured = false,
}: CryptoCardProps) {
  const { isDark, shadows, colors } = useTheme();
  const config = cryptoConfig[crypto];

  console.log('[CryptoCard] Rendering:', { crypto, balance, featured });

  const renderFeaturedCard = () => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.9}
      style={[shadows.xl, style]}
    >
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredCard}
      >
        {/* Background Pattern */}
        <View style={styles.patternOverlay}>
          <View style={[styles.patternCircle, styles.circle1]} />
          <View style={[styles.patternCircle, styles.circle2]} />
        </View>

        {/* Header */}
        <View style={styles.featuredHeader}>
          <View style={styles.cryptoInfo}>
            <View style={styles.cryptoIconLarge}>
              <Ionicons
                name={config.icon as keyof typeof Ionicons.glyphMap}
                size={IconSize.xl}
                color={Colors.white}
              />
            </View>
            <View>
              <Text style={styles.cryptoNameLarge}>{config.name}</Text>
              <Text style={styles.cryptoSymbolLarge}>{crypto}</Text>
            </View>
          </View>
          {change24h && (
            <View
              style={[
                styles.changeBadgeLarge,
                {
                  backgroundColor: change24h.isPositive
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                },
              ]}
            >
              <Ionicons
                name={change24h.isPositive ? 'trending-up' : 'trending-down'}
                size={16}
                color={change24h.isPositive ? Colors.success.light : Colors.danger.light}
              />
              <Text
                style={[
                  styles.changeTextLarge,
                  {
                    color: change24h.isPositive
                      ? Colors.success.light
                      : Colors.danger.light,
                  },
                ]}
              >
                {change24h.value}
              </Text>
            </View>
          )}
        </View>

        {/* Balance */}
        <View style={styles.featuredBalance}>
          <Text style={styles.balanceLarge}>{balance}</Text>
          <Text style={styles.fiatValueLarge}>{fiatValue}</Text>
        </View>

        {/* Actions */}
        {(onSend || onReceive) && (
          <View style={styles.actions}>
            {onSend && (
              <TouchableOpacity
                onPress={onSend}
                style={styles.actionButton}
                activeOpacity={0.8}
              >
                <View style={styles.actionIconBg}>
                  <Ionicons name="arrow-up" size={20} color={Colors.white} />
                </View>
                <Text style={styles.actionText}>Send</Text>
              </TouchableOpacity>
            )}
            {onReceive && (
              <TouchableOpacity
                onPress={onReceive}
                style={styles.actionButton}
                activeOpacity={0.8}
              >
                <View style={styles.actionIconBg}>
                  <Ionicons name="arrow-down" size={20} color={Colors.white} />
                </View>
                <Text style={styles.actionText}>Receive</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCompactCard = () => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      style={[
        styles.compactCard,
        {
          backgroundColor: isDark ? colors.card : colors.card,
          borderColor: isDark ? colors.border : colors.border,
        },
        shadows.card,
        style,
      ]}
    >
      <View style={styles.compactLeft}>
        <LinearGradient
          colors={config.gradient}
          style={styles.cryptoIconSmall}
        >
          <Ionicons
            name={config.icon as keyof typeof Ionicons.glyphMap}
            size={IconSize.md}
            color={Colors.white}
          />
        </LinearGradient>
        <View style={styles.compactInfo}>
          <Text style={[styles.cryptoName, { color: colors.text }]}>
            {config.name}
          </Text>
          <Text style={[styles.cryptoSymbol, { color: colors.textSecondary }]}>
            {crypto}
          </Text>
        </View>
      </View>
      <View style={styles.compactRight}>
        <Text style={[styles.balanceSmall, { color: colors.text }]}>
          {balance}
        </Text>
        <View style={styles.compactBottom}>
          <Text style={[styles.fiatValueSmall, { color: colors.textSecondary }]}>
            {fiatValue}
          </Text>
          {change24h && (
            <Text
              style={[
                styles.changeSmall,
                {
                  color: change24h.isPositive
                    ? Colors.success.DEFAULT
                    : Colors.danger.DEFAULT,
                },
              ]}
            >
              {change24h.isPositive ? '+' : ''}{change24h.value}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return featured ? renderFeaturedCard() : renderCompactCard();
}

const styles = StyleSheet.create({
  // Featured Card Styles
  featuredCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    minHeight: 220,
    overflow: 'hidden',
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -30,
    left: -30,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoIconLarge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cryptoNameLarge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  cryptoSymbolLarge: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  changeBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  changeTextLarge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    marginLeft: Spacing.xxs,
  },
  featuredBalance: {
    flex: 1,
    justifyContent: 'center',
  },
  balanceLarge: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],
    color: Colors.white,
    letterSpacing: -1,
  },
  fiatValueLarge: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xxs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  actionIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  actionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },

  // Compact Card Styles
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoIconSmall: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  compactInfo: {
    justifyContent: 'center',
  },
  cryptoName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
  cryptoSymbol: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  balanceSmall: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
  compactBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  fiatValueSmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
  },
  changeSmall: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    marginLeft: Spacing.sm,
  },
});

export default CryptoCard;
