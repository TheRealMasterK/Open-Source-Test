/**
 * Profile Screen
 * User profile and settings with theme switcher - Connected to backend
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectUser, logout } from '@/store/slices/authSlice';
import { ThemeMode } from '@/store/slices/uiSlice';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useUserPerformance, useDashboard } from '@/hooks/api/useDashboard';

export default function ProfileScreen() {
  const { colors, isDark, themeMode, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // API Hook - Real stats from backend
  const { dashboard, isLoading: statsLoading } = useDashboard();
  const { rating, successRate, totalRatings, verified, kycLevel } = useUserPerformance();

  console.log('[Profile] Rendering, user:', user?.displayName, 'theme:', themeMode, 'stats:', { rating, successRate });

  const handleThemeChange = (mode: ThemeMode) => {
    console.log('[Profile] Changing theme to:', mode);
    setTheme(mode);
  };

  const handleLogout = async () => {
    console.log('[Profile] handleLogout: Starting logout');

    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            dispatch(logout());
            console.log('[Profile] handleLogout: Success');
            router.replace('/(auth)/login');
          } catch (error) {
            console.error('[Profile] handleLogout: Error', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    color,
    showChevron = true,
    rightElement,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    color?: string;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuItem, { backgroundColor: colors.card }]}
      activeOpacity={0.7}>
      <View
        style={[styles.menuIconContainer, { backgroundColor: `${color || Colors.primary.DEFAULT}20` }]}>
        <Ionicons name={icon} size={20} color={color || Colors.primary.DEFAULT} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      {rightElement}
      {showChevron && !rightElement && (
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      )}
    </TouchableOpacity>
  );

  const ThemeOption = ({
    mode,
    icon,
    label,
  }: {
    mode: ThemeMode;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }) => {
    const isSelected = themeMode === mode;
    return (
      <TouchableOpacity
        onPress={() => handleThemeChange(mode)}
        style={[
          styles.themeOption,
          {
            backgroundColor: isSelected ? Colors.primary.DEFAULT : colors.surfaceSecondary,
            borderColor: isSelected ? Colors.primary.DEFAULT : colors.border,
          },
        ]}
        activeOpacity={0.7}>
        <Ionicons
          name={icon}
          size={18}
          color={isSelected ? Colors.white : colors.textSecondary}
        />
        <Text
          style={[
            styles.themeOptionText,
            { color: isSelected ? Colors.white : colors.textSecondary },
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: Colors.primary.DEFAULT }]}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.email || 'No email'}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={24} color={Colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            {statsLoading ? (
              <View style={styles.statsLoading}>
                <ActivityIndicator size="small" color={colors.textSecondary} />
              </View>
            ) : (
              <>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {dashboard?.totalTrades || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trades</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {successRate || 0}%
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Success</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.ratingContainer}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {rating?.toFixed(1) || '0.0'}
                    </Text>
                    {totalRatings > 0 && (
                      <Ionicons name="star" size={14} color="#F59E0B" style={styles.starIcon} />
                    )}
                  </View>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>
        <MenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => console.log('Edit Profile')}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          label="KYC Verification"
          onPress={() => router.push('/kyc')}
          color={verified ? Colors.success.DEFAULT : Colors.warning.DEFAULT}
          rightElement={
            <View style={[styles.kycBadge, { backgroundColor: verified ? `${Colors.success.DEFAULT}20` : `${Colors.warning.DEFAULT}20` }]}>
              <Text style={[styles.kycBadgeText, { color: verified ? Colors.success.DEFAULT : Colors.warning.DEFAULT }]}>
                {kycLevel === 'none' ? 'Not Verified' : kycLevel === 'basic' ? 'Basic' : 'Verified'}
              </Text>
            </View>
          }
        />
        <MenuItem
          icon="card-outline"
          label="Payment Methods"
          onPress={() => console.log('Payment Methods')}
        />

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced, { color: colors.textSecondary }]}>
          EARNINGS
        </Text>
        <MenuItem
          icon="people-outline"
          label="Affiliate Program"
          onPress={() => console.log('Affiliate')}
          color={Colors.warning.DEFAULT}
        />
        <MenuItem
          icon="storefront-outline"
          label="My Offers"
          onPress={() => console.log('My Offers')}
        />

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced, { color: colors.textSecondary }]}>
          APPEARANCE
        </Text>
        {/* Theme Switcher */}
        <View style={[styles.themeCard, { backgroundColor: colors.card }]}>
          <View style={styles.themeHeader}>
            <View
              style={[styles.menuIconContainer, { backgroundColor: `${Colors.info.DEFAULT}20` }]}>
              <Ionicons name="color-palette-outline" size={20} color={Colors.info.DEFAULT} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>Theme</Text>
          </View>
          <View style={styles.themeOptions}>
            <ThemeOption mode="light" icon="sunny-outline" label="Light" />
            <ThemeOption mode="dark" icon="moon-outline" label="Dark" />
            <ThemeOption mode="system" icon="phone-portrait-outline" label="System" />
          </View>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced, { color: colors.textSecondary }]}>
          SETTINGS
        </Text>
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => console.log('Notifications')}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Security"
          onPress={() => console.log('Security')}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => console.log('Help')}
        />
        <MenuItem
          icon="log-out-outline"
          label="Logout"
          onPress={handleLogout}
          color={Colors.danger.DEFAULT}
          showChevron={false}
        />

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  statsLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginLeft: 4,
  },
  kycBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  kycBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  sectionTitleSpaced: {
    marginTop: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '500',
  },
  themeCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  themeOptionText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  spacer: {
    height: Spacing.xl,
  },
});
