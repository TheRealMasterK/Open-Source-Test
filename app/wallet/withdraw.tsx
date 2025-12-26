/**
 * Withdraw Screen - Send crypto funds
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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

const CRYPTO_OPTIONS: { id: CryptoType; name: string; network: string; fee: string; minAmount: number }[] = [
  { id: 'USDT', name: 'Tether', network: 'TRC20', fee: '1 USDT', minAmount: 10 },
  { id: 'BTC', name: 'Bitcoin', network: 'Bitcoin', fee: '0.0001 BTC', minAmount: 0.0001 },
  { id: 'ETH', name: 'Ethereum', network: 'ERC20', fee: '0.001 ETH', minAmount: 0.01 },
  { id: 'SOL', name: 'Solana', network: 'Solana', fee: '0.00001 SOL', minAmount: 0.01 },
];

export default function WithdrawScreen() {
  const { colors, isDark, shadows } = useTheme();
  const dispatch = useAppDispatch();
  const { data: balances } = useBalance();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('USDT');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('[WithdrawScreen] Rendering, selected:', selectedCrypto, 'amount:', amount);

  const selectedOption = CRYPTO_OPTIONS.find(c => c.id === selectedCrypto);
  const availableBalance = balances?.[selectedCrypto] || 0;
  const amountNum = parseFloat(amount) || 0;
  const isValidAmount = amountNum >= (selectedOption?.minAmount || 0) && amountNum <= availableBalance;
  const isValidAddress = address.length > 20;

  const handleSelectCrypto = useCallback((crypto: CryptoType) => {
    Haptics.selectionAsync();
    setSelectedCrypto(crypto);
    setAmount('');
    console.log('[WithdrawScreen] Selected crypto:', crypto);
  }, []);

  const handleMaxAmount = useCallback(() => {
    Haptics.selectionAsync();
    setAmount(availableBalance.toString());
    console.log('[WithdrawScreen] Max amount set:', availableBalance);
  }, [availableBalance]);

  const handleWithdraw = useCallback(async () => {
    if (!isValidAmount || !isValidAddress) {
      dispatch(addToast({ message: 'Please check your inputs', type: 'error' }));
      return;
    }

    console.log('[WithdrawScreen] Initiating withdrawal:', { selectedCrypto, amount, address });
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Show confirmation
    Alert.alert(
      'Confirm Withdrawal',
      `You are about to withdraw ${amount} ${selectedCrypto} to:\n\n${address}\n\nNetwork Fee: ${selectedOption?.fee}`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setIsSubmitting(false) },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement actual withdrawal API call
              await new Promise(resolve => setTimeout(resolve, 2000));
              dispatch(addToast({ message: 'Withdrawal submitted successfully', type: 'success' }));
              router.back();
            } catch (error) {
              console.error('[WithdrawScreen] Withdrawal error:', error);
              dispatch(addToast({ message: 'Withdrawal failed. Please try again.', type: 'error' }));
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  }, [isValidAmount, isValidAddress, selectedCrypto, amount, address, selectedOption, dispatch]);

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
        <Text style={[styles.title, { color: colors.text }]}>Withdraw</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Crypto Selection */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Select Currency</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cryptoScroll}>
            {CRYPTO_OPTIONS.map((crypto) => (
              <TouchableOpacity
                key={crypto.id}
                style={[
                  styles.cryptoChip,
                  {
                    backgroundColor: selectedCrypto === crypto.id
                      ? Colors.primary.DEFAULT
                      : isDark ? colors.surface : colors.card,
                    borderColor: selectedCrypto === crypto.id ? Colors.primary.DEFAULT : colors.border,
                  },
                ]}
                onPress={() => handleSelectCrypto(crypto.id)}
              >
                <CryptoIcon currency={crypto.id} size="sm" />
                <Text style={[
                  styles.cryptoChipText,
                  { color: selectedCrypto === crypto.id ? Colors.white : colors.text }
                ]}>
                  {crypto.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Balance Display */}
          <GlassCard variant="default" style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available Balance</Text>
              <View style={styles.balanceValue}>
                <Text style={[styles.balanceAmount, { color: colors.text }]}>
                  {availableBalance.toFixed(selectedCrypto === 'USDT' ? 2 : 6)}
                </Text>
                <Text style={[styles.balanceCrypto, { color: Colors.primary.DEFAULT }]}>{selectedCrypto}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Withdrawal Form */}
          <GlassCard variant="default" style={styles.formCard}>
            {/* Address Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Recipient Address</Text>
              <Input
                placeholder={`Enter ${selectedCrypto} address`}
                value={address}
                onChangeText={setAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={[styles.inputHint, { color: colors.textTertiary }]}>
                Network: {selectedOption?.network}
              </Text>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
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
              {amountNum > 0 && amountNum < (selectedOption?.minAmount || 0) && (
                <Text style={[styles.errorText, { color: Colors.danger.DEFAULT }]}>
                  Minimum: {selectedOption?.minAmount} {selectedCrypto}
                </Text>
              )}
              {amountNum > availableBalance && (
                <Text style={[styles.errorText, { color: Colors.danger.DEFAULT }]}>
                  Insufficient balance
                </Text>
              )}
            </View>

            {/* Fee Info */}
            <View style={[styles.feeRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.feeLabel, { color: colors.textSecondary }]}>Network Fee</Text>
              <Text style={[styles.feeValue, { color: colors.text }]}>{selectedOption?.fee}</Text>
            </View>
          </GlassCard>

          {/* Warning */}
          <GlassCard variant="danger" style={styles.warningCard}>
            <View style={styles.warningRow}>
              <Ionicons name="alert-circle" size={20} color={Colors.danger.DEFAULT} />
              <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                Double-check the address. Transactions cannot be reversed.
              </Text>
            </View>
          </GlassCard>

          {/* Submit Button */}
          <GradientButton
            title={isSubmitting ? 'Processing...' : 'Withdraw'}
            variant="sell"
            size="lg"
            onPress={handleWithdraw}
            disabled={!isValidAmount || !isValidAddress || isSubmitting}
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
  balanceCard: { marginBottom: Spacing.md },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  balanceValue: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs },
  balanceAmount: { fontSize: FontSize.xl, fontFamily: FontFamily.bold },
  balanceCrypto: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  formCard: { marginBottom: Spacing.md },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, marginBottom: Spacing.xs },
  inputHint: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, marginTop: Spacing.xs },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  maxBtn: { fontSize: FontSize.sm, fontFamily: FontFamily.bold },
  errorText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, marginTop: Spacing.xs },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  feeLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  feeValue: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold },
  warningCard: { marginBottom: Spacing.lg },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  warningText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular },
  submitBtn: { marginBottom: Spacing.md },
});
