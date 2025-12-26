/**
 * Profile Screen
 * User profile and settings
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/config/theme';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectUser, logout } from '@/store/slices/authSlice';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-slate-50';

  console.log('[Profile] Rendering, user:', user?.displayName);

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
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    color?: string;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`${cardBg} mb-2 flex-row items-center rounded-xl p-4`}
      activeOpacity={0.7}>
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: `${color || Colors.primary.DEFAULT}20`,
        }}>
        <Ionicons name={icon} size={20} color={color || Colors.primary.DEFAULT} />
      </View>
      <Text className={`${textColor} flex-1 font-medium`}>{label}</Text>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-4">
          <Text className={`${textColor} text-2xl font-bold`}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View className={`${cardBg} mb-6 rounded-2xl p-5`}>
          <View className="flex-row items-center">
            <View
              className="mr-4 h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: Colors.primary.DEFAULT }}>
              <Text className="text-2xl font-bold text-white">
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className={`${textColor} text-xl font-bold`}>
                {user?.displayName || 'User'}
              </Text>
              <Text className={`${textSecondary} text-sm`}>{user?.email || 'No email'}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={24} color={Colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="mt-4 flex-row border-t border-slate-700/30 pt-4">
            <View className="flex-1 items-center">
              <Text className={`${textColor} text-xl font-bold`}>0</Text>
              <Text className={`${textSecondary} text-xs`}>Trades</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className={`${textColor} text-xl font-bold`}>0%</Text>
              <Text className={`${textSecondary} text-xs`}>Success</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className={`${textColor} text-xl font-bold`}>0.0</Text>
              <Text className={`${textSecondary} text-xs`}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <Text className={`${textSecondary} mb-2 ml-1 text-sm`}>ACCOUNT</Text>
        <MenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => console.log('Edit Profile')}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          label="KYC Verification"
          onPress={() => console.log('KYC')}
          color={Colors.success.DEFAULT}
        />
        <MenuItem
          icon="card-outline"
          label="Payment Methods"
          onPress={() => console.log('Payment Methods')}
        />

        <Text className={`${textSecondary} mb-2 ml-1 mt-4 text-sm`}>EARNINGS</Text>
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

        <Text className={`${textSecondary} mb-2 ml-1 mt-4 text-sm`}>SETTINGS</Text>
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => console.log('Settings')}
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
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
