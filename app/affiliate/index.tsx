/**
 * Affiliate Dashboard Screen
 * View affiliate stats, referrals, and earnings
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAffiliateStats, useReferrals, useEarnings } from '@/hooks/api';
import { useCopyToClipboard } from '@/hooks/common';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Section } from '@/components/layout/Section';

export default function AffiliateScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { copy, copied } = useCopyToClipboard();

  const { data: stats, isLoading: loadingStats } = useAffiliateStats();
  const { data: referrals, isLoading: loadingReferrals } = useReferrals();
  const { data: earnings, isLoading: loadingEarnings } = useEarnings();

  console.log('[AffiliateScreen] Rendering');

  const handleShare = async () => {
    if (!stats?.referralLink) return;

    try {
      await Share.share({
        message: `Join QIC Trader using my referral link and get started trading crypto! ${stats.referralLink}`,
        url: stats.referralLink,
      });
      console.log('[AffiliateScreen] Shared referral link');
    } catch (error) {
      console.error('[AffiliateScreen] Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    if (stats?.referralLink) {
      copy(stats.referralLink);
    }
  };

  if (loadingStats) {
    return <LoadingSpinner fullScreen text="Loading affiliate data..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Affiliate Program" showBack />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <Card variant="elevated" style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.primary.DEFAULT }]}>
                {stats?.totalReferrals || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Referrals
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.success.DEFAULT }]}>
                ${stats?.totalEarnings?.toFixed(2) || '0.00'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Earnings
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                ${stats?.pendingEarnings?.toFixed(2) || '0.00'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
          </View>

          {/* Current Tier */}
          <View style={[styles.tierBox, { backgroundColor: colors.surfaceSecondary }]}>
            <View style={styles.tierInfo}>
              <Badge text={stats?.currentTier?.name || 'Bronze'} variant="primary" />
              <Text style={[styles.tierRate, { color: colors.text }]}>
                {stats?.currentTier?.commissionRate || 5}% Commission
              </Text>
            </View>
            <Text style={[styles.tierProgress, { color: colors.textSecondary }]}>
              {100 - (stats?.nextTierProgress || 0)}% to next tier
            </Text>
          </View>
        </Card>

        {/* Referral Link */}
        <Section title="Your Referral Link">
          <Card variant="outlined">
            <View style={styles.linkContainer}>
              <Text style={[styles.linkText, { color: colors.textSecondary }]} numberOfLines={1}>
                {stats?.referralLink || 'https://qictrader.com/ref/...'}
              </Text>
            </View>
            <View style={styles.linkActions}>
              <Button
                title={copied ? 'Copied!' : 'Copy'}
                onPress={handleCopyLink}
                variant="outline"
                size="sm"
                leftIcon={<Ionicons name="copy-outline" size={16} color={Colors.primary.DEFAULT} />}
                style={{ flex: 1 }}
              />
              <Button
                title="Share"
                onPress={handleShare}
                size="sm"
                leftIcon={<Ionicons name="share-outline" size={16} color={Colors.white} />}
                style={{ flex: 1, marginLeft: Spacing.sm }}
              />
            </View>
          </Card>
        </Section>

        {/* Recent Referrals */}
        <Section title="Recent Referrals" actionText="View All">
          {loadingReferrals ? (
            <LoadingSpinner />
          ) : referrals?.data && referrals.data.length > 0 ? (
            referrals.data.slice(0, 5).map((referral, index) => (
              <Card key={index} variant="outlined" style={styles.referralItem}>
                <View style={styles.referralInfo}>
                  <View
                    style={[
                      styles.referralAvatar,
                      { backgroundColor: Colors.primary.DEFAULT + '20' },
                    ]}>
                    <Text style={[styles.referralInitial, { color: Colors.primary.DEFAULT }]}>
                      {referral.referredUserName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.referralName, { color: colors.text }]}>
                      {referral.referredUserName || 'Anonymous'}
                    </Text>
                    <Text style={[styles.referralDate, { color: colors.textTertiary }]}>
                      Joined {new Date(referral.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Badge
                  text={referral.status === 'active' ? 'Active' : 'Pending'}
                  variant={referral.status === 'active' ? 'success' : 'warning'}
                  size="sm"
                />
              </Card>
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons name="people-outline" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No referrals yet. Share your link to get started!
              </Text>
            </Card>
          )}
        </Section>

        {/* Recent Earnings */}
        <Section title="Recent Earnings">
          {loadingEarnings ? (
            <LoadingSpinner />
          ) : earnings?.data && earnings.data.length > 0 ? (
            earnings.data.slice(0, 5).map((earning, index) => (
              <Card key={index} variant="outlined" style={styles.earningItem}>
                <View>
                  <Text style={[styles.earningType, { color: colors.text }]}>
                    {earning.description || 'Referral Commission'}
                  </Text>
                  <Text style={[styles.earningDate, { color: colors.textTertiary }]}>
                    {new Date(earning.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.earningAmount, { color: Colors.success.DEFAULT }]}>
                  +${earning.amount.toFixed(2)}
                </Text>
              </Card>
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons name="wallet-outline" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No earnings yet. Refer friends to start earning!
              </Text>
            </Card>
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  statsCard: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  tierBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  tierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  tierRate: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  tierProgress: {
    fontSize: FontSize.xs,
  },
  linkContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  linkText: {
    fontSize: FontSize.sm,
    fontFamily: 'monospace',
  },
  linkActions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  referralInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  referralInitial: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  referralName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  referralDate: {
    fontSize: FontSize.xs,
  },
  earningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  earningType: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  earningDate: {
    fontSize: FontSize.xs,
  },
  earningAmount: {
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
