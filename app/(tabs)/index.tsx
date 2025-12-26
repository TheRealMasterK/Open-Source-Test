/**
 * Dashboard Screen - Enterprise Grade
 * Premium home screen with animated stats, wallet overview, and activity
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Gradients } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector } from '@/store';
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice';
import { useDashboardStats, useRecentActivity, useRefreshDashboard } from '@/hooks/api/useDashboard';
import { useBalance } from '@/hooks/api/useWallet';
import { StatCard, GlassCard, GradientButton, AnimatedView, PulseGlow, CountUpText, SkeletonCard, SkeletonList } from '@/components/ui';
import { DashboardActivityItem } from '@/components/dashboard';

export default function DashboardScreen() {
  const { colors, shadows, isDark } = useTheme();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [refreshing, setRefreshing] = React.useState(false);

  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();
  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalance();
  const { refresh: refreshDashboard } = useRefreshDashboard();

  console.log('[Dashboard] Rendering, user:', user?.displayName, 'isAuthenticated:', isAuthenticated);

  const onRefresh = React.useCallback(async () => {
    if (!isAuthenticated) {
      console.log('[Dashboard] Skipping refresh - not authenticated');
      return;
    }
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
  }, [isAuthenticated, refetchStats, refetchBalances, refreshDashboard]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const totalBalance = useMemo(() => {
    if (!balances?.USDT) return 0;
    return parseFloat(balances.USDT.toFixed(2));
  }, [balances]);

  const displayStats = useMemo(() => stats.length > 0 ? stats : [
    { id: 'active-trades', icon: 'swap-horizontal', value: 0, label: 'Active Trades', subtitle: '0 total' },
    { id: 'completed', icon: 'checkmark-circle', value: 0, label: 'Completed', subtitle: '0% success' },
    { id: 'volume', icon: 'trending-up', value: '$0', label: 'Volume', subtitle: 'This month' },
    { id: 'escrow', icon: 'shield', value: 0, label: 'In Escrow', subtitle: '$0 held' },
  ], [stats]);

  const quickActions = useMemo(() => [
    { icon: 'add-circle', label: 'Create\nOffer', color: Colors.primary.DEFAULT, route: '/offers/create' },
    { icon: 'storefront', label: 'Market-\nplace', color: Colors.success.DEFAULT, route: '/(tabs)/marketplace' },
    { icon: 'swap-horizontal', label: 'My\nTrades', color: Colors.warning.DEFAULT, route: '/(tabs)/trades' },
    { icon: 'wallet', label: 'My\nWallet', color: Colors.info.DEFAULT, route: '/(tabs)/wallet' },
  ], []);

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
        {/* Animated Header */}
        <AnimatedView animation="fadeSlideUp" staggerIndex={0}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting}</Text>
              <Text style={[styles.userName, { color: colors.text }]}>{user?.displayName || 'Trader'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/notifications' as never)}
              style={[styles.notificationBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </AnimatedView>

        {/* Error Banner */}
        {statsError && (
          <AnimatedView animation="scale">
            <GlassCard variant="danger" style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={Colors.danger.DEFAULT} />
              <Text style={[styles.errorText, { color: Colors.danger.DEFAULT }]}>
                Failed to load. Pull to refresh.
              </Text>
            </GlassCard>
          </AnimatedView>
        )}

        {/* Animated Balance Card with Pulse Glow */}
        <AnimatedView animation="fadeSlideUp" staggerIndex={1}>
          <PulseGlow glowColor={Colors.primary.DEFAULT} glowIntensity="medium" pulseSpeed="slow">
            <LinearGradient
              colors={Gradients.primary as unknown as readonly [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.balanceCard, shadows.xl]}
            >
              <View style={styles.balanceHeader}>
                <View style={styles.balanceLabelRow}>
                  <View style={styles.balanceDot} />
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                </View>
                <TouchableOpacity style={styles.eyeButton}>
                  <Ionicons name="eye-outline" size={20} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              </View>

              {balancesLoading ? (
                <Text style={styles.balanceValue}>$...</Text>
              ) : (
                <CountUpText
                  value={totalBalance}
                  prefix="$"
                  decimals={2}
                  duration={1000}
                  style={styles.balanceValue}
                />
              )}

              <View style={styles.balanceSubRow}>
                <View style={styles.balanceChange}>
                  <Ionicons name="trending-up" size={14} color={Colors.success.light} />
                  <Text style={styles.balanceChangeText}>+2.4%</Text>
                </View>
                <Text style={styles.balancePeriod}>Last 24h</Text>
              </View>

              <View style={styles.balanceActions}>
                <GradientButton
                  title="Deposit"
                  size="sm"
                  variant="buy"
                  onPress={() => router.push('/wallet/deposit' as never)}
                  glow={false}
                  leftIcon={<Ionicons name="arrow-down" size={16} color={Colors.white} />}
                  style={styles.actionButton}
                />
                <GradientButton
                  title="Withdraw"
                  size="sm"
                  variant="sell"
                  onPress={() => router.push('/wallet/withdraw' as never)}
                  glow={false}
                  leftIcon={<Ionicons name="arrow-up" size={16} color={Colors.white} />}
                  style={styles.actionButton}
                />
              </View>
            </LinearGradient>
          </PulseGlow>
        </AnimatedView>

        {/* Quick Actions Grid */}
        <AnimatedView animation="fadeSlideUp" staggerIndex={2}>
          <View style={styles.quickSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
              {quickActions.map((action, index) => (
                <AnimatedView key={action.label} animation="scale" staggerIndex={index} staggerDelay={50}>
                  <TouchableOpacity
                    style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }, shadows.card]}
                    onPress={() => router.push(action.route as never)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quickIcon, { backgroundColor: `${action.color}15` }]}>
                      <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={action.color} />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>{action.label}</Text>
                  </TouchableOpacity>
                </AnimatedView>
              ))}
            </View>
          </View>
        </AnimatedView>

        {/* Stats Grid */}
        <AnimatedView animation="fadeSlideUp" staggerIndex={3}>
          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
            {statsLoading ? (
              <View style={styles.skeletonRow}>
                <SkeletonCard style={styles.skeletonCard} />
                <SkeletonCard style={styles.skeletonCard} />
              </View>
            ) : (
              <View style={styles.statsGrid}>
                {displayStats.map((stat, index) => (
                  <AnimatedView key={stat.id} animation="scale" staggerIndex={index} staggerDelay={60}>
                    <StatCard
                      label={stat.label}
                      value={String(stat.value)}
                      subValue={stat.subtitle}
                      icon={<Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.primary.DEFAULT} />}
                      variant={index === 0 ? 'gradient' : 'default'}
                      gradientColors={index === 0 ? Gradients.primary as readonly [string, string] : undefined}
                      compact
                      style={styles.statCard}
                    />
                  </AnimatedView>
                ))}
              </View>
            )}
          </View>
        </AnimatedView>

        {/* Recent Activity */}
        <AnimatedView animation="fadeSlideUp" staggerIndex={4}>
          <View style={styles.activitySection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/trades')}
                style={styles.seeAllBtn}
              >
                <Text style={[styles.seeAll, { color: Colors.primary.DEFAULT }]}>See All</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>
            <GlassCard variant="default" noPadding>
              {activitiesLoading ? (
                <SkeletonList count={3} style={styles.skeletonList} />
              ) : activities.length > 0 ? (
                activities.slice(0, 4).map((activity, i) => (
                  <AnimatedView key={activity.id} animation="slideLeft" staggerIndex={i} staggerDelay={80}>
                    <View style={[styles.activityItem, i < 3 && { borderBottomWidth: 1, borderColor: colors.border }]}>
                      <DashboardActivityItem activity={activity} />
                    </View>
                  </AnimatedView>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <View style={[styles.emptyIcon, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}>
                    <Ionicons name="time-outline" size={36} color={colors.textTertiary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No Recent Activity</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    Start trading to see your activity here
                  </Text>
                  <GradientButton
                    title="Browse Marketplace"
                    variant="primary"
                    size="sm"
                    onPress={() => router.push('/(tabs)/marketplace')}
                    style={styles.emptyButton}
                    glow={false}
                  />
                </View>
              )}
            </GlassCard>
          </View>
        </AnimatedView>

        {/* Pro Tip Card */}
        <AnimatedView animation="fadeSlideUp" staggerIndex={5}>
          <LinearGradient
            colors={isDark
              ? ['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.1)']
              : ['rgba(99, 102, 241, 0.08)', 'rgba(139, 92, 246, 0.05)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.proTipCard, { borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)' }]}
          >
            <View style={styles.proTipIcon}>
              <Ionicons name="bulb" size={20} color={Colors.primary.DEFAULT} />
            </View>
            <View style={styles.proTipContent}>
              <Text style={[styles.proTipLabel, { color: Colors.primary.DEFAULT }]}>Pro Tip</Text>
              <Text style={[styles.proTipText, { color: colors.textSecondary }]}>
                Complete your verification to unlock higher trading limits and exclusive features.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/kyc' as never)}
              style={[styles.proTipAction, { backgroundColor: Colors.primary.DEFAULT }]}
            >
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </TouchableOpacity>
          </LinearGradient>
        </AnimatedView>

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerLeft: { flex: 1 },
  greeting: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  userName: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, marginTop: 2 },
  notificationBtn: { width: 48, height: 48, borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationBadge: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.danger.DEFAULT, alignItems: 'center', justifyContent: 'center' },
  notificationCount: { fontSize: 10, color: Colors.white, fontFamily: FontFamily.bold },

  // Error
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  errorText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.medium },

  // Balance Card
  balanceCard: { padding: Spacing.lg, borderRadius: BorderRadius['2xl'], marginBottom: Spacing.lg },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  balanceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success.light },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  eyeButton: { padding: Spacing.xs },
  balanceValue: { color: Colors.white, fontSize: 42, fontFamily: FontFamily.bold, marginVertical: Spacing.sm, letterSpacing: -1 },
  balanceSubRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  balanceChange: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full },
  balanceChangeText: { color: Colors.success.light, fontSize: FontSize.xs, fontFamily: FontFamily.semiBold },
  balancePeriod: { color: 'rgba(255,255,255,0.6)', fontSize: FontSize.xs, fontFamily: FontFamily.regular },
  balanceActions: { flexDirection: 'row', gap: Spacing.sm },
  actionButton: { flex: 1 },

  // Quick Actions
  quickSection: { marginBottom: Spacing.lg },
  quickGrid: { flexDirection: 'row', gap: Spacing.sm },
  quickCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.xl, borderWidth: 1 },
  quickIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  quickLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, textAlign: 'center', lineHeight: 16 },

  // Stats
  statsSection: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, marginBottom: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { width: '48%' },
  skeletonRow: { flexDirection: 'row', gap: Spacing.sm },
  skeletonCard: { flex: 1 },

  // Activity
  activitySection: { marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  activityItem: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  skeletonList: { padding: Spacing.md },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: Spacing['2xl'], paddingHorizontal: Spacing.lg },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, marginBottom: Spacing.xs },
  emptySubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, textAlign: 'center', marginBottom: Spacing.lg },
  emptyButton: { minWidth: 160 },

  // Pro Tip
  proTipCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.xl, borderWidth: 1, gap: Spacing.md },
  proTipIcon: { width: 40, height: 40, borderRadius: BorderRadius.lg, backgroundColor: 'rgba(99, 102, 241, 0.15)', alignItems: 'center', justifyContent: 'center' },
  proTipContent: { flex: 1 },
  proTipLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, marginBottom: 2 },
  proTipText: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, lineHeight: 18 },
  proTipAction: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
