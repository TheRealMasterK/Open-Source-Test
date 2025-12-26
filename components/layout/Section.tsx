/**
 * Section Component
 * Grouped content section with optional title
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function Section({
  children,
  title,
  subtitle,
  actionText,
  onAction,
  style,
  contentStyle,
}: SectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {(title || actionText) && (
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {title && (
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>

          {actionText && onAction && (
            <TouchableOpacity
              onPress={onAction}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.actionText, { color: Colors.primary.DEFAULT }]}>
                {actionText}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={Colors.primary.DEFAULT}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={contentStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});

export default Section;
