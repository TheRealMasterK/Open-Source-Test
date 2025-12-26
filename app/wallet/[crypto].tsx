/**
 * Crypto Detail Screen - Individual crypto asset view
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { GlassCard, GradientButton, CryptoIcon, LoadingSpinner } from '@/components/ui';
import { TransactionItem } from '@/components/features/wallet';
import { useBalance, useTransactions } from '@/hooks/api/useWallet';

type CryptoType = 'USDT' | 'BTC' | 'ETH' | 'SOL';

const CRYPTO_INFO: Record<string, { name: string; network: string; description: string }> = {
  usdt: { name: 'Tether', network: 'TRC20', description: 'Stablecoin pegged to USD' },
  btc: { name: 'Bitcoin', network: 'Bitcoin', description: 'The original cryptocurrency' },
  eth: { name: 'Ethereum', network: 'ERC20', description: 'Smart contract platform' },
  sol: { name: 'Solana', network: 'Solana', description: 'High-performance blockchain' },
};

export default function CryptoDetailScreen() {
  const { crypto } = useLocalSearchParams<{ crypto: string }>();
  const { colors, isDark, shadows } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const cryptoId = (crypto?.toUpperCase() || 'BTC') as CryptoType;
  const cryptoInfo = CRYPTO_INFO[crypto?.toLowerCase() || 'btc'];

  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalance();
  const { data: transactionsData, isLoading: txLoading, refetch: refetchTx } = useTransactions({ page: 1, limit: 5 });

  console.log('[CryptoDetailScreen] Rendering crypto:', cryptoId);

  const balance = balances?.[cryptoId] || 0;
  const fiatValue = cryptoId === 'USDT' ? balance : 0; // Simplified - in production use price API

  const transactions = useMemo(() => {
    if (!transactionsData?.data) return [];
    return transactionsData.data
      .filter((tx: any) => tx.currency === cryptoId)
      .slice(0, 5)
      .map((tx: any) => ({
        id: tx.id,
        date: new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: tx.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        currency: tx.currency,
        amount: tx.amount.toString(),
        status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
        txId: tx.txHash?.slice(-6) || tx.id.slice(-6),
      }));
  }, [transactionsData, cryptoId]);

  const onRefresh = useCallback(async () => {
    console.log('[CryptoDetailScreen] Refreshing...');
    setRefreshing(true);
    try {
      await Promise.all([refetchBalances(), refetchTx()]);
    } catch (error) {
      console.error('[CryptoDetailScreen] Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBalances, refetchTx]);

  const formatBalance = (val: number) => {
    if (cryptoId === 'USDT') return val.toFixed(2);
    if (cryptoId === 'BTC') return val.toFixed(8);
    return val.toFixed(6);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <CryptoIcon currency={cryptoId} size="md" />
          <Text style={[styles.title, { color: colors.text }]}>{cryptoInfo?.name || cryptoId}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />
        }
      >
        {/* Balance Card */}
        <GlassCard variant="default" style={styles.balanceCard}>
          {balancesLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Your Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceAmount, { color: colors.text }]}>
                  {formatBalance(balance)}
                </Text>
                <Text style={[styles.balanceCrypto, { color: Colors.primary.DEFAULT }]}>{cryptoId}</Text>
              </View>
              <Text style={[styles.fiatValue, { color: colors.textSecondary }]}>
                ≈ ${fiatValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </Text>
            </>
          )}
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <GradientButton
            title="Deposit"
            variant="primary"
            size="md"
            onPress={() => router.push('/wallet/deposit')}
            style={styles.actionBtn}
            leftIcon={<Ionicons name="arrow-down" size={18} color={Colors.white} />}
          />
          <GradientButton
            title="Withdraw"
            variant="sell"
            size="md"
            onPress={() => router.push('/wallet/withdraw')}
            style={styles.actionBtn}
            leftIcon={<Ionicons name="arrow-up" size={18} color={Colors.white} />}
          />
        </View>

        {/* Asset Info */}
        <GlassCard variant="default" style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About {cryptoInfo?.name}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Network</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{cryptoInfo?.network}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {cryptoId === 'USDT' ? 'Stablecoin' : 'Cryptocurrency'}
              </Text>
            </View>
          </View>
          <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
            {cryptoInfo?.description}
          </Text>
        </GlassCard>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/wallet/history')}>
              <Text style={[styles.seeAll, { color: Colors.primary.DEFAULT }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <GlassCard variant="default" noPadding>
            {txLoading ? (
              <View style={styles.loadingContainer}><LoadingSpinner /></View>
            ) : transactions.length > 0 ? (
              transactions.map((tx: any, i: number) => (
                <View
                  key={tx.id}
                  style={[
                    styles.txItem,
                    i < transactions.length - 1 && { borderBottomWidth: 1, borderColor: colors.border }
                  ]}
                >
                  <TransactionItem {...tx} onCopyTxId={() => console.log('Copy:', tx.txId)} />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={40} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No {cryptoId} transactions yet
                </Text>
              </View>
            )}
          </GlassCard>
        </View>

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold },
  placeholder: { width: 40 },
  scrollView: { flex: 1, paddingHorizontal: Spacing.md },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  balanceLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, marginBottom: Spacing.xs },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  balanceAmount: { fontSize: FontSize['3xl'], fontFamily: FontFamily.bold },
  balanceCrypto: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold },
  fiatValue: { fontSize: FontSize.base, fontFamily: FontFamily.medium },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionBtn: { flex: 1 },
  infoCard: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, marginBottom: Spacing.md },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, marginBottom: Spacing.xxs },
  infoValue: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  infoDescription: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, lineHeight: 20 },
  transactionsSection: { marginBottom: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  loadingContainer: { padding: Spacing.xl, alignItems: 'center' },
  txItem: { padding: Spacing.md },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
});
