/**
 * OfferCard Component
 * Display offer summary in list views
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { CryptoIcon } from '@/components/ui/CryptoIcon';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
  onPress?: () => void;
}

export function OfferCard({ offer, onPress }: OfferCardProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const isBuy = offer.offerType === 'buy';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      console.log('[OfferCard] Navigating to offer:', offer.id);
      router.push(`/offers/${offer.id}`);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: offer.fiatCurrency,
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatLimits = (): string => {
    const min = formatPrice(offer.minAmount);
    const max = formatPrice(offer.maxAmount);
    return `${min} - ${max}`;
  };

  return (
    <Card variant="outlined" onPress={handlePress} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            name={offer.creatorDisplayName || 'User'}
            size="sm"
          />
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: colors.text }]}>
              {offer.creatorDisplayName || 'Anonymous'}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons
                name="star"
                size={12}
                color={Colors.warning.DEFAULT}
              />
              <Text style={[styles.rating, { color: colors.textSecondary }]}>
                {offer.creatorRating?.toFixed(1) || '0.0'} ({offer.creatorTotalTrades || 0})
              </Text>
            </View>
          </View>
        </View>

        <Badge
          text={isBuy ? 'BUY' : 'SELL'}
          variant={isBuy ? 'success' : 'danger'}
          size="sm"
        />
      </View>

      {/* Price Section */}
      <View style={[styles.priceSection, { borderColor: colors.border }]}>
        <View style={styles.cryptoInfo}>
          <CryptoIcon currency={offer.cryptocurrency} size="sm" />
          <Text style={[styles.cryptoText, { color: colors.text }]}>
            {offer.cryptocurrency}
          </Text>
        </View>

        <View style={styles.priceInfo}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatPrice(offer.pricePerUnit)}
          </Text>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
            per {offer.cryptocurrency}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.limitInfo}>
          <Text style={[styles.limitLabel, { color: colors.textTertiary }]}>
            Limits
          </Text>
          <Text style={[styles.limitValue, { color: colors.textSecondary }]}>
            {formatLimits()}
          </Text>
        </View>

        <View style={styles.paymentMethods}>
          {offer.paymentMethods?.slice(0, 2).map((method, index) => (
            <View
              key={index}
              style={[styles.paymentBadge, { backgroundColor: colors.surfaceSecondary }]}
            >
              <Text style={[styles.paymentText, { color: colors.textSecondary }]}>
                {method}
              </Text>
            </View>
          ))}
          {offer.paymentMethods && offer.paymentMethods.length > 2 && (
            <Text style={[styles.morePayments, { color: colors.textTertiary }]}>
              +{offer.paymentMethods.length - 2}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: Spacing.sm,
  },
  username: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: Spacing.sm,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: FontSize.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limitInfo: {},
  limitLabel: {
    fontSize: FontSize.xs,
    marginBottom: 2,
  },
  limitValue: {
    fontSize: FontSize.sm,
  },
  paymentMethods: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
  },
  paymentText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  morePayments: {
    fontSize: FontSize.xs,
    marginLeft: Spacing.xs,
  },
});

export default OfferCard;
