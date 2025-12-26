/**
 * Deposit Screen - Receive crypto funds
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { GlassCard, GradientButton, CryptoIcon } from '@/components/ui';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';

type CryptoType = 'USDT' | 'BTC' | 'ETH' | 'SOL';

const CRYPTO_OPTIONS: { id: CryptoType; name: string; network: string }[] = [
  { id: 'USDT', name: 'Tether', network: 'TRC20' },
  { id: 'BTC', name: 'Bitcoin', network: 'Bitcoin' },
  { id: 'ETH', name: 'Ethereum', network: 'ERC20' },
  { id: 'SOL', name: 'Solana', network: 'Solana' },
];

// Mock wallet addresses - in production these come from the backend
const WALLET_ADDRESSES: Record<CryptoType, string> = {
  USDT: 'TRx7NwMgtqDjgGh8a1sWtK9VzA1FjXmkZP',
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  SOL: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
};

export default function DepositScreen() {
  const { colors, isDark, shadows } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('USDT');

  console.log('[DepositScreen] Rendering, selected:', selectedCrypto);

  const walletAddress = WALLET_ADDRESSES[selectedCrypto];
  const selectedOption = CRYPTO_OPTIONS.find(c => c.id === selectedCrypto);

  const handleCopyAddress = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(walletAddress);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch(addToast({ message: 'Address copied to clipboard', type: 'success' }));
      console.log('[DepositScreen] Address copied:', walletAddress);
    } catch (error) {
      console.error('[DepositScreen] Copy error:', error);
      dispatch(addToast({ message: 'Failed to copy address', type: 'error' }));
    }
  }, [walletAddress, dispatch]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `My ${selectedCrypto} deposit address: ${walletAddress}`,
        title: `${selectedCrypto} Deposit Address`,
      });
      console.log('[DepositScreen] Address shared');
    } catch (error) {
      console.error('[DepositScreen] Share error:', error);
    }
  }, [selectedCrypto, walletAddress]);

  const handleSelectCrypto = useCallback((crypto: CryptoType) => {
    Haptics.selectionAsync();
    setSelectedCrypto(crypto);
    console.log('[DepositScreen] Selected crypto:', crypto);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Deposit</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Crypto Selection */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Select Currency</Text>
        <View style={styles.cryptoOptions}>
          {CRYPTO_OPTIONS.map((crypto) => (
            <TouchableOpacity
              key={crypto.id}
              style={[
                styles.cryptoOption,
                {
                  backgroundColor: selectedCrypto === crypto.id
                    ? isDark ? 'rgba(0, 163, 246, 0.15)' : 'rgba(0, 163, 246, 0.1)'
                    : colors.card,
                  borderColor: selectedCrypto === crypto.id ? Colors.primary.DEFAULT : colors.border,
                },
                shadows.card,
              ]}
              onPress={() => handleSelectCrypto(crypto.id)}
              activeOpacity={0.7}
            >
              <CryptoIcon currency={crypto.id} size="lg" />
              <View style={styles.cryptoInfo}>
                <Text style={[styles.cryptoName, { color: colors.text }]}>{crypto.id}</Text>
                <Text style={[styles.cryptoNetwork, { color: colors.textSecondary }]}>{crypto.network}</Text>
              </View>
              {selectedCrypto === crypto.id && (
                <View style={[styles.checkBadge, { backgroundColor: Colors.primary.DEFAULT }]}>
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Deposit Address */}
        <GlassCard variant="default" style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Ionicons name="wallet-outline" size={20} color={Colors.primary.DEFAULT} />
            <Text style={[styles.addressLabel, { color: colors.text }]}>
              Your {selectedCrypto} Deposit Address
            </Text>
          </View>

          {/* QR Placeholder */}
          <View style={[styles.qrContainer, { backgroundColor: Colors.white }]}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code-outline" size={120} color={Colors.dark.text} />
            </View>
          </View>

          {/* Address */}
          <View style={[styles.addressBox, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}>
            <Text style={[styles.addressText, { color: colors.text }]} selectable numberOfLines={2}>
              {walletAddress}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <GradientButton
              title="Copy Address"
              variant="primary"
              size="md"
              onPress={handleCopyAddress}
              style={styles.actionBtn}
              leftIcon={<Ionicons name="copy-outline" size={18} color={Colors.white} />}
            />
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary, borderColor: colors.border }]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Important Notice */}
        <GlassCard variant="accent" style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <Ionicons name="warning-outline" size={20} color={Colors.warning.DEFAULT} />
            <Text style={[styles.noticeTitle, { color: Colors.warning.DEFAULT }]}>Important</Text>
          </View>
          <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
            • Only send {selectedCrypto} to this address{'\n'}
            • Network: {selectedOption?.network}{'\n'}
            • Sending other assets may result in permanent loss{'\n'}
            • Minimum deposit: 10 USDT
          </Text>
        </GlassCard>

        <View style={{ height: Spacing['2xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
  },
  placeholder: { width: 40 },
  scrollView: { flex: 1, paddingHorizontal: Spacing.md },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cryptoOptions: { gap: Spacing.sm, marginBottom: Spacing.lg },
  cryptoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    gap: Spacing.md,
  },
  cryptoInfo: { flex: 1 },
  cryptoName: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold },
  cryptoNetwork: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCard: { marginBottom: Spacing.md },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  addressLabel: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold },
  qrContainer: {
    alignSelf: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  qrPlaceholder: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  addressText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: { flex: 1 },
  shareBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  noticeCard: {},
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  noticeTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  noticeText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, lineHeight: 22 },
});
