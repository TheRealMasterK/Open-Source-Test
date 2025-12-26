/**
 * Marketplace Screen
 * Browse and search crypto offers
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/config/theme';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectActiveTab, setActiveTab } from '@/store/slices/offerSlice';

export default function MarketplaceScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const [refreshing, setRefreshing] = useState(false);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-slate-50';

  console.log('[Marketplace] Rendering, activeTab:', activeTab);

  const onRefresh = React.useCallback(async () => {
    console.log('[Marketplace] Refreshing...');
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const TabButton = ({
    label,
    isActive,
    onPress,
  }: {
    label: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-3 items-center rounded-lg ${
        isActive ? 'bg-primary' : ''
      }`}
      style={isActive ? { backgroundColor: Colors.primary.DEFAULT } : {}}
    >
      <Text
        className={`font-semibold ${isActive ? 'text-white' : textSecondary}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const CryptoFilter = ({
    symbol,
    color,
    isSelected,
  }: {
    symbol: string;
    color: string;
    isSelected: boolean;
  }) => (
    <TouchableOpacity
      className={`px-4 py-2 rounded-full mr-2 ${
        isSelected ? '' : cardBg
      }`}
      style={isSelected ? { backgroundColor: color } : {}}
    >
      <Text className={isSelected ? 'text-white font-medium' : textSecondary}>
        {symbol}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className={`${textColor} text-2xl font-bold`}>Marketplace</Text>
        <Text className={`${textSecondary} text-sm`}>
          Find the best crypto deals
        </Text>
      </View>

      {/* Tab Selector */}
      <View className={`mx-4 p-1 rounded-xl mb-4 ${cardBg}`}>
        <View className="flex-row">
          <TabButton
            label="Buy Crypto"
            isActive={activeTab === 'buy'}
            onPress={() => dispatch(setActiveTab('buy'))}
          />
          <TabButton
            label="Sell Crypto"
            isActive={activeTab === 'sell'}
            onPress={() => dispatch(setActiveTab('sell'))}
          />
        </View>
      </View>

      {/* Crypto Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-4"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <CryptoFilter symbol="All" color={Colors.primary.DEFAULT} isSelected />
        <CryptoFilter symbol="USDT" color={Colors.crypto.USDT} isSelected={false} />
        <CryptoFilter symbol="BTC" color={Colors.crypto.BTC} isSelected={false} />
        <CryptoFilter symbol="ETH" color={Colors.crypto.ETH} isSelected={false} />
      </ScrollView>

      {/* Filter Bar */}
      <View className="flex-row px-4 mb-4 justify-between">
        <TouchableOpacity
          className={`flex-row items-center px-4 py-2 rounded-lg ${cardBg}`}
        >
          <Ionicons
            name="funnel-outline"
            size={16}
            color={isDark ? Colors.dark.textSecondary : Colors.light.textSecondary}
          />
          <Text className={`${textSecondary} ml-2`}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-row items-center px-4 py-2 rounded-lg ${cardBg}`}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={16}
            color={isDark ? Colors.dark.textSecondary : Colors.light.textSecondary}
          />
          <Text className={`${textSecondary} ml-2`}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Offers List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Empty State */}
        <View className={`${cardBg} rounded-xl p-8 items-center`}>
          <Ionicons
            name="storefront-outline"
            size={64}
            color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
          />
          <Text className={`${textColor} text-lg font-semibold mt-4`}>
            No offers found
          </Text>
          <Text className={`${textSecondary} text-center mt-2`}>
            Be the first to create an offer!
          </Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: Colors.primary.DEFAULT }}
          >
            <Text className="text-white font-semibold">Create Offer</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
