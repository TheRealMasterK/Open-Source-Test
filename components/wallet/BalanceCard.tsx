/**
 * BalanceCard Component
 * Display wallet balance for a cryptocurrency
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { CryptoIcon } from '@/components/ui/CryptoIcon';
import { CryptoSymbol } from '@/config/crypto.config';

interface BalanceCardProps {
  currency: CryptoSymbol;
  balance: number;
  usdValue?: number;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onPress?: () => void;
}

export function BalanceCard({
  currency,
  balance,
  usdValue,
  onDeposit,
  onWithdraw,
  onPress,
}: BalanceCardProps) {
  const { colors, isDark } = useTheme();

  const formatBalance = (amount: number): string => {
    if (currency === 'USDT') {
      return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        isDark ? {} : Shadows.md,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.currencyInfo}>
          <CryptoIcon currency={currency} size="md" />
          <View style={styles.currencyDetails}>
            <Text style={[styles.currencyName, { color: colors.text }]}>
              {currency}
            </Text>
            <Text style={[styles.networkLabel, { color: colors.textTertiary }]}>
              {currency === 'USDT' ? 'BEP-20' : currency === 'BTC' ? 'Bitcoin' : 'Ethereum'}
            </Text>
          </View>
        </View>
      </View>

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={[styles.balance, { color: colors.text }]}>
          {formatBalance(balance)} <Text style={styles.currencySymbol}>{currency}</Text>
        </Text>
        {usdValue !== undefined && (
          <Text style={[styles.usdValue, { color: colors.textSecondary }]}>
            {formatUSD(usdValue)}
          </Text>
        )}
      </View>

      {/* Actions */}
      {(onDeposit || onWithdraw) && (
        <View style={styles.actions}>
          {onDeposit && (
            <TouchableOpacity
              onPress={onDeposit}
              style={[styles.actionButton, { backgroundColor: Colors.success.DEFAULT + '15' }]}
            >
              <Ionicons
                name="arrow-down"
                size={18}
                color={Colors.success.DEFAULT}
              />
              <Text style={[styles.actionText, { color: Colors.success.DEFAULT }]}>
                Deposit
              </Text>
            </TouchableOpacity>
          )}

          {onWithdraw && (
            <TouchableOpacity
              onPress={onWithdraw}
              style={[styles.actionButton, { backgroundColor: Colors.primary.DEFAULT + '15' }]}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={Colors.primary.DEFAULT}
              />
              <Text style={[styles.actionText, { color: Colors.primary.DEFAULT }]}>
                Withdraw
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyDetails: {
    marginLeft: Spacing.sm,
  },
  currencyName: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  networkLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  balanceSection: {
    marginBottom: Spacing.md,
  },
  balance: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
  },
  currencySymbol: {
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  usdValue: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  actionText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});

export default BalanceCard;
