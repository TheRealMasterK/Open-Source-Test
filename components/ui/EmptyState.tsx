/**
 * EmptyState Component
 * Placeholder for empty lists/views
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon = 'document-outline',
  title,
  message,
  actionText,
  onAction,
  style,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        <Ionicons
          name={icon}
          size={48}
          color={colors.textTertiary}
        />
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>

      {message && (
        <Text
          style={[
            styles.message,
            { color: colors.textSecondary },
          ]}
        >
          {message}
        </Text>
      )}

      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          variant="primary"
          style={styles.actionButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionButton: {
    marginTop: Spacing.lg,
  },
});

export default EmptyState;
