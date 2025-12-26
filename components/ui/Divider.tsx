/**
 * Divider Component
 * Horizontal or vertical divider line
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface DividerProps {
  vertical?: boolean;
  spacing?: keyof typeof Spacing | number;
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

export function Divider({
  vertical = false,
  spacing = 'md',
  color,
  thickness = 1,
  style,
}: DividerProps) {
  const { colors } = useTheme();

  const getSpacing = (): number => {
    if (typeof spacing === 'number') return spacing;
    return Spacing[spacing];
  };

  const dividerColor = color || colors.border;
  const marginValue = getSpacing();

  if (vertical) {
    return (
      <View
        style={[
          styles.vertical,
          {
            backgroundColor: dividerColor,
            width: thickness,
            marginHorizontal: marginValue,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          backgroundColor: dividerColor,
          height: thickness,
          marginVertical: marginValue,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});

export default Divider;
