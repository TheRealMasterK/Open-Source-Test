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
        className={`${cardBg} rounded-xl p-4 flex-row items-center mb-3`}
        activeOpacity={0.7}
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${crypto.color}20` }}
        >
          <Text style={{ color: crypto.color, fontWeight: 'bold', fontSize: 16 }}>
            {symbol.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className={`${textColor} font-semibold text-lg`}>
            {crypto.name}
          </Text>
          <Text className={`${textSecondary} text-sm`}>{symbol}</Text>
        </View>
        <View className="items-end">
          <Text className={`${textColor} font-semibold`}>
            {balance.toFixed(crypto.decimals > 4 ? 4 : crypto.decimals)}
          </Text>
          <Text className={`${textSecondary} text-sm`}>
            ${usdValue.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="py-4">
          <Text className={`${textColor} text-2xl font-bold`}>Wallet</Text>
        </View>

        {/* Total Balance Card */}
        <View
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: Colors.primary.DEFAULT }}
        >
          <Text className="text-white/70 text-sm mb-1">Total Balance</Text>
          <Text className="text-white text-4xl font-bold mb-4">$0.00</Text>

          {/* Action Buttons */}
          <View className="flex-row">
            <TouchableOpacity className="flex-1 bg-white/20 rounded-xl py-3 mr-2 items-center flex-row justify-center">
              <Ionicons name="arrow-down" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white/20 rounded-xl py-3 ml-2 items-center flex-row justify-center">
              <Ionicons name="arrow-up" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assets Section */}
        <Text className={`${textColor} text-lg font-semibold mb-3`}>
          Your Assets
        </Text>

        <CryptoCard symbol="USDT" balance={0} usdValue={0} />
        <CryptoCard symbol="BTC" balance={0} usdValue={0} />
        <CryptoCard symbol="ETH" balance={0} usdValue={0} />

        {/* Transaction History */}
        <View className="flex-row justify-between items-center mt-6 mb-3">
          <Text className={`${textColor} text-lg font-semibold`}>
            Recent Transactions
          </Text>
          <TouchableOpacity>
            <Text style={{ color: Colors.primary.DEFAULT }}>See All</Text>
          </TouchableOpacity>
        </View>

        <View className={`${cardBg} rounded-xl p-6 items-center mb-6`}>
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
