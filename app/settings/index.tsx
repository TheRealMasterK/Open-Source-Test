/**
 * Settings Screen
 * App settings and preferences
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAuth } from '@/hooks/auth';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Section } from '@/components/layout/Section';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  danger?: boolean;
}

function SettingItem({ icon, title, subtitle, onPress, rightComponent, danger }: SettingItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: danger ? Colors.danger.DEFAULT + '20' : Colors.primary.DEFAULT + '20',
          },
        ]}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? Colors.danger.DEFAULT : Colors.primary.DEFAULT}
        />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[styles.settingTitle, { color: danger ? Colors.danger.DEFAULT : colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {rightComponent ||
        (onPress && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const user = useAppSelector(selectUser);

  console.log('[SettingsScreen] Rendering');

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          console.log('[SettingsScreen] Logging out...');
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Contact Support',
              'Please contact support@qictrader.com to delete your account.'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" showBack />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Card variant="outlined" style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Avatar name={user?.displayName || user?.email || 'User'} size="lg" />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.surfaceSecondary }]}
            onPress={() => console.log('Edit profile')}>
            <Ionicons name="pencil" size={16} color={Colors.primary.DEFAULT} />
            <Text style={[styles.editText, { color: Colors.primary.DEFAULT }]}>Edit</Text>
          </TouchableOpacity>
        </Card>

        {/* Account Settings */}
        <Section title="Account">
          <Card variant="outlined" noPadding>
            <SettingItem
              icon="person-outline"
              title="Profile"
              subtitle="Edit your profile information"
              onPress={() => console.log('Profile')}
            />
            <SettingItem
              icon="shield-checkmark-outline"
              title="KYC Verification"
              subtitle="Verify your identity"
              onPress={() => router.push('/kyc')}
            />
            <SettingItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => console.log('Payment methods')}
            />
            <SettingItem
              icon="lock-closed-outline"
              title="Security"
              subtitle="Password, 2FA, and more"
              onPress={() => console.log('Security')}
            />
          </Card>
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <Card variant="outlined" noPadding>
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle={isDark ? 'On' : 'Off'}
              rightComponent={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: Colors.primary.DEFAULT }}
                  thumbColor={Colors.white}
                />
              }
            />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Push and email notifications"
              onPress={() => console.log('Notifications')}
            />
            <SettingItem
              icon="language-outline"
              title="Language"
              subtitle="English"
              onPress={() => console.log('Language')}
            />
            <SettingItem
              icon="cash-outline"
              title="Default Currency"
              subtitle="NGN - Nigerian Naira"
              onPress={() => console.log('Currency')}
            />
          </Card>
        </Section>

        {/* Support */}
        <Section title="Support">
          <Card variant="outlined" noPadding>
            <SettingItem
              icon="help-circle-outline"
              title="Help Center"
              subtitle="FAQs and guides"
              onPress={() => console.log('Help')}
            />
            <SettingItem
              icon="chatbubble-outline"
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={() => console.log('Support')}
            />
            <SettingItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => console.log('Terms')}
            />
            <SettingItem
              icon="shield-outline"
              title="Privacy Policy"
              onPress={() => console.log('Privacy')}
            />
          </Card>
        </Section>

        {/* Danger Zone */}
        <Section title="Account Actions">
          <Card variant="outlined" noPadding>
            <SettingItem icon="log-out-outline" title="Sign Out" onPress={handleLogout} danger />
            <SettingItem
              icon="trash-outline"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
              danger
            />
          </Card>
        </Section>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>QIC Trader v1.0.0</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: Spacing.md,
  },
  profileName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: FontSize.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  editText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.borderLight,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSize.base,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  versionText: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    marginTop: Spacing.lg,
  },
});
