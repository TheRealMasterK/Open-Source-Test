/**
 * TransactionItem Component
 * Displays a single transaction row in the transaction history
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

export type TransactionType = 'Deposit' | 'Withdraw' | 'Transfer';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface TransactionItemProps {
  date: string;
  type: TransactionType;
  currency: string;
  amount: string;
  status: TransactionStatus;
  txId: string;
  onCopyTxId?: (txId: string) => void;
}

export function TransactionItem({
  date,
  type,
  currency,
  amount,
  status,
  txId,
  onCopyTxId,
}: TransactionItemProps) {
  const { colors } = useTheme();

  console.log('[TransactionItem] Rendering:', type, currency, amount, status);

  const getStatusColor = (): string => {
    switch (status) {
      case 'Completed':
        return Colors.success.DEFAULT;
      case 'Pending':
        return Colors.warning.DEFAULT;
      case 'Failed':
        return Colors.danger.DEFAULT;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusBg = (): string => {
    switch (status) {
      case 'Completed':
        return Colors.success.bg;
      case 'Pending':
        return Colors.warning.bg;
      case 'Failed':
        return Colors.danger.bg;
      default:
        return colors.surface;
    }
  };

  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'Deposit':
        return 'arrow-down';
      case 'Withdraw':
        return 'arrow-up';
      case 'Transfer':
        return 'swap-horizontal';
      default:
        return 'help-circle';
    }
  };

  const handleCopyTxId = async () => {
    try {
      await Clipboard.setStringAsync(txId);
      console.log('[TransactionItem] Copied txId:', txId);
      onCopyTxId?.(txId);
    } catch (error) {
      console.error('[TransactionItem] Failed to copy txId:', error);
    }
  };

  return (
    <View
      style={styles.container}
      accessibilityLabel={`${type} ${amount} ${currency} on ${date}, status: ${status}`}
      accessibilityRole="text"
    >
      <Text style={[styles.date, { color: colors.textSecondary }]}>{date}</Text>
      <View style={styles.typeContainer}>
        <Ionicons
          name={getTypeIcon()}
          size={14}
          color={type === 'Deposit' ? Colors.success.DEFAULT : colors.textSecondary}
        />
        <Text style={[styles.type, { color: colors.text }]}>{type}</Text>
      </View>
      <Text style={[styles.currency, { color: colors.text }]}>{currency}</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{amount}</Text>
      <View style={[styles.statusBadge, { backgroundColor: getStatusBg() }]}>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>{status}</Text>
      </View>
      <TouchableOpacity
        style={styles.txIdContainer}
        onPress={handleCopyTxId}
        accessibilityLabel={`Copy transaction ID ${txId}`}
        accessibilityRole="button"
        accessibilityHint="Copies the transaction ID to clipboard"
      >
        <Text style={[styles.txIdText, { color: colors.textTertiary }]}>
          {txId.slice(0, 3)}...{txId.slice(-3)}
        </Text>
        <Ionicons name="copy-outline" size={14} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  date: {
    flex: 1,
    fontSize: FontSize.xs,
  },
  typeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  type: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  currency: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  amount: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  statusBadge: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  txIdContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  txIdText: {
    fontSize: FontSize.xs,
  },
});

export default TransactionItem;
