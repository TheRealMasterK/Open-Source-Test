/**
 * Avatar Component
 * User avatar with fallback initials
 */

import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const fontSizeMap = {
  xs: FontSize.xs - 2,
  sm: FontSize.xs,
  md: FontSize.sm,
  lg: FontSize.xl,
  xl: FontSize['2xl'],
};

export function Avatar({
  source,
  name = '',
  size = 'md',
  style,
  showOnlineStatus = false,
  isOnline = false,
}: AvatarProps) {
  const { isDark } = useTheme();

  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || '?';
  };

  const getBackgroundColor = (): string => {
    // Generate a consistent color based on name
    if (!name) {
      return isDark ? Colors.dark.surfaceSecondary : Colors.light.surfaceSecondary;
    }

    const colors = [
      Colors.primary.DEFAULT,
      Colors.success.DEFAULT,
      Colors.warning.DEFAULT,
      Colors.info.DEFAULT,
      Colors.chart.light[4], // purple
      Colors.chart.light[5], // pink
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    backgroundColor: getBackgroundColor(),
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            { width: dimension, height: dimension, borderRadius: dimension / 2 },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
      )}

      {showOnlineStatus && (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isOnline
                ? Colors.success.DEFAULT
                : isDark
                  ? Colors.dark.textTertiary
                  : Colors.light.textTertiary,
              width: dimension * 0.3,
              height: dimension * 0.3,
              borderRadius: dimension * 0.15,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  initials: {
    color: Colors.white,
    fontWeight: '600',
  },
  statusDot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

export default Avatar;
