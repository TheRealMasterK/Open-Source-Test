/**
 * PaymentMethodBadge Component
 * Displays a payment method as a small badge/pill
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, BorderRadius, Spacing } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface PaymentMethodBadgeProps {
  method: string;
  isSelected?: boolean;
}

const PAYMENT_METHOD_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Bank Transfer': 'business-outline',
  PayPal: 'logo-paypal',
  Capitec: 'card-outline',
  Nedbank: 'card-outline',
  FNB: 'card-outline',
  Skrill: 'wallet-outline',
  Easypaisa: 'phone-portrait-outline',
  Cash: 'cash-outline',
};

export default function PaymentMethodBadge({ method, isSelected = false }: PaymentMethodBadgeProps) {
  const { colors } = useTheme();
  const icon = PAYMENT_METHOD_ICONS[method] || 'card-outline';

  console.log('[PaymentMethodBadge] Rendering:', method);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isSelected ? Colors.primary.DEFAULT : colors.surfaceSecondary,
          borderColor: isSelected ? Colors.primary.DEFAULT : colors.border,
        },
      ]}>
      <Ionicons name={icon} size={12} color={isSelected ? Colors.white : colors.textSecondary} />
      <Text
        style={[
          styles.badgeText,
          { color: isSelected ? Colors.white : colors.textSecondary },
        ]}>
        {method}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSize.xxs,
    marginLeft: 4,
    fontWeight: '500',
  },
});
