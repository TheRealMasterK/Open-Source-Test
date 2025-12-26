/**
 * Header Component
 * Screen header with back button and actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  leftComponent,
  rightComponent,
  transparent = false,
  style,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.sm,
          backgroundColor: transparent ? 'transparent' : colors.background,
          borderBottomColor: transparent ? 'transparent' : colors.border,
        },
        style,
      ]}
    >
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
        {leftComponent}
      </View>

      <View style={styles.centerSection}>
        {title && (
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 60,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});

export default Header;
