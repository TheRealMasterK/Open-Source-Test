/**
 * Marketplace Screen - Enterprise Grade
 * Premium P2P trading marketplace with crypto offers
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Gradients } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectActiveTab, setActiveTab } from '@/store/slices/offerSlice';
import { useBuyOffers, useSellOffers } from '@/hooks/api/useOffers';
import { Offer } from '@/types/offer.types';
import OfferCard from '@/components/marketplace/OfferCard';
import { GlassCard, GradientButton, Badge } from '@/components/ui';

export default function MarketplaceScreen() {
  const { colors, shadows, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  console.log('[Marketplace] Rendering, activeTab:', activeTab);

  // Only fetch data for the active tab to reduce API calls
  const { data: buyOffersData, isLoading: buyLoading, error: buyError, refetch: refetchBuy } = useBuyOffers(undefined, { enabled: activeTab === 'buy' });
  const { data: sellOffersData, isLoading: sellLoading, error: sellError, refetch: refetchSell } = useSellOffers(undefined, { enabled: activeTab === 'sell' });

  // Refetch data when tab changes to ensure fresh data
  useEffect(() => {
    console.log('[Marketplace] Tab changed to:', activeTab, '- triggering refetch');
    if (activeTab === 'buy') {
      refetchBuy();
    } else {
      refetchSell();
    }
  }, [activeTab, refetchBuy, refetchSell]);

  const { offers, isLoading, error } = useMemo(() => {
    console.log('[Marketplace] Processing offers:', {
      activeTab,
      buyOffersData: buyOffersData ? { hasData: !!buyOffersData.data, count: buyOffersData.data?.length } : null,
      sellOffersData: sellOffersData ? { hasData: !!sellOffersData.data, count: sellOffersData.data?.length } : null,
      buyLoading,
      sellLoading,
    });

    const rawOffers = activeTab === 'buy' ? buyOffersData?.data || [] : sellOffersData?.data || [];

    // Debug: Log offer types to verify filtering
    if (rawOffers.length > 0) {
      const offerTypes = rawOffers.map((o: Offer) => ({ id: o.id, type: o.offerType }));
      console.log('[Marketplace] Raw offers for', activeTab, 'tab:', offerTypes);
    }

    let filtered = rawOffers;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = rawOffers.filter((o: Offer) => o.creatorDisplayName?.toLowerCase().includes(query) || o.cryptocurrency.toLowerCase().includes(query) || o.paymentMethods.some((pm: string) => pm.toLowerCase().includes(query)));
    }

    console.log('[Marketplace] Final offers count:', filtered.length, 'for tab:', activeTab);
    return { offers: filtered, isLoading: activeTab === 'buy' ? buyLoading : sellLoading, error: activeTab === 'buy' ? buyError : sellError };
  }, [activeTab, buyOffersData, sellOffersData, searchQuery, buyLoading, sellLoading, buyError, sellError]);

  const onRefresh = useCallback(async () => {
    console.log('[Marketplace] Refreshing active tab:', activeTab);
    setRefreshing(true);
    try {
      // Only refresh the active tab to reduce API calls
      if (activeTab === 'buy') {
        await refetchBuy();
      } else {
        await refetchSell();
      }
    } catch (err) {
      console.error('[Marketplace] Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, refetchBuy, refetchSell]);

  const transformOfferToCardProps = (offer: Offer) => ({
    id: offer.id, traderName: offer.creatorDisplayName || 'Anonymous', traderInitials: (offer.creatorDisplayName || 'A').slice(0, 2).toUpperCase(), isVerified: offer.creatorVerified || false, rating: offer.creatorRating || 0, tradeCount: offer.creatorTotalTrades || 0, cryptoType: offer.cryptocurrency as 'BTC' | 'ETH' | 'USDT', price: offer.pricePerUnit.toLocaleString(), currency: offer.fiatCurrency, available: `${offer.amount} ${offer.cryptocurrency}`, minLimit: offer.minAmount.toLocaleString(), maxLimit: offer.maxAmount.toLocaleString(), paymentMethods: offer.paymentMethods, lastSeen: formatLastSeen(offer.updatedAt), offerType: offer.offerType,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.DEFAULT} />}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Marketplace</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Trade crypto securely with escrow protection</Text>
        </View>

        {/* Affiliate Banner */}
        <LinearGradient colors={Gradients.success as unknown as readonly [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.affiliateBanner, shadows.lg]}>
          <View style={styles.affiliateIcon}><Ionicons name="gift" size={24} color={Colors.white} /></View>
          <View style={styles.affiliateContent}><Text style={styles.affiliateTitle}>Boost Your Earning!</Text><Text style={styles.affiliateSubtitle}>Join our Affiliate Program and earn up to 10% commission</Text></View>
          <TouchableOpacity style={styles.affiliateBtn} onPress={() => router.push('/affiliate')}><Text style={styles.affiliateBtnText}>Join Now</Text></TouchableOpacity>
        </LinearGradient>

        {/* Tab Selector */}
        <View style={styles.tabSection}>
          <View style={[styles.tabContainer, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}>
            {(['buy', 'sell'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const gradient = tab === 'buy' ? Gradients.buy : Gradients.sell;
              return isActive ? (
                <LinearGradient key={tab} colors={gradient as unknown as readonly [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.activeTab}>
                  <TouchableOpacity onPress={() => dispatch(setActiveTab(tab))} style={styles.tabInner}>
                    <Text style={styles.activeTabText}>{tab === 'buy' ? 'Buy Offers' : 'Sell Offers'}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <TouchableOpacity key={tab} onPress={() => dispatch(setActiveTab(tab))} style={styles.inactiveTab}>
                  <Text style={[styles.inactiveTabText, { color: colors.textSecondary }]}>{tab === 'buy' ? 'Buy Offers' : 'Sell Offers'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Create Offer Button */}
          <TouchableOpacity
            style={[styles.createOfferBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/offers/create')}
            activeOpacity={0.8}
          >
            <View style={styles.createOfferIcon}>
              <Ionicons name="add-circle" size={20} color={Colors.primary.DEFAULT} />
            </View>
            <Text style={[styles.createOfferText, { color: colors.text }]}>Create Offer</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? colors.inputBg : colors.surfaceSecondary, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.textPlaceholder} />
          <TextInput style={[styles.searchInput, { color: colors.text }]} placeholder="Search offers..." placeholderTextColor={colors.textPlaceholder} value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={18} color={colors.textTertiary} /></TouchableOpacity>}
        </View>

        {/* Offers Header */}
        <View style={styles.offersHeader}>
          <View style={styles.offersCountRow}><Text style={[styles.offersLabel, { color: colors.textSecondary }]}>Offers</Text><Badge variant="info" size="sm">{offers.length}</Badge></View>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}><Ionicons name="filter" size={16} color={colors.textSecondary} /><Text style={[styles.filterText, { color: colors.textSecondary }]}>Filter</Text></TouchableOpacity>
        </View>

        {/* Error */}
        {error && <GlassCard variant="danger" style={styles.errorBanner}><Ionicons name="alert-circle" size={20} color={Colors.danger.DEFAULT} /><Text style={[styles.errorText, { color: Colors.danger.DEFAULT }]}>Failed to load offers</Text></GlassCard>}

        {/* Offers List */}
        {isLoading ? (
          <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary.DEFAULT} /></View>
        ) : offers.length > 0 ? (
          offers.map((o: Offer) => <OfferCard key={o.id} {...transformOfferToCardProps(o)} onPress={() => router.push(`/offers/${o.id}`)} onResell={o.offerType === 'sell' ? () => router.push(`/offers/resell/${o.id}`) : undefined} />)
        ) : (
          <GlassCard variant="default" style={styles.emptyCard}>
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconBg, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}><Ionicons name="storefront-outline" size={48} color={colors.textTertiary} /></View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Offers Found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>{searchQuery ? 'Try a different search' : 'Be the first to create an offer'}</Text>
              <GradientButton title="Create Offer" variant="primary" size="md" leftIcon={<Ionicons name="add" size={20} color={Colors.white} />} onPress={() => router.push('/offers/create')} style={styles.createBtn} />
            </View>
          </GlassCard>
        )}

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function formatLastSeen(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 5) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return 'Recently'; }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, marginTop: 4 },
  tabSection: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  tabContainer: { flexDirection: 'row', padding: 4, borderRadius: BorderRadius.xl },
  activeTab: { flex: 1, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  tabInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.sm, gap: Spacing.xs },
  activeTabText: { color: Colors.white, fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  inactiveTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.sm, gap: Spacing.xs },
  inactiveTabText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.xl, borderWidth: 1, height: 48, marginBottom: Spacing.md },
  searchInput: { flex: 1, marginLeft: Spacing.sm, fontFamily: FontFamily.regular, fontSize: FontSize.base },
  offersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  offersCountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  offersLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  filterBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, gap: Spacing.xs },
  filterText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginHorizontal: Spacing.md, marginBottom: Spacing.md },
  errorText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  loadingContainer: { padding: Spacing.xl, alignItems: 'center' },
  emptyCard: { marginHorizontal: Spacing.md, marginBottom: Spacing.lg },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyIconBg: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, marginBottom: Spacing.xs },
  emptySubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.lg },
  createBtn: { minWidth: 160 },
  affiliateBanner: { marginHorizontal: Spacing.md, marginTop: Spacing.md, marginBottom: Spacing.lg, padding: Spacing.md, borderRadius: BorderRadius.xl, flexDirection: 'row', alignItems: 'center' },
  affiliateIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  affiliateContent: { flex: 1 },
  affiliateTitle: { color: Colors.white, fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  affiliateSubtitle: { color: 'rgba(255,255,255,0.8)', fontFamily: FontFamily.regular, fontSize: FontSize.xs },
  affiliateBtn: { backgroundColor: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg },
  affiliateBtnText: { color: Colors.success.DEFAULT, fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  createOfferBtn: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.xl, borderWidth: 1 },
  createOfferIcon: { marginRight: Spacing.sm },
  createOfferText: { flex: 1, fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
});
