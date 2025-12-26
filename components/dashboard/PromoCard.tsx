/**
 * PromoCard Component
 * Premium upgrade/promo card with dismiss functionality
 */

import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { AnimatedView } from '@/components/ui/animations';
import * as Haptics from 'expo-haptics';

interface PromoCardProps {
  title?: string;
  description?: string;
  badgeText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  route?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

export const PromoCard = memo(function PromoCard({
  title = 'Unlock Premium',
  description = 'Complete verification for higher limits & exclusive features',
  badgeText = 'PRO',
  icon = 'diamond',
  route = '/kyc',
  onDismiss,
  dismissible = true,
}: PromoCardProps) {
  const { colors, isDark } = useTheme();
  const [dismissed, setDismissed] = useState(false);

  console.log('[PromoCard] Rendering, dismissed:', dismissed);

  const handlePress = () => {
    console.log('[PromoCard] Card pressed, navigating to:', route);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as never);
  };

  const handleDismiss = () => {
    console.log('[PromoCard] Dismiss pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) {
    return null;
  }

  return (
    <AnimatedView animation="fadeSlideUp" staggerIndex={6}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        accessibilityLabel={`${title}. ${description}`}
        accessibilityHint="Double tap to learn more"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={isDark
            ? ['rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.15)']
            : ['rgba(99, 102, 241, 0.12)', 'rgba(139, 92, 246, 0.08)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.container,
            { borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)' }
          ]}
        >
          {/* Dismiss Button */}
          {dismissible && (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismiss}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Dismiss promotion"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          )}

          {/* Icon */}
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={icon} size={20} color={Colors.white} />
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              {badgeText && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeText}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          </View>

          {/* Arrow */}
          <View style={[
            styles.arrowContainer,
            { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.15)' }
          ]}>
            <Ionicons name="arrow-forward" size={16} color={Colors.accent.purple} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.md,
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  title: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
  },
  badge: {
    backgroundColor: Colors.accent.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PromoCard;
