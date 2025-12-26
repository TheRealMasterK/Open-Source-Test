/**
 * Wallet Screen
 * View balances and manage crypto assets
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
import { CRYPTOCURRENCIES, CryptoSymbol } from '@/config/crypto.config';

export default function WalletScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-slate-50';

  console.log('[Wallet] Rendering');

  const onRefresh = React.useCallback(async () => {
    console.log('[Wallet] Refreshing...');
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const CryptoCard = ({
    symbol,
    balance,
    usdValue,
  }: {
    symbol: CryptoSymbol;
    balance: number;
    usdValue: number;
  }) => {
    const crypto = CRYPTOCURRENCIES[symbol];

    return (
      <TouchableOpacity
        className={`${cardBg} mb-3 flex-row items-center rounded-xl p-4`}
        activeOpacity={0.7}>
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${crypto.color}20` }}>
          <Text style={{ color: crypto.color, fontWeight: 'bold', fontSize: 16 }}>
            {symbol.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className={`${textColor} text-lg font-semibold`}>{crypto.name}</Text>
          <Text className={`${textSecondary} text-sm`}>{symbol}</Text>
        </View>
        <View className="items-end">
          <Text className={`${textColor} font-semibold`}>
            {balance.toFixed(crypto.decimals > 4 ? 4 : crypto.decimals)}
          </Text>
          <Text className={`${textSecondary} text-sm`}>${usdValue.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Header */}
        <View className="py-4">
          <Text className={`${textColor} text-2xl font-bold`}>Wallet</Text>
        </View>

        {/* Total Balance Card */}
        <View className="mb-6 rounded-2xl p-5" style={{ backgroundColor: Colors.primary.DEFAULT }}>
          <Text className="mb-1 text-sm text-white/70">Total Balance</Text>
          <Text className="mb-4 text-4xl font-bold text-white">$0.00</Text>

          {/* Action Buttons */}
          <View className="flex-row">
            <TouchableOpacity className="mr-2 flex-1 flex-row items-center justify-center rounded-xl bg-white/20 py-3">
              <Ionicons name="arrow-down" size={20} color="white" />
              <Text className="ml-2 font-semibold text-white">Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity className="ml-2 flex-1 flex-row items-center justify-center rounded-xl bg-white/20 py-3">
              <Ionicons name="arrow-up" size={20} color="white" />
              <Text className="ml-2 font-semibold text-white">Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assets Section */}
        <Text className={`${textColor} mb-3 text-lg font-semibold`}>Your Assets</Text>

        <CryptoCard symbol="USDT" balance={0} usdValue={0} />
        <CryptoCard symbol="BTC" balance={0} usdValue={0} />
        <CryptoCard symbol="ETH" balance={0} usdValue={0} />

        {/* Transaction History */}
        <View className="mb-3 mt-6 flex-row items-center justify-between">
          <Text className={`${textColor} text-lg font-semibold`}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={{ color: Colors.primary.DEFAULT }}>See All</Text>
          </TouchableOpacity>
        </View>

        <View className={`${cardBg} mb-6 items-center rounded-xl p-6`}>
          <Ionicons
            name="receipt-outline"
            size={48}
            color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
          />
          <Text className={`${textSecondary} mt-2`}>No transactions yet</Text>
        </View>

        {/* Spacer for tab bar */}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
