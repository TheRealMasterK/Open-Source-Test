/**
 * Offer Detail Screen
 * View offer details and initiate trades
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useOffer, useCreateTrade } from '@/hooks/api';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CryptoIcon } from '@/components/ui/CryptoIcon';
import { Divider } from '@/components/ui/Divider';
import { useAppSelector } from '@/store';

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const { data: offer, isLoading, error } = useOffer(id || '');
  const createTrade = useCreateTrade();

  console.log('[OfferDetailScreen] Rendering for offer:', id);

  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleStartTrade = async () => {
    if (!offer || !amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < offer.minAmount || amountNum > offer.maxAmount) {
      Alert.alert('Error', `Amount must be between ${offer.minAmount} and ${offer.maxAmount}`);
      return;
    }

    if (!paymentMethod && offer.paymentMethods.length > 0) {
      setPaymentMethod(offer.paymentMethods[0]);
    }

    try {
      console.log('[OfferDetailScreen] Creating trade...');
      await createTrade.mutateAsync({
        offerId: offer.id,
        amount: amountNum,
        paymentMethod: paymentMethod || offer.paymentMethods[0],
      });

      Alert.alert('Success', 'Trade created successfully!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/trades') },
      ]);
    } catch (err) {
      console.error('[OfferDetailScreen] Error creating trade:', err);
      Alert.alert('Error', 'Failed to create trade. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading offer..." />;
  }

  if (error || !offer) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Offer Details" showBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.danger.DEFAULT} />
          <Text style={[styles.errorText, { color: colors.text }]}>Failed to load offer</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="outline" />
        </View>
      </View>
    );
  }

  const isBuy = offer.offerType === 'buy';
  const isOwnOffer = user?.id === offer.userId;
  const cryptoAmount = amount ? parseFloat(amount) / offer.pricePerUnit : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Offer Details" showBack />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Offer Type Badge */}
        <View style={styles.typeBadgeContainer}>
          <Badge
            text={isBuy ? 'BUY OFFER' : 'SELL OFFER'}
            variant={isBuy ? 'success' : 'danger'}
            size="md"
          />
        </View>

        {/* Trader Info Card */}
        <Card variant="outlined" style={styles.traderCard}>
          <View style={styles.traderHeader}>
            <Avatar name={offer.creatorDisplayName || 'Trader'} size="lg" />
            <View style={styles.traderDetails}>
              <Text style={[styles.traderName, { color: colors.text }]}>
                {offer.creatorDisplayName || 'Anonymous'}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={Colors.warning.DEFAULT} />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {offer.creatorRating?.toFixed(1) || '0.0'}
                </Text>
                <Text style={[styles.tradesCount, { color: colors.textTertiary }]}>
                  ({offer.creatorTotalTrades || 0} trades)
                </Text>
              </View>
              {offer.creatorVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success.DEFAULT} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Price & Crypto Info */}
        <Card variant="outlined" style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <View style={styles.cryptoInfo}>
              <CryptoIcon currency={offer.cryptocurrency} size="lg" />
              <Text style={[styles.cryptoName, { color: colors.text }]}>
                {offer.cryptocurrency}
              </Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                Price per unit
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                {formatPrice(offer.pricePerUnit, offer.fiatCurrency)}
              </Text>
            </View>
          </View>

          <Divider spacing="md" />

          <View style={styles.limitsContainer}>
            <View style={styles.limitItem}>
              <Text style={[styles.limitLabel, { color: colors.textTertiary }]}>Min Amount</Text>
              <Text style={[styles.limitValue, { color: colors.text }]}>
                {formatPrice(offer.minAmount, offer.fiatCurrency)}
              </Text>
            </View>
            <View style={styles.limitItem}>
              <Text style={[styles.limitLabel, { color: colors.textTertiary }]}>Max Amount</Text>
              <Text style={[styles.limitValue, { color: colors.text }]}>
                {formatPrice(offer.maxAmount, offer.fiatCurrency)}
              </Text>
            </View>
            <View style={styles.limitItem}>
              <Text style={[styles.limitLabel, { color: colors.textTertiary }]}>Available</Text>
              <Text style={[styles.limitValue, { color: colors.text }]}>
                {offer.amount} {offer.cryptocurrency}
              </Text>
            </View>
          </View>
        </Card>

        {/* Payment Methods */}
        <Card variant="outlined" style={styles.paymentCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Methods</Text>
          <View style={styles.paymentMethods}>
            {offer.paymentMethods.map((method, index) => (
              <View
                key={index}
                style={[
                  styles.paymentBadge,
                  {
                    backgroundColor:
                      paymentMethod === method
                        ? Colors.primary.DEFAULT + '20'
                        : colors.surfaceSecondary,
                    borderColor: paymentMethod === method ? Colors.primary.DEFAULT : 'transparent',
                  },
                ]}
                onTouchEnd={() => setPaymentMethod(method)}>
                <Ionicons
                  name="card-outline"
                  size={16}
                  color={paymentMethod === method ? Colors.primary.DEFAULT : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.paymentText,
                    {
                      color:
                        paymentMethod === method ? Colors.primary.DEFAULT : colors.textSecondary,
                    },
                  ]}>
                  {method}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Description */}
        {offer.description && (
          <Card variant="outlined" style={styles.descriptionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Terms & Description</Text>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {offer.description}
            </Text>
          </Card>
        )}

        {/* Trade Input Section */}
        {!isOwnOffer && (
          <Card variant="elevated" style={styles.tradeCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Start a Trade</Text>

            <Input
              label={`Amount to ${isBuy ? 'sell' : 'buy'} (${offer.fiatCurrency})`}
              placeholder={`Enter amount (${offer.minAmount} - ${offer.maxAmount})`}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              leftIcon={
                <Text style={{ color: colors.textSecondary }}>
                  {offer.fiatCurrency === 'NGN' ? '₦' : '$'}
                </Text>
              }
            />

            {amount && !isNaN(parseFloat(amount)) && (
              <View style={[styles.calculationBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={[styles.calcLabel, { color: colors.textSecondary }]}>
                  You will {isBuy ? 'receive' : 'send'}:
                </Text>
                <Text style={[styles.calcValue, { color: colors.text }]}>
                  {cryptoAmount.toFixed(6)} {offer.cryptocurrency}
                </Text>
              </View>
            )}
          </Card>
        )}
      </ScrollView>

      {/* Action Button */}
      {!isOwnOffer && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + Spacing.md,
              borderTopColor: colors.border,
            },
          ]}>
          <Button
            title={isBuy ? 'Sell Now' : 'Buy Now'}
            onPress={handleStartTrade}
            loading={createTrade.isPending}
            disabled={!amount || isNaN(parseFloat(amount))}
            fullWidth
            size="lg"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  typeBadgeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  traderCard: {
    marginBottom: Spacing.md,
  },
  traderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  traderDetails: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  traderName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSize.sm,
    marginLeft: 4,
    fontWeight: '500',
  },
  tradesCount: {
    fontSize: FontSize.sm,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  verifiedText: {
    fontSize: FontSize.xs,
    color: Colors.success.DEFAULT,
    marginLeft: 4,
  },
  priceCard: {
    marginBottom: Spacing.md,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: FontSize.xs,
  },
  priceValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  limitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitItem: {
    alignItems: 'center',
  },
  limitLabel: {
    fontSize: FontSize.xs,
    marginBottom: 4,
  },
  limitValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  paymentCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  paymentText: {
    fontSize: FontSize.sm,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  descriptionCard: {
    marginBottom: Spacing.md,
  },
  descriptionText: {
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
  tradeCard: {
    marginBottom: Spacing.md,
  },
  calculationBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: FontSize.sm,
  },
  calcValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginTop: Spacing.xs,
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
