/**
 * CryptoIcon Component
 * Display cryptocurrency icons
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/config/theme';
import { CryptoSymbol } from '@/config/crypto.config';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CryptoIconProps {
  currency: CryptoSymbol;
  size?: IconSize;
  style?: ViewStyle;
  showBackground?: boolean;
}

const sizeMap = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
};

const fontSizeMap = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 18,
};

const getCryptoColor = (currency: CryptoSymbol): string => {
  switch (currency) {
    case 'USDT':
      return Colors.crypto.USDT;
    case 'BTC':
      return Colors.crypto.BTC;
    case 'ETH':
      return Colors.crypto.ETH;
  }
};

const getCryptoSymbol = (currency: CryptoSymbol): string => {
  switch (currency) {
    case 'USDT':
      return '₮';
    case 'BTC':
      return '₿';
    case 'ETH':
      return 'Ξ';
  }
};

export function CryptoIcon({
  currency,
  size = 'md',
  style,
  showBackground = true,
}: CryptoIconProps) {
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const color = getCryptoColor(currency);

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: showBackground ? color + '20' : 'transparent',
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.symbol,
          {
            fontSize,
            color,
          },
        ]}
      >
        {getCryptoSymbol(currency)}
      </Text>
    </View>
  );
}

/**
 * CryptoAmount Component
 * Display cryptocurrency amount with icon
 */
interface CryptoAmountProps {
  amount: number | string;
  currency: CryptoSymbol;
  size?: IconSize;
  showIcon?: boolean;
  style?: ViewStyle;
}

export function CryptoAmount({
  amount,
  currency,
  size = 'sm',
  showIcon = true,
  style,
}: CryptoAmountProps) {
  const formatAmount = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';

    // Format based on currency
    if (currency === 'USDT') {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  };

  return (
    <View style={[styles.amountContainer, style]}>
      {showIcon && (
        <CryptoIcon currency={currency} size={size} style={styles.amountIcon} />
      )}
      <Text style={styles.amountText}>
        {formatAmount(amount)} {currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontWeight: '700',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountIcon: {
    marginRight: 6,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CryptoIcon;
