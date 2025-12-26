/**
 * CryptoFilterChip Component
 * Filter chip for selecting cryptocurrency type
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface CryptoFilterChipProps {
  symbol: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function CryptoFilterChip({
  symbol,
  color,
  isSelected,
  onPress,
}: CryptoFilterChipProps) {
  const { colors } = useTheme();

  console.log('[CryptoFilterChip] Rendering:', symbol, 'selected:', isSelected);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? color : colors.surfaceSecondary,
          borderColor: isSelected ? color : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.chipText,
          {
            color: isSelected ? Colors.white : colors.textSecondary,
          },
        ]}>
        {symbol}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
