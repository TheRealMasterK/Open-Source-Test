/**
 * TradeCard Component
 * Display trade summary in list views
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { CryptoIcon } from '@/components/ui/CryptoIcon';
import { Trade, TradeStatus } from '@/types';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

interface TradeCardProps {
  trade: Trade;
  onPress?: () => void;
}

const getStatusVariant = (status: TradeStatus) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
    case 'disputed':
      return 'danger';
    case 'pending':
      return 'warning';
    case 'active':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: TradeStatus): string => {
  const labels: Record<TradeStatus, string> = {
    pending: 'Pending',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  };
  return labels[status] || status;
};

export function TradeCard({ trade, onPress }: TradeCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAppSelector(selectUser);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      console.log('[TradeCard] Navigating to trade:', trade.id);
      router.push(`/trades/${trade.id}`);
    }
  };

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine if current user is the buyer
  const isBuyer = user?.id === trade.buyerId;
  const counterpartyName = isBuyer ? trade.sellerDisplayName : trade.buyerDisplayName;

  return (
    <Card variant="outlined" onPress={handlePress} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar name={counterpartyName || 'User'} size="sm" />
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: colors.text }]}>
              {counterpartyName || 'Anonymous'}
            </Text>
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {formatDate(trade.createdAt)}
            </Text>
          </View>
        </View>

        <Badge
          text={getStatusLabel(trade.status)}
          variant={getStatusVariant(trade.status)}
          size="sm"
        />
      </View>

      {/* Trade Details */}
      <View style={[styles.details, { borderColor: colors.border }]}>
        <View style={styles.amountRow}>
          <View style={styles.cryptoAmount}>
            <CryptoIcon currency={trade.cryptoType} size="sm" />
            <Text style={[styles.cryptoValue, { color: colors.text }]}>
              {trade.cryptoAmount.toFixed(6)} {trade.cryptoType}
            </Text>
          </View>

          <View style={styles.directionBadge}>
            <Ionicons
              name={isBuyer ? 'arrow-down' : 'arrow-up'}
              size={14}
              color={isBuyer ? Colors.success.DEFAULT : Colors.danger.DEFAULT}
            />
            <Text
              style={[
                styles.directionText,
                { color: isBuyer ? Colors.success.DEFAULT : Colors.danger.DEFAULT },
              ]}>
              {isBuyer ? 'Buying' : 'Selling'}
            </Text>
          </View>
        </View>

        <View style={styles.fiatRow}>
          <Text style={[styles.fiatLabel, { color: colors.textSecondary }]}>Total Amount</Text>
          <Text style={[styles.fiatValue, { color: colors.text }]}>
            {formatAmount(trade.fiatAmount, trade.fiatCurrency)}
          </Text>
        </View>
      </View>

      {/* Footer - Payment Method */}
      <View style={styles.footer}>
        <View style={[styles.paymentBadge, { backgroundColor: colors.surfaceSecondary }]}>
          <Ionicons name="card-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.paymentText, { color: colors.textSecondary }]}>
            {trade.paymentMethod || 'Unknown'}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: Spacing.sm,
  },
  username: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  date: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  details: {
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: Spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cryptoAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoValue: {
    fontSize: FontSize.base,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginLeft: 4,
  },
  fiatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fiatLabel: {
    fontSize: FontSize.sm,
  },
  fiatValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  paymentText: {
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
});

export default TradeCard;
