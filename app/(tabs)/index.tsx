/**
 * Dashboard Screen - Premium Enterprise Design
 * Modern home screen with animated components and premium styling
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector } from '@/store';
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice';
import { useDashboardStats, useRecentActivity, useRefreshDashboard } from '@/hooks/api/useDashboard';
import { useBalance } from '@/hooks/api/useWallet';
import { GlassCard, GradientButton, AnimatedView, SkeletonList } from '@/components/ui';
import {
  DashboardHeader,
  PortfolioCard,
  QuickActionsGrid,
  StatsOverview,
  PromoCard,
  DashboardActivityItem
} from '@/components/dashboard';

export default function DashboardScreen() {
  const { colors, isDark } = useTheme();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [refreshing, setRefreshing] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();
  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalance();
  const { refresh: refreshDashboard } = useRefreshDashboard();

  console.log('[Dashboard] Rendering, user:', user?.displayName, 'isAuthenticated:', isAuthenticated);

  const onRefresh = useCallback(async () => {
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

  const totalBalance = useMemo(() => {
    if (!balances?.USDT) return 0;
    return parseFloat(balances.USDT.toFixed(2));
  }, [balances]);

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
        <DashboardHeader
          userName={user?.displayName}
          photoURL={user?.photoURL}
          notificationCount={3}
        />

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

        {/* Premium Portfolio Card */}
        <PortfolioCard
          balance={totalBalance}
          balanceChange={2.4}
          isLoading={balancesLoading}
          hideBalance={hideBalance}
          onToggleVisibility={() => setHideBalance(!hideBalance)}
        />

        {/* Quick Actions Grid */}
        <QuickActionsGrid />

        {/* Stats Overview */}
        <StatsOverview stats={stats} isLoading={statsLoading} />

        {/* Recent Activity */}
        <AnimatedView animation="fadeSlideUp" staggerIndex={5}>
          <View style={styles.activitySection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/trades')}
                style={styles.seeAllBtn}
                accessibilityLabel="See all activity"
                accessibilityRole="button"
              >
                <Text style={[styles.seeAll, { color: Colors.primary.DEFAULT }]}>See All</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary.DEFAULT} />
              </TouchableOpacity>
            </View>
            <GlassCard variant="default" noPadding style={styles.activityCard}>
              {activitiesLoading ? (
                <SkeletonList count={3} style={styles.skeletonList} />
              ) : activities.length > 0 ? (
                activities.slice(0, 4).map((activity, i) => (
                  <AnimatedView key={activity.id} animation="slideLeft" staggerIndex={i} staggerDelay={80}>
                    <View style={[
                      styles.activityItem,
                      i < Math.min(activities.length, 4) - 1 && { borderBottomWidth: 1, borderColor: colors.border }
                    ]}>
                      <DashboardActivityItem activity={activity} />
                    </View>
                  </AnimatedView>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(0, 163, 246, 0.2)', 'rgba(139, 92, 246, 0.1)']
                      : ['rgba(0, 163, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']
                    }
                    style={styles.emptyIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="time-outline" size={36} color={Colors.primary.DEFAULT} />
                  </LinearGradient>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No Activity Yet</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    Your trading activity will appear here
                  </Text>
                  <GradientButton
                    title="Start Trading"
                    variant="primary"
                    size="sm"
                    onPress={() => router.push('/(tabs)/marketplace')}
                    style={styles.emptyButton}
                    glow={false}
                    leftIcon={<Ionicons name="rocket-outline" size={16} color={Colors.white} />}
                  />
                </View>
              )}
            </GlassCard>
          </View>
        </AnimatedView>

        {/* Promo Card */}
        <PromoCard />

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  // Error
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  errorText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.medium },

  // Activity
  activitySection: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, letterSpacing: -0.3 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  activityCard: { borderRadius: BorderRadius.xl, overflow: 'hidden' },
  activityItem: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  skeletonList: { padding: Spacing.md },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: Spacing['2xl'], paddingHorizontal: Spacing.lg },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, marginBottom: Spacing.xs },
  emptySubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, textAlign: 'center', marginBottom: Spacing.lg },
  emptyButton: { minWidth: 160 },
});
