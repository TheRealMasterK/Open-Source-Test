/**
 * QuickActionsGrid Component
 * Premium quick actions with gradient backgrounds, haptics, and accessibility
 */

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { AnimatedView } from '@/components/ui/animations';
import * as Haptics from 'expo-haptics';

interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel: string;
  gradientColors: readonly [string, string, ...string[]];
  route: string;
}

// Defined outside component to prevent recreation
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'create',
    icon: 'add-circle',
    label: 'Create',
    sublabel: 'New Offer',
    gradientColors: ['#00A3F6', '#0284c7'],
    route: '/offers/create',
  },
  {
    id: 'marketplace',
    icon: 'storefront',
    label: 'Browse',
    sublabel: 'Marketplace',
    gradientColors: ['#10B981', '#059669'],
    route: '/(tabs)/marketplace',
  },
  {
    id: 'trades',
    icon: 'swap-horizontal',
    label: 'Active',
    sublabel: 'Trades',
    gradientColors: ['#F59E0B', '#D97706'],
    route: '/(tabs)/trades',
  },
  {
    id: 'wallet',
    icon: 'wallet',
    label: 'My',
    sublabel: 'Wallet',
    gradientColors: ['#8B5CF6', '#7C3AED'],
    route: '/(tabs)/wallet',
  },
];

export const QuickActionsGrid = memo(function QuickActionsGrid() {
  const { colors, isDark, shadows } = useTheme();

  console.log('[QuickActionsGrid] Rendering');

  const handleActionPress = useCallback((route: string, label: string) => {
    console.log('[QuickActionsGrid] Action pressed:', label, route);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as never);
  }, []);

  const handleCustomizePress = useCallback(() => {
    console.log('[QuickActionsGrid] Customize pressed');
    Haptics.selectionAsync();
    router.push('/settings' as never);
  }, []);

  return (
    <AnimatedView animation="fadeSlideUp" staggerIndex={2}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <TouchableOpacity
            onPress={handleCustomizePress}
            style={styles.customizeButton}
            accessibilityLabel="Customize quick actions"
            accessibilityRole="button"
          >
            <Text style={[styles.customizeText, { color: Colors.primary.DEFAULT }]}>
              Customize
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {QUICK_ACTIONS.map((action, index) => (
            <AnimatedView
              key={action.id}
              animation="scale"
              staggerIndex={index}
              staggerDelay={50}
              style={styles.gridItem}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleActionPress(action.route, action.label)}
                style={styles.actionTouchable}
                accessibilityLabel={`${action.label} ${action.sublabel}`}
                accessibilityHint={`Navigate to ${action.sublabel.toLowerCase()}`}
                accessibilityRole="button"
              >
                <View style={[
                  styles.actionCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  shadows.card
                ]}>
                  {/* Gradient Icon Container */}
                  <LinearGradient
                    colors={action.gradientColors}
                    style={styles.iconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name={action.icon} size={20} color={Colors.white} />
                  </LinearGradient>

                  {/* Label */}
                  <View style={styles.labelContainer}>
                    <Text style={[styles.actionLabel, { color: colors.text }]}>
                      {action.label}
                    </Text>
                    <Text style={[styles.actionSublabel, { color: colors.textSecondary }]}>
                      {action.sublabel}
                    </Text>
                  </View>

                  {/* Arrow indicator */}
                  <View style={[
                    styles.arrowContainer,
                    { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }
                  ]}>
                    <Ionicons name="chevron-forward" size={12} color={colors.textTertiary} />
                  </View>
                </View>
              </TouchableOpacity>
            </AnimatedView>
          ))}
        </View>
      </View>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    letterSpacing: -0.3,
  },
  customizeButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  customizeText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    width: '48.5%',
  },
  actionTouchable: {
    width: '100%',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  actionLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    marginBottom: 1,
  },
  actionSublabel: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.regular,
  },
  arrowContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuickActionsGrid;
