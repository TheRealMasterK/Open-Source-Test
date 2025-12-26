/**
 * Wallet Screen - Enterprise Grade
 * Premium crypto wallet with featured card and transaction history
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { CryptoCard, GlassCard, GradientButton, LoadingSpinner } from '@/components/ui';
import { TransactionItem } from '@/components/features/wallet';
import { useBalance, useTransactions } from '@/hooks/api/useWallet';

export default function WalletScreen() {
  const { colors, shadows, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data: balances, isLoading: balancesLoading, error: balancesError, refetch: refetchBalances } = useBalance();
  const { data: transactionsData, isLoading: txLoading, refetch: refetchTx } = useTransactions({ page: 1, limit: 5 });

  console.log('[Wallet] Rendering, isAuthenticated:', isAuthenticated, 'balances:', balances);

  const totalBalance = balances?.estimatedValueUSD || 0;

  const onRefresh = useCallback(async () => {
    // Don't refetch if not authenticated
    if (!isAuthenticated) {
      console.log('[Wallet] Skipping refresh - not authenticated');
      return;
    }
    console.log('[Wallet] Refreshing...');
    setRefreshing(true);
    try {
      await Promise.all([refetchBalances(), refetchTx()]);
    } catch (error) {
      console.error('[Wallet] Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [isAuthenticated, refetchBalances, refetchTx]);

  const transactions = useMemo(() => {
    if (!transactionsData?.data) return [];
    return transactionsData.data.map((tx: any) => ({
      date: new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: tx.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      currency: tx.currency,
      amount: tx.amount.toString(),
      status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
      txId: tx.txHash?.slice(-6) || tx.id.slice(-6),
    }));
  }, [transactionsData]);

  const formatBalance = (val: number | undefined, decimals = 2) => (val ?? 0).toFixed(decimals);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Wallet</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your crypto assets</Text>
          </View>
          <TouchableOpacity
            style={[styles.historyBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
            onPress={() => router.push('/wallet/history' as never)}
          >
            <Ionicons name="time-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Error State */}
        {balancesError && (
          <GlassCard variant="danger" style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color={Colors.danger.DEFAULT} />
            <Text style={[styles.errorText, { color: Colors.danger.DEFAULT }]}>Failed to load. Pull to refresh.</Text>
          </GlassCard>
        )}

        {/* Featured USDT Card */}
        {balancesLoading ? (
          <View style={styles.loadingContainer}><LoadingSpinner /></View>
        ) : (
          <CryptoCard
            crypto="USDT"
            balance={`${formatBalance(balances?.USDT)} USDT`}
            fiatValue={`$${formatBalance(balances?.USDT)}`}
            change24h={{ value: '+0.01%', isPositive: true }}
            featured
            onSend={() => router.push('/wallet/withdraw' as never)}
            onReceive={() => router.push('/wallet/deposit' as never)}
            style={styles.featuredCard}
          />
        )}

        {/* Other Crypto Cards */}
        <View style={styles.cryptoList}>
          <CryptoCard
            crypto="BTC"
            balance={`${formatBalance(balances?.BTC, 6)} BTC`}
            fiatValue="$0.00"
            change24h={{ value: '+2.4%', isPositive: true }}
            onPress={() => router.push('/wallet/btc' as never)}
          />
          <CryptoCard
            crypto="ETH"
            balance={`${formatBalance(balances?.ETH, 5)} ETH`}
            fiatValue="$0.00"
            change24h={{ value: '-1.2%', isPositive: false }}
            onPress={() => router.push('/wallet/eth' as never)}
            style={styles.cryptoCard}
          />
          <CryptoCard
            crypto="SOL"
            balance={`${formatBalance(balances?.SOL, 4)} SOL`}
            fiatValue="$0.00"
            change24h={{ value: '+5.8%', isPositive: true }}
            onPress={() => router.push('/wallet/sol' as never)}
            style={styles.cryptoCard}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <GradientButton title="Deposit" variant="primary" size="sm" onPress={() => router.push('/wallet/deposit' as never)} style={styles.actionBtn} glow={false} />
          <GradientButton title="Withdraw" variant="sell" size="sm" onPress={() => router.push('/wallet/withdraw' as never)} style={styles.actionBtn} glow={false} />
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => router.push('/wallet/transfer' as never)}
          >
            <Ionicons name="swap-horizontal" size={18} color={colors.text} />
            <Text style={[styles.outlineBtnText, { color: colors.text }]}>Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/wallet/history' as never)}>
              <Text style={[styles.seeAll, { color: Colors.primary.DEFAULT }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <GlassCard variant="default" noPadding>
            {txLoading ? (
              <View style={styles.loadingContainer}><LoadingSpinner /></View>
            ) : transactions.length > 0 ? (
              transactions.map((tx: any, i: number) => (
                <View key={i} style={[styles.txItem, i < transactions.length - 1 && { borderBottomWidth: 1, borderColor: colors.border }]}>
                  <TransactionItem {...tx} onCopyTxId={() => console.log('Copy:', tx.txId)} />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="receipt-outline" size={32} color={colors.textTertiary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Transactions Yet</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Make a deposit to get started</Text>
              </View>
            )}
          </GlassCard>
        </View>

        {/* Portfolio Summary */}
        <GlassCard variant="accent" style={styles.portfolioCard}>
          <View style={styles.portfolioHeader}>
            <Ionicons name="pie-chart" size={20} color={Colors.primary.DEFAULT} />
            <Text style={[styles.portfolioTitle, { color: colors.text }]}>Portfolio Value</Text>
          </View>
          <Text style={[styles.portfolioValue, { color: colors.text }]}>
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.portfolioLegend}>
            {[
              { color: Colors.crypto.USDT, label: 'USDT', pct: balances?.USDT ? Math.round((balances.USDT / (totalBalance || 1)) * 100) : 0 },
              { color: Colors.crypto.BTC, label: 'BTC', pct: 0 },
              { color: Colors.crypto.ETH, label: 'ETH', pct: 0 },
              { color: Colors.crypto.SOL, label: 'SOL', pct: 0 },
            ].map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>{item.label} {item.pct}%</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Security Tip */}
        <GlassCard variant="default" style={styles.tipCard}>
          <View style={styles.tipRow}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.success.DEFAULT} />
            <View style={styles.tipContent}>
              <Text style={[styles.tipLabel, { color: Colors.success.DEFAULT }]}>Security Tip</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Always verify wallet addresses before sending funds.</Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.lg },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, marginTop: 2 },
  historyBtn: { width: 44, height: 44, borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  errorText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  loadingContainer: { padding: Spacing.xl, alignItems: 'center' },
  featuredCard: { marginBottom: Spacing.md },
  cryptoList: { gap: Spacing.sm, marginBottom: Spacing.lg },
  cryptoCard: { marginTop: Spacing.sm },
  actionsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  actionBtn: { flex: 1 },
  outlineBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: BorderRadius.lg, borderWidth: 1, gap: Spacing.xs },
  outlineBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  transactionsSection: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  txItem: { padding: Spacing.md },
  emptyState: { alignItems: 'center', paddingVertical: Spacing['2xl'] },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, marginBottom: Spacing.xs },
  emptySubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  portfolioCard: { marginBottom: Spacing.md },
  portfolioHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  portfolioTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold },
  portfolioValue: { fontSize: FontSize['3xl'], fontFamily: FontFamily.bold, marginBottom: Spacing.md },
  portfolioLegend: { flexDirection: 'row', gap: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  tipCard: { marginBottom: Spacing.md },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  tipContent: { flex: 1 },
  tipLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, marginBottom: 2 },
  tipText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
});
