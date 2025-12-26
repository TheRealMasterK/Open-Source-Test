/**
 * WalletCard Component
 * Displays individual crypto wallet with balance and USD value
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { CRYPTOCURRENCIES, CryptoSymbol } from '@/config/crypto.config';

export interface WalletCardProps {
  symbol: CryptoSymbol;
  balance: number;
  usdValue: number;
  gradientColors: [string, string];
  onManagePress?: () => void;
}

export function WalletCard({
  symbol,
  balance,
  usdValue,
  gradientColors,
  onManagePress,
}: WalletCardProps) {
  const { colors } = useTheme();
  const crypto = CRYPTOCURRENCIES[symbol];

  console.log('[WalletCard] Rendering:', symbol, 'Balance:', balance);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.info}>
            <View style={[styles.cryptoIcon, { backgroundColor: `${crypto.color}20` }]}>
              <Text style={[styles.cryptoIconText, { color: crypto.color }]}>
                {symbol.charAt(0)}
              </Text>
            </View>
            <Text style={[styles.walletName, { color: colors.text }]}>
              {symbol} Wallet
            </Text>
          </View>
          <Text
            style={[styles.usdValue, { color: Colors.primary.DEFAULT }]}
            accessibilityLabel={`USD value: ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} dollars`}
          >
            ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.body}>
          <View>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
              Total Balance
            </Text>
            <Text
              style={[styles.balanceValue, { color: colors.text }]}
              accessibilityLabel={`Balance: ${balance.toFixed(crypto.decimals > 4 ? 4 : crypto.decimals)} ${symbol}`}
            >
              {balance.toFixed(crypto.decimals > 4 ? 4 : crypto.decimals)} {symbol}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onManagePress}
            accessibilityLabel={`Manage ${symbol} wallet`}
            accessibilityRole="button"
            accessibilityHint={`Opens ${symbol} wallet management options`}
          >
            <Text style={[styles.manageText, { color: Colors.primary.DEFAULT }]}>
              Manage
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cryptoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoIconText: {
    fontWeight: '700',
    fontSize: FontSize.base,
  },
  walletName: {
    fontWeight: '600',
    fontSize: FontSize.base,
  },
  usdValue: {
    fontWeight: '600',
    fontSize: FontSize.base,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: FontSize.xs,
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  manageText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});

export default WalletCard;
