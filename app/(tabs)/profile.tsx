/**
 * Profile Screen - Enterprise Grade
 * User profile focused on trading stats, performance, and activity
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Gradients } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';
import { useUserPerformance, useDashboard } from '@/hooks/api/useDashboard';
import { GlassCard, Badge } from '@/components/ui';

export default function ProfileScreen() {
  const { colors, isDark, shadows } = useTheme();
  const user = useAppSelector(selectUser);
  const { data: dashboard, isLoading: statsLoading } = useDashboard();
  const { rating, successRate, verified, kycLevel } = useUserPerformance();

  console.log('[Profile] Rendering, user:', user?.displayName);

  const MenuItem = ({ icon, label, onPress, color, rightElement, danger }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void; color?: string; rightElement?: React.ReactNode; danger?: boolean }) => (
    <TouchableOpacity onPress={onPress} style={[styles.menuItem, { backgroundColor: colors.card }]} activeOpacity={0.7}>
      <View style={[styles.menuIconBg, { backgroundColor: `${color || Colors.primary.DEFAULT}15` }]}><Ionicons name={icon} size={20} color={color || Colors.primary.DEFAULT} /></View>
      <Text style={[styles.menuLabel, { color: danger ? Colors.danger.DEFAULT : colors.text }]}>{label}</Text>
      {rightElement || <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <LinearGradient colors={Gradients.primary as unknown as readonly [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.profileCard, shadows.xl]}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}</Text></View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
                {verified && <Ionicons name="checkmark-circle" size={18} color={Colors.success.light} style={{ marginLeft: 6 }} />}
              </View>
              <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/settings')}><Ionicons name="create-outline" size={20} color={Colors.white} /></TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            {statsLoading ? <ActivityIndicator color={Colors.white} /> : (<>
              <View style={styles.statItem}><Text style={styles.statValue}>{dashboard?.totalTrades || 0}</Text><Text style={styles.statLabel}>Trades</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statValue}>{successRate || 0}%</Text><Text style={styles.statLabel}>Success</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><View style={styles.ratingRow}><Text style={styles.statValue}>{rating?.toFixed(1) || '0.0'}</Text><Ionicons name="star" size={14} color="#FBBF24" /></View><Text style={styles.statLabel}>Rating</Text></View>
            </>)}
          </View>
        </LinearGradient>

        {/* KYC Banner */}
        {!verified && (
          <GlassCard variant="accent" style={styles.kycBanner} onPress={() => router.push('/kyc')}>
            <View style={styles.kycContent}>
              <View style={[styles.kycIcon, { backgroundColor: `${Colors.warning.DEFAULT}20` }]}><Ionicons name="shield-checkmark" size={24} color={Colors.warning.DEFAULT} /></View>
              <View style={{ flex: 1 }}><Text style={[styles.kycTitle, { color: colors.text }]}>Complete Verification</Text><Text style={[styles.kycSubtitle, { color: colors.textSecondary }]}>Unlock all trading features</Text></View>
              <Ionicons name="chevron-forward" size={20} color={Colors.primary.DEFAULT} />
            </View>
          </GlassCard>
        )}

        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACTIVITY</Text>
        <MenuItem icon="shield-checkmark-outline" label="KYC Verification" onPress={() => router.push('/kyc')} color={verified ? Colors.success.DEFAULT : Colors.warning.DEFAULT} rightElement={<Badge variant={verified ? 'success' : 'warning'} size="sm">{kycLevel === 'none' ? 'Required' : kycLevel === 'basic' ? 'Basic' : 'Verified'}</Badge>} />
        <MenuItem icon="time-outline" label="Trade History" onPress={() => router.push('/(tabs)/trades')} />
        <MenuItem icon="wallet-outline" label="Wallet" onPress={() => router.push('/(tabs)/wallet')} />

        <Text style={[styles.sectionTitle, styles.sectionSpaced, { color: colors.textSecondary }]}>EARNINGS</Text>
        <MenuItem icon="people-outline" label="Affiliate Program" onPress={() => router.push('/affiliate')} color={Colors.warning.DEFAULT} />
        <MenuItem icon="storefront-outline" label="My Offers" onPress={() => router.push('/offers/create')} />
        <MenuItem icon="analytics-outline" label="Performance Stats" onPress={() => router.push('/(tabs)')} color={Colors.accent.purple} />

        <Text style={[styles.sectionTitle, styles.sectionSpaced, { color: colors.textSecondary }]}>SETTINGS</Text>
        <MenuItem icon="settings-outline" label="Account Settings" onPress={() => router.push('/settings')} />
        
        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold },
  settingsBtn: { width: 44, height: 44, borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center' },
  profileCard: { borderRadius: BorderRadius['2xl'], padding: Spacing.lg, marginBottom: Spacing.lg },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  avatarText: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.white },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  profileName: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.white },
  profileEmail: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', marginTop: Spacing.lg, paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.white },
  statLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  kycBanner: { marginBottom: Spacing.lg },
  kycContent: { flexDirection: 'row', alignItems: 'center' },
  kycIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  kycTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold },
  kycSubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, marginBottom: Spacing.sm, marginLeft: 4, letterSpacing: 0.5 },
  sectionSpaced: { marginTop: Spacing.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.xl, marginBottom: Spacing.sm },
  menuIconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.medium },
});
