/**
 * Transfer Screen - Transfer between wallets
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { GlassCard, GradientButton, CryptoIcon, Input } from '@/components/ui';
import { useBalance } from '@/hooks/api/useWallet';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';

type CryptoType = 'USDT' | 'BTC' | 'ETH' | 'SOL';
type WalletType = 'spot' | 'trading' | 'escrow';

const WALLETS: { id: WalletType; name: string; icon: string }[] = [
  { id: 'spot', name: 'Spot Wallet', icon: 'wallet-outline' },
  { id: 'trading', name: 'Trading Wallet', icon: 'trending-up-outline' },
  { id: 'escrow', name: 'Escrow Wallet', icon: 'shield-checkmark-outline' },
];

export default function TransferScreen() {
  const { colors, isDark, shadows } = useTheme();
  const dispatch = useAppDispatch();
  const { data: balances } = useBalance();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('USDT');
  const [fromWallet, setFromWallet] = useState<WalletType>('spot');
  const [toWallet, setToWallet] = useState<WalletType>('trading');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('[TransferScreen] Rendering:', { selectedCrypto, fromWallet, toWallet, amount });

  const availableBalance = balances?.[selectedCrypto] || 0;
  const amountNum = parseFloat(amount) || 0;
  const isValidAmount = amountNum > 0 && amountNum <= availableBalance;
  const canTransfer = fromWallet !== toWallet && isValidAmount;

  const handleSwapWallets = useCallback(() => {
    Haptics.selectionAsync();
    const temp = fromWallet;
    setFromWallet(toWallet);
    setToWallet(temp);
    console.log('[TransferScreen] Swapped wallets');
  }, [fromWallet, toWallet]);

  const handleMaxAmount = useCallback(() => {
    Haptics.selectionAsync();
    setAmount(availableBalance.toString());
  }, [availableBalance]);

  const handleTransfer = useCallback(async () => {
    if (!canTransfer) return;

    console.log('[TransferScreen] Initiating transfer:', { selectedCrypto, amount, fromWallet, toWallet });
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // TODO: Implement actual transfer API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      dispatch(addToast({ message: 'Transfer completed successfully', type: 'success' }));
      router.back();
    } catch (error) {
      console.error('[TransferScreen] Transfer error:', error);
      dispatch(addToast({ message: 'Transfer failed. Please try again.', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  }, [canTransfer, selectedCrypto, amount, fromWallet, toWallet, dispatch]);

  const renderWalletSelector = (
    label: string,
    selected: WalletType,
    onSelect: (wallet: WalletType) => void,
    disabled?: WalletType
  ) => (
    <View style={styles.walletSection}>
      <Text style={[styles.walletLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.walletOptions}>
        {WALLETS.filter(w => w.id !== disabled).map((wallet) => (
          <TouchableOpacity
            key={wallet.id}
            style={[
              styles.walletOption,
              {
                backgroundColor: selected === wallet.id
                  ? isDark ? 'rgba(0, 163, 246, 0.15)' : 'rgba(0, 163, 246, 0.1)'
                  : colors.card,
                borderColor: selected === wallet.id ? Colors.primary.DEFAULT : colors.border,
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(wallet.id);
            }}
          >
            <Ionicons
              name={wallet.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={selected === wallet.id ? Colors.primary.DEFAULT : colors.textSecondary}
            />
            <Text style={[
              styles.walletName,
              { color: selected === wallet.id ? Colors.primary.DEFAULT : colors.text }
            ]}>
              {wallet.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Transfer</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Crypto Selection */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Currency</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cryptoScroll}>
            {(['USDT', 'BTC', 'ETH', 'SOL'] as CryptoType[]).map((crypto) => (
              <TouchableOpacity
                key={crypto}
                style={[
                  styles.cryptoChip,
                  {
                    backgroundColor: selectedCrypto === crypto
                      ? Colors.primary.DEFAULT
                      : isDark ? colors.surface : colors.card,
                    borderColor: selectedCrypto === crypto ? Colors.primary.DEFAULT : colors.border,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCrypto(crypto);
                  setAmount('');
                }}
              >
                <CryptoIcon currency={crypto} size="sm" />
                <Text style={[
                  styles.cryptoChipText,
                  { color: selectedCrypto === crypto ? Colors.white : colors.text }
                ]}>
                  {crypto}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Transfer Direction */}
          <GlassCard variant="default" style={styles.transferCard}>
            {renderWalletSelector('From', fromWallet, setFromWallet, toWallet)}

            {/* Swap Button */}
            <View style={styles.swapContainer}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <TouchableOpacity
                style={[styles.swapBtn, { backgroundColor: Colors.primary.DEFAULT }]}
                onPress={handleSwapWallets}
              >
                <Ionicons name="swap-vertical" size={20} color={Colors.white} />
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

            {renderWalletSelector('To', toWallet, setToWallet, fromWallet)}
          </GlassCard>

          {/* Amount Input */}
          <GlassCard variant="default" style={styles.amountCard}>
            <View style={styles.amountHeader}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Amount</Text>
              <TouchableOpacity onPress={handleMaxAmount}>
                <Text style={[styles.maxBtn, { color: Colors.primary.DEFAULT }]}>MAX</Text>
              </TouchableOpacity>
            </View>
            <Input
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available:</Text>
              <Text style={[styles.balanceValue, { color: colors.text }]}>
                {availableBalance.toFixed(selectedCrypto === 'USDT' ? 2 : 6)} {selectedCrypto}
              </Text>
            </View>
            {amountNum > availableBalance && (
              <Text style={[styles.errorText, { color: Colors.danger.DEFAULT }]}>
                Insufficient balance
              </Text>
            )}
          </GlassCard>

          {/* Info Card */}
          <GlassCard variant="accent" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color={Colors.primary.DEFAULT} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Internal transfers are instant and free of charge.
              </Text>
            </View>
          </GlassCard>

          {/* Submit Button */}
          <GradientButton
            title={isSubmitting ? 'Transferring...' : 'Transfer'}
            variant="primary"
            size="lg"
            onPress={handleTransfer}
            disabled={!canTransfer || isSubmitting}
            loading={isSubmitting}
            style={styles.submitBtn}
          />

          <View style={{ height: Spacing['2xl'] }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  title: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold },
  placeholder: { width: 40 },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: Spacing.md },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cryptoScroll: { marginBottom: Spacing.md },
  cryptoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  cryptoChipText: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  transferCard: { marginBottom: Spacing.md },
  walletSection: { marginBottom: Spacing.sm },
  walletLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, marginBottom: Spacing.xs },
  walletOptions: { gap: Spacing.xs },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  walletName: { fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  divider: { flex: 1, height: 1 },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
  },
  amountCard: { marginBottom: Spacing.md },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  inputLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium },
  maxBtn: { fontSize: FontSize.sm, fontFamily: FontFamily.bold },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  balanceLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular },
  balanceValue: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold },
  errorText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, marginTop: Spacing.xs },
  infoCard: { marginBottom: Spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  infoText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  submitBtn: { marginBottom: Spacing.md },
});
