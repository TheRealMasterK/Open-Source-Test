/**
 * Create Offer Screen
 * Form to create new buy/sell offers
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useCreateOffer } from '@/hooks/api';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CryptoIcon } from '@/components/ui/CryptoIcon';
import { CryptoSymbol, FiatCurrency, CRYPTO_SYMBOLS, FIAT_SYMBOLS } from '@/config/crypto.config';
import { OfferType, RateType } from '@/types';

type Step = 'type' | 'crypto' | 'pricing' | 'payment' | 'review';

const PAYMENT_METHODS = [
  'Bank Transfer',
  'Mobile Money',
  'Cash Deposit',
  'PayPal',
  'Wise',
  'Venmo',
];

export default function CreateOfferScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const createOffer = useCreateOffer();

  // Form state
  const [step, setStep] = useState<Step>('type');
  const [offerType, setOfferType] = useState<OfferType | null>(null);
  const [currencyMode, setCurrencyMode] = useState<'crypto' | 'fiat'>('crypto'); // Choose between crypto or fiat
  const [cryptocurrency, setCryptocurrency] = useState<CryptoSymbol>('USDT');
  const [fiatCurrency, setFiatCurrency] = useState<FiatCurrency>('NGN');
  const [amount, setAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [rateType, setRateType] = useState<RateType>('fixed');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  console.log('[CreateOfferScreen] Current step:', step);

  const handleNext = () => {
    const steps: Step[] = ['type', 'crypto', 'pricing', 'payment', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['type', 'crypto', 'pricing', 'payment', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  const togglePaymentMethod = (method: string) => {
    if (selectedPaymentMethods.includes(method)) {
      setSelectedPaymentMethods(selectedPaymentMethods.filter((m) => m !== method));
    } else {
      setSelectedPaymentMethods([...selectedPaymentMethods, method]);
    }
  };

  const handleSubmit = async () => {
    if (!offerType) return;

    try {
      console.log('[CreateOfferScreen] Submitting offer...');
      await createOffer.mutateAsync({
        offerType,
        cryptocurrency,
        fiatCurrency,
        amount: parseFloat(amount),
        pricePerUnit: parseFloat(pricePerUnit),
        minAmount: parseFloat(minAmount),
        maxAmount: parseFloat(maxAmount),
        rateType,
        paymentMethods: selectedPaymentMethods,
        description,
      });

      Alert.alert('Success', 'Offer created successfully!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/marketplace') },
      ]);
    } catch (error) {
      console.error('[CreateOfferScreen] Error:', error);
      Alert.alert('Error', 'Failed to create offer. Please try again.');
    }
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 'type':
        return offerType !== null;
      case 'crypto':
        // Must have selected either crypto or fiat based on mode
        return currencyMode === 'crypto' ? !!cryptocurrency : !!fiatCurrency;
      case 'pricing':
        return !!amount && !!pricePerUnit && !!minAmount && !!maxAmount;
      case 'payment':
        return selectedPaymentMethods.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  // Get the selected currency label for display
  const getSelectedCurrency = () => {
    return currencyMode === 'crypto' ? cryptocurrency : fiatCurrency;
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 'type':
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              What type of offer do you want to create?
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Select whether you want to buy or sell cryptocurrency
            </Text>

            <View style={styles.typeOptions}>
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: offerType === 'buy' ? Colors.success.DEFAULT : colors.border,
                    borderWidth: offerType === 'buy' ? 2 : 1,
                  },
                ]}
                onPress={() => setOfferType('buy')}>
                <View
                  style={[
                    styles.typeIconContainer,
                    { backgroundColor: Colors.success.DEFAULT + '20' },
                  ]}>
                  <Ionicons name="arrow-down" size={32} color={Colors.success.DEFAULT} />
                </View>
                <Text style={[styles.typeName, { color: colors.text }]}>Buy Crypto</Text>
                <Text style={[styles.typeDescription, { color: colors.textSecondary }]}>
                  Create an offer to buy cryptocurrency from sellers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: offerType === 'sell' ? Colors.danger.DEFAULT : colors.border,
                    borderWidth: offerType === 'sell' ? 2 : 1,
                  },
                ]}
                onPress={() => setOfferType('sell')}>
                <View
                  style={[
                    styles.typeIconContainer,
                    { backgroundColor: Colors.danger.DEFAULT + '20' },
                  ]}>
                  <Ionicons name="arrow-up" size={32} color={Colors.danger.DEFAULT} />
                </View>
                <Text style={[styles.typeName, { color: colors.text }]}>Sell Crypto</Text>
                <Text style={[styles.typeDescription, { color: colors.textSecondary }]}>
                  Create an offer to sell your cryptocurrency to buyers
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'crypto':
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              {offerType === 'sell' ? 'What are you selling?' : 'What do you want to buy?'}
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Choose between cryptocurrency or fiat currency
            </Text>

            {/* Currency Mode Toggle */}
            <View style={[styles.modeToggle, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={[
                  styles.modeOption,
                  currencyMode === 'crypto' && { backgroundColor: Colors.primary.DEFAULT },
                ]}
                onPress={() => setCurrencyMode('crypto')}>
                <Ionicons
                  name="logo-bitcoin"
                  size={20}
                  color={currencyMode === 'crypto' ? Colors.white : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.modeText,
                    { color: currencyMode === 'crypto' ? Colors.white : colors.text },
                  ]}>
                  Cryptocurrency
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeOption,
                  currencyMode === 'fiat' && { backgroundColor: Colors.primary.DEFAULT },
                ]}
                onPress={() => setCurrencyMode('fiat')}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={currencyMode === 'fiat' ? Colors.white : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.modeText,
                    { color: currencyMode === 'fiat' ? Colors.white : colors.text },
                  ]}>
                  Fiat Currency
                </Text>
              </TouchableOpacity>
            </View>

            {/* Show crypto options if crypto mode selected */}
            {currencyMode === 'crypto' && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.text, marginTop: Spacing.lg }]}>
                  Select Cryptocurrency
                </Text>
                <View style={styles.cryptoOptions}>
                  {CRYPTO_SYMBOLS.map((crypto) => (
                    <TouchableOpacity
                      key={crypto}
                      style={[
                        styles.cryptoOption,
                        {
                          backgroundColor: colors.surface,
                          borderColor:
                            cryptocurrency === crypto ? Colors.primary.DEFAULT : colors.border,
                          borderWidth: cryptocurrency === crypto ? 2 : 1,
                        },
                      ]}
                      onPress={() => setCryptocurrency(crypto)}>
                      <CryptoIcon currency={crypto} size="lg" />
                      <Text style={[styles.cryptoName, { color: colors.text }]}>{crypto}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Show fiat options if fiat mode selected */}
            {currencyMode === 'fiat' && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.text, marginTop: Spacing.lg }]}>
                  Select Fiat Currency
                </Text>
                <View style={styles.fiatOptions}>
                  {FIAT_SYMBOLS.map((fiat) => (
                    <TouchableOpacity
                      key={fiat}
                      style={[
                        styles.fiatOption,
                        {
                          backgroundColor:
                            fiatCurrency === fiat ? Colors.primary.DEFAULT : colors.surface,
                          borderColor: fiatCurrency === fiat ? Colors.primary.DEFAULT : colors.border,
                        },
                      ]}
                      onPress={() => setFiatCurrency(fiat)}>
                      <Text
                        style={[
                          styles.fiatText,
                          { color: fiatCurrency === fiat ? Colors.white : colors.text },
                        ]}>
                        {fiat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        );

      case 'pricing':
        const currency = getSelectedCurrency();
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Set Your Pricing</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              {currencyMode === 'crypto'
                ? `Set the amount and price for your ${currency} offer`
                : `Set the amount and rate for your ${currency} offer`}
            </Text>

            <Input
              label={`Amount of ${currency}`}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <Input
              label={currencyMode === 'crypto'
                ? `Price per ${currency} (in fiat)`
                : `Exchange rate per unit`}
              placeholder="Enter price/rate"
              value={pricePerUnit}
              onChangeText={setPricePerUnit}
              keyboardType="numeric"
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="Min Amount"
                  placeholder="Min"
                  value={minAmount}
                  onChangeText={setMinAmount}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Max Amount"
                  placeholder="Max"
                  value={maxAmount}
                  onChangeText={setMaxAmount}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.text }]}>Rate Type</Text>
            <View style={styles.rateOptions}>
              <TouchableOpacity
                style={[
                  styles.rateOption,
                  {
                    backgroundColor: rateType === 'fixed' ? Colors.primary.DEFAULT : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setRateType('fixed')}>
                <Text
                  style={[
                    styles.rateText,
                    { color: rateType === 'fixed' ? Colors.white : colors.text },
                  ]}>
                  Fixed Price
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.rateOption,
                  {
                    backgroundColor:
                      rateType === 'floating' ? Colors.primary.DEFAULT : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setRateType('floating')}>
                <Text
                  style={[
                    styles.rateText,
                    { color: rateType === 'floating' ? Colors.white : colors.text },
                  ]}>
                  Floating (Market)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'payment':
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Payment Methods</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Select the payment methods you accept
            </Text>

            <View style={styles.paymentGrid}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: selectedPaymentMethods.includes(method)
                        ? Colors.primary.DEFAULT + '20'
                        : colors.surface,
                      borderColor: selectedPaymentMethods.includes(method)
                        ? Colors.primary.DEFAULT
                        : colors.border,
                    },
                  ]}
                  onPress={() => togglePaymentMethod(method)}>
                  <Ionicons
                    name={
                      selectedPaymentMethods.includes(method)
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={20}
                    color={
                      selectedPaymentMethods.includes(method)
                        ? Colors.primary.DEFAULT
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.paymentText,
                      {
                        color: selectedPaymentMethods.includes(method)
                          ? Colors.primary.DEFAULT
                          : colors.text,
                      },
                    ]}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Terms & Instructions (Optional)"
              placeholder="Add any terms or instructions for traders..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />
          </View>
        );

      case 'review':
        const reviewCurrency = getSelectedCurrency();
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Review Your Offer</Text>

            <Card variant="outlined" style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Type</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {offerType === 'buy' ? 'Buy' : 'Sell'}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Currency</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {reviewCurrency} ({currencyMode === 'crypto' ? 'Crypto' : 'Fiat'})
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Amount</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {amount} {reviewCurrency}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Price/Rate</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {pricePerUnit}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Limits</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {minAmount} - {maxAmount}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Payment</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {selectedPaymentMethods.join(', ')}
                </Text>
              </View>
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Create Offer" showBack onBack={handleBack} />

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
        {['type', 'crypto', 'pricing', 'payment', 'review'].map((s, index) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  ['type', 'crypto', 'pricing', 'payment', 'review'].indexOf(step) >= index
                    ? Colors.primary.DEFAULT
                    : colors.border,
              },
            ]}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: colors.border,
          },
        ]}>
        {step === 'review' ? (
          <Button
            title="Create Offer"
            onPress={handleSubmit}
            loading={createOffer.isPending}
            fullWidth
            size="lg"
          />
        ) : (
          <Button
            title="Continue"
            onPress={handleNext}
            disabled={!isStepValid()}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  stepContent: {},
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
  },
  typeOptions: {
    gap: Spacing.md,
  },
  typeCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  typeName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  typeDescription: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  cryptoOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cryptoOption: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  cryptoName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.md,
  },
  modeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  modeText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  fiatOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  fiatOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  fiatText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  rateOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rateOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  rateText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  paymentGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  paymentText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  reviewCard: {
    marginTop: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.borderLight,
  },
  reviewLabel: {
    fontSize: FontSize.sm,
  },
  reviewValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
});
