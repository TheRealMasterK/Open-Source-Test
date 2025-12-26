/**
 * MarketTrends Component
 * Premium crypto market overview with memoization, haptics, and accessibility
 */

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { AnimatedView } from '@/components/ui/animations';
import * as Haptics from 'expo-haptics';

interface CryptoTrend {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: number;
  color: string;
  icon: string;
}

// Defined outside component to prevent recreation
const TRENDING_CRYPTOS: CryptoTrend[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$43,250',
    change: 2.4,
    color: Colors.crypto.BTC,
    icon: '₿',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$2,280',
    change: -1.2,
    color: Colors.crypto.ETH,
    icon: 'Ξ',
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether',
    price: '$1.00',
    change: 0.01,
    color: Colors.crypto.USDT,
    icon: '₮',
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    price: '$98.50',
    change: 5.8,
    color: Colors.crypto.SOL,
    icon: '◎',
  },
];

// Card width + gap for snap scrolling
const CARD_WIDTH = 148;
const CARD_GAP = 8;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

interface MarketTrendsProps {
  onViewAll?: () => void;
}

export const MarketTrends = memo(function MarketTrends({ onViewAll }: MarketTrendsProps) {
  const { colors, isDark } = useTheme();

  console.log('[MarketTrends] Rendering');

  const handleCryptoPress = useCallback((crypto: CryptoTrend) => {
    console.log('[MarketTrends] Crypto pressed:', crypto.symbol);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(tabs)/marketplace?crypto=${crypto.id}` as never);
  }, []);

  const handleViewAllPress = useCallback(() => {
    console.log('[MarketTrends] View all pressed');
    Haptics.selectionAsync();
    if (onViewAll) {
      onViewAll();
    } else {
      router.push('/(tabs)/marketplace');
    }
  }, [onViewAll]);

  return (
    <AnimatedView animation="fadeSlideUp" staggerIndex={3}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Market Trends</Text>
            <View style={[
              styles.liveBadge,
              { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)' }
            ]}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleViewAllPress}
            style={styles.viewAllButton}
            accessibilityLabel="View all market trends"
            accessibilityRole="button"
          >
            <Text style={[styles.viewAllText, { color: Colors.primary.DEFAULT }]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={SNAP_INTERVAL}
          scrollEventThrottle={16}
          removeClippedSubviews
        >
          {TRENDING_CRYPTOS.map((crypto, index) => {
            const isPositive = crypto.change >= 0;
            const changeColor = isPositive ? Colors.success.DEFAULT : Colors.danger.DEFAULT;
            const changeBgColor = isPositive ? Colors.success.bg : Colors.danger.bg;
            const changeIndicator = isPositive ? '▲' : '▼';

            return (
              <AnimatedView
                key={crypto.id}
                animation="slideLeft"
                staggerIndex={index}
                staggerDelay={60}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleCryptoPress(crypto)}
                  style={styles.cryptoCard}
                  accessibilityLabel={`${crypto.name}, ${crypto.symbol}, price ${crypto.price}, ${isPositive ? 'up' : 'down'} ${Math.abs(crypto.change)} percent`}
                  accessibilityHint="Double tap to view in marketplace"
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.cardContent,
                      {
                        backgroundColor: colors.card,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border
                      }
                    ]}
                  >
                    {/* Header with icon and change */}
                    <View style={styles.cardHeader}>
                      <View
                        style={[styles.cryptoIcon, { backgroundColor: crypto.color }]}
                        accessibilityLabel={`${crypto.name} icon`}
                      >
                        <Text style={styles.cryptoIconText}>{crypto.icon}</Text>
                      </View>
                      <View style={[styles.changeBadge, { backgroundColor: changeBgColor }]}>
                        <Text style={[styles.changeText, { color: changeColor }]}>
                          {changeIndicator} {Math.abs(crypto.change)}%
                        </Text>
                      </View>
                    </View>

                    {/* Crypto Info */}
                    <View style={styles.cryptoInfo}>
                      <Text style={[styles.cryptoSymbol, { color: colors.text }]}>
                        {crypto.symbol}
                      </Text>
                      <Text style={[styles.cryptoName, { color: colors.textSecondary }]} numberOfLines={1}>
                        {crypto.name}
                      </Text>
                    </View>

                    {/* Price */}
                    <Text style={[styles.cryptoPrice, { color: colors.text }]}>
                      {crypto.price}
                    </Text>

                    {/* Mini trend indicator */}
                    <View style={styles.trendContainer}>
                      <LinearGradient
                        colors={isPositive
                          ? ['rgba(16, 185, 129, 0.25)', 'transparent']
                          : ['rgba(239, 68, 68, 0.25)', 'transparent']
                        }
                        style={styles.trendGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      />
                      <View style={[styles.trendLine, { backgroundColor: changeColor }]} />
                    </View>
                  </View>
                </TouchableOpacity>
              </AnimatedView>
            );
          })}
        </ScrollView>
      </View>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    letterSpacing: -0.3,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success.DEFAULT,
  },
  liveText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    color: Colors.success.DEFAULT,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.xs,
  },
  viewAllText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  scrollContent: {
    paddingRight: Spacing.md,
    gap: CARD_GAP,
  },
  cryptoCard: {
    width: CARD_WIDTH,
  },
  cardContent: {
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cryptoIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoIconText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  changeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
  },
  cryptoInfo: {
    marginBottom: Spacing.xs,
  },
  cryptoSymbol: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.2,
  },
  cryptoName: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  cryptoPrice: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.5,
  },
  trendContainer: {
    marginTop: Spacing.sm,
    height: 20,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  trendGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  trendLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
});

export default MarketTrends;
