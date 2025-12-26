/**
 * Trades Screen
 * View and manage trades
 */

import React, { useState } from 'react';
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
import { Colors } from '@/config/theme';

type TradeTab = 'active' | 'completed' | 'disputed';

export default function TradesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<TradeTab>('active');
  const [refreshing, setRefreshing] = useState(false);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-slate-50';

  console.log('[Trades] Rendering, activeTab:', activeTab);

  const onRefresh = React.useCallback(async () => {
    console.log('[Trades] Refreshing...');
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const TabButton = ({
    label,
    tab,
    count = 0,
  }: {
    label: string;
    tab: TradeTab;
    count?: number;
  }) => {
    const isActive = activeTab === tab;

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tab)}
        className={`flex-1 items-center rounded-lg py-3 ${isActive ? '' : ''}`}
        style={isActive ? { backgroundColor: Colors.primary.DEFAULT } : {}}>
        <View className="flex-row items-center">
          <Text className={`font-semibold ${isActive ? 'text-white' : textSecondary}`}>
            {label}
          </Text>
          {count > 0 && (
            <View
              className="ml-2 rounded-full px-2 py-0.5"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : Colors.primary.DEFAULT,
              }}>
              <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-white'}`}>
                {count}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'active':
        return {
          icon: 'swap-horizontal-outline' as const,
          title: 'No active trades',
          subtitle: 'Start a trade from the marketplace',
        };
      case 'completed':
        return {
          icon: 'checkmark-circle-outline' as const,
          title: 'No completed trades',
          subtitle: 'Completed trades will appear here',
        };
      case 'disputed':
        return {
          icon: 'alert-circle-outline' as const,
          title: 'No disputes',
          subtitle: 'Great! You have no disputes',
        };
    }
  };

  const emptyState = getEmptyMessage();

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className={`${textColor} text-2xl font-bold`}>Trades</Text>
      </View>

      {/* Tab Selector */}
      <View className={`mx-4 mb-4 rounded-xl p-1 ${cardBg}`}>
        <View className="flex-row">
          <TabButton label="Active" tab="active" count={0} />
          <TabButton label="Completed" tab="completed" />
          <TabButton label="Disputed" tab="disputed" />
        </View>
      </View>

      {/* Trades List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Empty State */}
        <View className={`${cardBg} items-center rounded-xl p-8`}>
          <Ionicons
            name={emptyState.icon}
            size={64}
            color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
          />
          <Text className={`${textColor} mt-4 text-lg font-semibold`}>{emptyState.title}</Text>
          <Text className={`${textSecondary} mt-2 text-center`}>{emptyState.subtitle}</Text>
        </View>

        {/* Spacer */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
