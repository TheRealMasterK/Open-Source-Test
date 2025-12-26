/**
 * Transaction History Screen
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { GlassCard, LoadingSpinner, EmptyState } from '@/components/ui';
import { TransactionItem } from '@/components/features/wallet';
import { useTransactions } from '@/hooks/api/useWallet';

type FilterType = 'all' | 'deposit' | 'withdraw' | 'transfer';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'deposit', label: 'Deposits' },
  { id: 'withdraw', label: 'Withdrawals' },
  { id: 'transfer', label: 'Transfers' },
];

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { data: transactionsData, isLoading, refetch } = useTransactions({ page: 1, limit: 50 });

  console.log('[HistoryScreen] Rendering, filter:', activeFilter, 'loading:', isLoading);

  const transactions = useMemo(() => {
    if (!transactionsData?.data) return [];

    const mapped = transactionsData.data.map((tx: any) => ({
      id: tx.id,
      date: new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: tx.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      rawType: tx.type.toLowerCase(),
      currency: tx.currency,
      amount: tx.amount.toString(),
      status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
      txId: tx.txHash?.slice(-8) || tx.id.slice(-8),
    }));

    if (activeFilter === 'all') return mapped;
    return mapped.filter((tx: any) => tx.rawType.includes(activeFilter));
  }, [transactionsData, activeFilter]);

  const onRefresh = useCallback(async () => {
    console.log('[HistoryScreen] Refreshing...');
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('[HistoryScreen] Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleFilterChange = useCallback((filter: FilterType) => {
    Haptics.selectionAsync();
    setActiveFilter(filter);
    console.log('[HistoryScreen] Filter changed to:', filter);
  }, []);

  const renderTransaction = useCallback(({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.txItem,
        index < transactions.length - 1 && { borderBottomWidth: 1, borderColor: colors.border }
      ]}
    >
      <TransactionItem
        {...item}
        onCopyTxId={() => console.log('[HistoryScreen] Copy txId:', item.txId)}
      />
    </View>
  ), [transactions.length, colors.border]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <EmptyState
        icon="receipt-outline"
        title="No Transactions"
        message={activeFilter === 'all'
          ? "You haven't made any transactions yet"
          : `No ${activeFilter} transactions found`}
      />
    </View>
  ), [activeFilter]);

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
        <Text style={[styles.title, { color: colors.text }]}>Transaction History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeFilter === filter.id
                    ? Colors.primary.DEFAULT
                    : isDark ? colors.surface : colors.card,
                  borderColor: activeFilter === filter.id ? Colors.primary.DEFAULT : colors.border,
                },
              ]}
              onPress={() => handleFilterChange(filter.id)}
            >
              <Text style={[
                styles.filterText,
                { color: activeFilter === filter.id ? Colors.white : colors.text }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transactions List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      ) : (
        <GlassCard variant="default" noPadding style={styles.listCard}>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary.DEFAULT}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={transactions.length === 0 ? styles.emptyList : undefined}
          />
        </GlassCard>
      )}
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
  title: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold },
  placeholder: { width: 40 },
  filtersContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  filters: {
    gap: Spacing.sm,
  },
  filterChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCard: {
    flex: 1,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  txItem: {
    padding: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyList: {
    flexGrow: 1,
  },
});
