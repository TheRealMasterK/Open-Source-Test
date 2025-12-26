/**
 * Container Component
 * Main content wrapper with safe area support
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface ContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  padding?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function Container({
  children,
  scrollable = false,
  safeArea = true,
  padding = true,
  style,
  contentStyle,
  refreshing = false,
  onRefresh,
}: ContainerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    ...(safeArea && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
  };

  const innerStyle: ViewStyle = {
    flex: 1,
    ...(padding && {
      paddingHorizontal: Spacing.md,
    }),
  };

  if (scrollable) {
    return (
      <View style={[containerStyle, style]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[innerStyle, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary.DEFAULT}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <View style={[innerStyle, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
});

export default Container;
