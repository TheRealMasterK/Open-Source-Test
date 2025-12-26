/**
 * Dashboard Screen - Enterprise Grade
 * Premium home screen with stats cards, wallet overview, and activity
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Gradients } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';
import { useDashboardStats, useRecentActivity, useRefreshDashboard } from '@/hooks/api/useDashboard';
import { useBalance } from '@/hooks/api/useWallet';
import { StatCard, GlassCard, GradientButton, LoadingSpinner } from '@/components/ui';
import { DashboardActivityItem } from '@/components/dashboard';

export default function DashboardScreen() {
  const { colors, shadows, isDark } = useTheme();
  const user = useAppSelector(selectUser);
  const [refreshing, setRefreshing] = React.useState(false);

  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();
  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalance();
  const { refresh: refreshDashboard } = useRefreshDashboard();

  console.log('[Dashboard] Rendering, user:', user?.displayName, 'isDark:', isDark);

  const onRefresh = React.useCallback(async () => {
    console.log('[Dashboard] Refreshing...');
    setRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchBalances()]);
      refreshDashboard();
    } catch (error) {
      console.error('[Dashboard] Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchStats, refetchBalances, refreshDashboard]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatBalance = (value: number | undefined, decimals = 2): string => {
    if (value === undefined || value === null) return '0.00';
    return value.toFixed(decimals);
  };

  const displayStats = stats.length > 0 ? stats : [
    { id: 'active-trades', icon: 'swap-horizontal', value: 0, label: 'Active Trades', subtitle: '0 total' },
    { id: 'completed', icon: 'checkmark-circle', value: 0, label: 'Completed', subtitle: '0% success' },
    { id: 'volume', icon: 'trending-up', value: '$0', label: 'Volume', subtitle: 'This month' },
    { id: 'escrow', icon: 'shield', value: 0, label: 'In Escrow', subtitle: '$0 held' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />
        }
      >
        {/* Premium Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()}</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.displayName || 'Trader'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={[styles.notificationBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Error Banner */}
        {statsError && (
          <GlassCard variant="danger" style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color={Colors.danger.DEFAULT} />
            <Text style={[styles.errorText, { color: Colors.danger.DEFAULT }]}>
              Failed to load. Pull to refresh.
            </Text>
          </GlassCard>
        )}

        {/* Total Balance Card */}
        <LinearGradient
          colors={Gradients.primary as unknown as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.balanceCard, shadows.xl]}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity style={styles.eyeButton}>
              <Ionicons name="eye-outline" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceValue}>
            ${balancesLoading ? '...' : (parseFloat(formatBalance(balances?.USDT)) * 1).toFixed(2)}
          </Text>
          <View style={styles.balanceActions}>
            <GradientButton title="Deposit" size="sm" variant="buy" onPress={() => router.push('/wallet/deposit')} glow={false} />
            <GradientButton title="Withdraw" size="sm" variant="sell" onPress={() => router.push('/wallet/withdraw')} glow={false} />
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
          <View style={styles.statsGrid}>
            {statsLoading ? (
              <LoadingSpinner />
            ) : (
              displayStats.map((stat, index) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={String(stat.value)}
                  subValue={stat.subtitle}
                  icon={<Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.primary.DEFAULT} />}
                  variant={index === 0 ? 'gradient' : 'default'}
                  gradientColors={index === 0 ? Gradients.primary as readonly [string, string] : undefined}
                  compact
                  style={styles.statCard}
                />
              ))
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: 'add-circle', label: 'Create Offer', color: Colors.primary.DEFAULT, route: '/offers/create' },
              { icon: 'storefront', label: 'Marketplace', color: Colors.success.DEFAULT, route: '/(tabs)/marketplace' },
              { icon: 'swap-horizontal', label: 'My Trades', color: Colors.warning.DEFAULT, route: '/(tabs)/trades' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }, shadows.card]}
                onPress={() => router.push(action.route as never)}
                activeOpacity={0.8}
              >
                <View style={[styles.quickIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={action.color} />
                </View>
                <Text style={[styles.quickLabel, { color: colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/trades')}>
              <Text style={[styles.seeAll, { color: Colors.primary.DEFAULT }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <GlassCard variant="default" noPadding>
            {activitiesLoading ? (
              <View style={styles.loadingContainer}><LoadingSpinner /></View>
            ) : activities.length > 0 ? (
              activities.slice(0, 4).map((activity, i) => (
                <View key={activity.id} style={[styles.activityItem, i < 3 && { borderBottomWidth: 1, borderColor: colors.border }]}>
                  <DashboardActivityItem activity={activity} />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="time-outline" size={32} color={colors.textTertiary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Recent Activity</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Start trading to see activity</Text>
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
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerLeft: { flex: 1 },
  greeting: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  userName: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, marginTop: 2 },
  notificationBtn: { width: 48, height: 48, borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationBadge: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.danger.DEFAULT, alignItems: 'center', justifyContent: 'center' },
  notificationCount: { fontSize: 10, color: Colors.white, fontFamily: FontFamily.bold },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  errorText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  balanceCard: { padding: Spacing.lg, borderRadius: BorderRadius['2xl'], marginBottom: Spacing.lg },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  eyeButton: { padding: Spacing.xs },
  balanceValue: { color: Colors.white, fontSize: FontSize['4xl'], fontFamily: FontFamily.bold, marginVertical: Spacing.sm, letterSpacing: -1 },
  balanceActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  statsSection: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, marginBottom: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { width: '48%' },
  quickSection: { marginBottom: Spacing.lg },
  quickGrid: { flexDirection: 'row', gap: Spacing.sm },
  quickCard: { flex: 1, alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.xl, borderWidth: 1 },
  quickIcon: { width: 52, height: 52, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  quickLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, textAlign: 'center' },
  activitySection: { marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  loadingContainer: { padding: Spacing.xl, alignItems: 'center' },
  activityItem: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  emptyState: { alignItems: 'center', paddingVertical: Spacing['2xl'] },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, marginBottom: Spacing.xs },
  emptySubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
});
