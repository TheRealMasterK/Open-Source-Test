/**
 * Dashboard Screen
 * Main home screen for authenticated users
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/config/theme';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useAppSelector(selectUser);
  const [refreshing, setRefreshing] = React.useState(false);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-slate-50';

  console.log('[Dashboard] Rendering, user:', user?.displayName);

  const onRefresh = React.useCallback(async () => {
    console.log('[Dashboard] Refreshing...');
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const QuickAction = ({
    icon,
    label,
    onPress,
    color = Colors.primary.DEFAULT,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`${cardBg} mx-1 flex-1 items-center rounded-xl p-4`}
      activeOpacity={0.7}>
      <View
        className="mb-2 h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20` }}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className={`${textColor} text-sm font-medium`}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Header */}
        <View className="py-4">
          <Text className={`${textSecondary} text-sm`}>Welcome back,</Text>
          <Text className={`${textColor} text-2xl font-bold`}>{user?.displayName || 'Trader'}</Text>
        </View>

        {/* Balance Card */}
        <View className="mb-6 rounded-2xl p-5" style={{ backgroundColor: Colors.primary.DEFAULT }}>
          <Text className="mb-1 text-sm text-white/70">Total Balance</Text>
          <Text className="mb-4 text-3xl font-bold text-white">$0.00</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-xs text-white/70">USDT</Text>
              <Text className="font-semibold text-white">0.00</Text>
            </View>
            <View>
              <Text className="text-xs text-white/70">BTC</Text>
              <Text className="font-semibold text-white">0.00</Text>
            </View>
            <View>
              <Text className="text-xs text-white/70">ETH</Text>
              <Text className="font-semibold text-white">0.00</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text className={`${textColor} mb-3 text-lg font-semibold`}>Quick Actions</Text>
        <View className="mb-6 flex-row">
          <QuickAction
            icon="arrow-down"
            label="Deposit"
            onPress={() => console.log('Deposit')}
            color={Colors.success.DEFAULT}
          />
          <QuickAction
            icon="arrow-up"
            label="Withdraw"
            onPress={() => console.log('Withdraw')}
            color={Colors.danger.DEFAULT}
          />
          <QuickAction icon="add" label="Create" onPress={() => console.log('Create Offer')} />
        </View>

        {/* Active Trades */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className={`${textColor} text-lg font-semibold`}>Active Trades</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/trades')}>
            <Text style={{ color: Colors.primary.DEFAULT }}>See All</Text>
          </TouchableOpacity>
        </View>
        <View className={`${cardBg} mb-6 items-center rounded-xl p-6`}>
          <Ionicons
            name="swap-horizontal-outline"
            size={48}
            color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
          />
          <Text className={`${textSecondary} mt-2`}>No active trades</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/marketplace')} className="mt-3">
            <Text style={{ color: Colors.primary.DEFAULT }} className="font-medium">
              Browse Marketplace
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text className={`${textColor} mb-3 text-lg font-semibold`}>Recent Activity</Text>
        <View className={`${cardBg} mb-6 items-center rounded-xl p-6`}>
          <Ionicons
            name="time-outline"
            size={48}
            color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
          />
          <Text className={`${textSecondary} mt-2`}>No recent activity</Text>
        </View>

        {/* Spacer for tab bar */}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
