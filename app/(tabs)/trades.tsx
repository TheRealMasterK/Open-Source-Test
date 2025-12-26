/**
 * Trades Screen
 * View and manage trades - Connected to backend
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { useActiveTrades, useCompletedTrades, useTrades } from '@/hooks/api/useTrades';
import { Trade } from '@/types/trade.types';

type TradeTab = 'active' | 'completed' | 'disputed';

// Trade Card Component
function TradeCard({ trade, onPress }: { trade: Trade; onPress: () => void }) {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success.DEFAULT;
      case 'active': case 'in_progress': return Colors.primary.DEFAULT;
      case 'pending': return Colors.warning.DEFAULT;
      case 'disputed': return Colors.danger.DEFAULT;
      case 'cancelled': return Colors.danger.DEFAULT;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.tradeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}>
      <View style={styles.tradeHeader}>
        <View style={styles.tradeInfo}>
          <Text style={[styles.tradeId, { color: colors.textSecondary }]}>#{trade.tradeId || trade.id.slice(0, 8)}</Text>
          <Text style={[styles.tradeDate, { color: colors.textTertiary }]}>{formatDate(trade.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(trade.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(trade.status) }]}>
            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.tradeBody}>
        <View style={styles.tradeAmount}>
          <Text style={[styles.cryptoAmount, { color: colors.text }]}>
            {trade.cryptoAmount} {trade.cryptoType}
          </Text>
          <Text style={[styles.fiatAmount, { color: colors.textSecondary }]}>
            {trade.fiatCurrency} {trade.fiatAmount.toLocaleString()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>

      <View style={styles.tradeFooter}>
        <View style={styles.paymentInfo}>
          <Ionicons name="card-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.paymentMethod, { color: colors.textSecondary }]}>{trade.paymentMethod}</Text>
        </View>
        <View style={[styles.escrowBadge, { backgroundColor: `${getStatusColor(trade.escrowStatus)}15` }]}>
          <Ionicons name="shield-checkmark" size={12} color={getStatusColor(trade.escrowStatus)} />
          <Text style={[styles.escrowText, { color: getStatusColor(trade.escrowStatus) }]}>
            Escrow: {trade.escrowStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TradesScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TradeTab>('active');
  const [refreshing, setRefreshing] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // API Hooks - Only fetch data for the active tab AND when authenticated to reduce API calls
  const { data: activeTradesData, isLoading: activeLoading, error: activeError, refetch: refetchActive } = useActiveTrades({ enabled: isAuthenticated && activeTab === 'active' });
  const { data: completedTradesData, isLoading: completedLoading, error: completedError, refetch: refetchCompleted } = useCompletedTrades({ enabled: isAuthenticated && activeTab === 'completed' });
  const { data: allTradesData, isLoading: allLoading, error: allError, refetch: refetchAll } = useTrades({ status: 'disputed' }, { enabled: isAuthenticated && activeTab === 'disputed' });

  console.log('[Trades] Rendering:', {
    activeTab,
    isAuthenticated,
    activeLoading,
    activeCount: activeTradesData?.length,
    activeError: activeError?.message,
    completedLoading,
    completedCount: completedTradesData?.length,
    completedError: completedError?.message,
  });

  // Get trades for current tab
  const { trades, isLoading, count } = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return {
          trades: activeTradesData || [],
          isLoading: activeLoading,
          count: activeTradesData?.length || 0,
        };
      case 'completed':
        return {
          trades: completedTradesData || [],
          isLoading: completedLoading,
          count: completedTradesData?.length || 0,
        };
      case 'disputed':
        const disputed = allTradesData?.data?.filter((t: Trade) => t.status === 'disputed') || [];
        return {
          trades: disputed,
          isLoading: allLoading,
          count: disputed.length,
        };
      default:
        return { trades: [], isLoading: false, count: 0 };
    }
  }, [activeTab, activeTradesData, completedTradesData, allTradesData, activeLoading, completedLoading, allLoading]);

  const activeCounts = {
    active: activeTradesData?.length || 0,
    completed: completedTradesData?.length || 0,
    disputed: allTradesData?.data?.filter((t: Trade) => t.status === 'disputed')?.length || 0,
  };

  const onRefresh = useCallback(async () => {
    // Don't refetch if not authenticated
    if (!isAuthenticated) {
      console.log('[Trades] Skipping refresh - not authenticated');
      return;
    }
    console.log('[Trades] Refreshing active tab:', activeTab);
    setRefreshing(true);
    try {
      // Only refresh the active tab to reduce API calls
      switch (activeTab) {
        case 'active':
          await refetchActive();
          break;
        case 'completed':
          await refetchCompleted();
          break;
        case 'disputed':
          await refetchAll();
          break;
      }
    } catch (error) {
      console.error('[Trades] Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [isAuthenticated, activeTab, refetchActive, refetchCompleted, refetchAll]);

  const handleTradePress = (tradeId: string) => {
    console.log('[Trades] Trade pressed:', tradeId);
    router.push(`/trades/${tradeId}`);
  };

  const TabButton = ({ label, tab, count = 0 }: { label: string; tab: TradeTab; count?: number }) => {
    const isActive = activeTab === tab;

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tab)}
        style={[styles.tabButton, isActive && { backgroundColor: Colors.primary.DEFAULT }]}>
        <View style={styles.tabButtonContent}>
          <Text style={[styles.tabButtonText, { color: isActive ? Colors.white : colors.textSecondary }]}>
            {label}
          </Text>
          {count > 0 && (
            <View style={[styles.tabBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : Colors.primary.DEFAULT }]}>
              <Text style={styles.tabBadgeText}>{count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'active':
        return { icon: 'swap-horizontal-outline' as const, title: 'No active trades', subtitle: 'Start a trade from the marketplace' };
      case 'completed':
        return { icon: 'checkmark-circle-outline' as const, title: 'No completed trades', subtitle: 'Completed trades will appear here' };
      case 'disputed':
        return { icon: 'alert-circle-outline' as const, title: 'No disputes', subtitle: 'Great! You have no disputes' };
    }
  };

  const emptyState = getEmptyMessage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Trades</Text>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <View style={styles.tabRow}>
          <TabButton label="Active" tab="active" count={activeCounts.active} />
          <TabButton label="Completed" tab="completed" count={activeCounts.completed} />
          <TabButton label="Disputed" tab="disputed" count={activeCounts.disputed} />
        </View>
      </View>

      {/* Trades List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />
        }>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading trades...</Text>
          </View>
        ) : trades.length > 0 ? (
          trades.map((trade: Trade) => (
            <TradeCard key={trade.id} trade={trade} onPress={() => handleTradePress(trade.id)} />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name={emptyState.icon} size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{emptyState.title}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>{emptyState.subtitle}</Text>
            {activeTab === 'active' && (
              <TouchableOpacity
                style={[styles.browseBtn, { backgroundColor: Colors.primary.DEFAULT }]}
                onPress={() => router.push('/(tabs)/marketplace')}>
                <Text style={styles.browseBtnText}>Browse Marketplace</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  title: { fontSize: FontSize['2xl'], fontWeight: '700' },
  tabContainer: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, borderRadius: BorderRadius.xl, padding: 4 },
  tabRow: { flexDirection: 'row' },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm + 4, borderRadius: BorderRadius.lg },
  tabButtonContent: { flexDirection: 'row', alignItems: 'center' },
  tabButtonText: { fontWeight: '600', fontSize: FontSize.sm },
  tabBadge: { marginLeft: Spacing.sm, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  tabBadgeText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: '600' },
  scrollView: { flex: 1, paddingHorizontal: Spacing.md },
  loadingContainer: { paddingVertical: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  loadingText: { fontSize: FontSize.sm },
  tradeCard: { borderRadius: BorderRadius.xl, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  tradeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  tradeInfo: { gap: 2 },
  tradeId: { fontSize: FontSize.sm, fontWeight: '600' },
  tradeDate: { fontSize: FontSize.xs },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  statusText: { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'capitalize' },
  tradeBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  tradeAmount: { gap: 2 },
  cryptoAmount: { fontSize: FontSize.lg, fontWeight: '700' },
  fiatAmount: { fontSize: FontSize.sm },
  tradeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  paymentMethod: { fontSize: FontSize.xs },
  escrowBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm, gap: 4 },
  escrowText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  emptyState: { alignItems: 'center', borderRadius: BorderRadius.xl, padding: Spacing.xl },
  emptyTitle: { marginTop: Spacing.md, fontSize: FontSize.lg, fontWeight: '600' },
  emptySubtitle: { marginTop: Spacing.sm, textAlign: 'center', fontSize: FontSize.sm },
  browseBtn: { marginTop: Spacing.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg },
  browseBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSize.base },
  spacer: { height: Spacing.xl },
});
