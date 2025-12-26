/**
 * DashboardHeader Component
 * Premium header with avatar, greeting, and notifications
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Gradients } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { Avatar } from '@/components/ui';
import { AnimatedView } from '@/components/ui/animations';

interface DashboardHeaderProps {
  userName?: string | null;
  photoURL?: string | null;
  notificationCount?: number;
}

export function DashboardHeader({
  userName,
  photoURL,
  notificationCount = 0
}: DashboardHeaderProps) {
  const { colors, isDark } = useTheme();

  console.log('[DashboardHeader] Rendering, userName:', userName);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const displayName = userName || 'Trader';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AnimatedView animation="fadeSlideUp" staggerIndex={0}>
      <View style={styles.container}>
        {/* Left: Avatar + Greeting */}
        <TouchableOpacity
          style={styles.userSection}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.7}
        >
          {/* Premium Avatar with Gradient Ring */}
          <View style={styles.avatarWrapper}>
            <LinearGradient
              colors={Gradients.primary as unknown as readonly [string, string, ...string[]]}
              style={styles.avatarRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.avatarInner, { backgroundColor: colors.background }]}>
                {photoURL ? (
                  <Avatar
                    source={photoURL}
                    size="md"
                    name={displayName}
                  />
                ) : (
                  <LinearGradient
                    colors={isDark
                      ? ['rgba(0, 163, 246, 0.3)', 'rgba(139, 92, 246, 0.2)']
                      : ['rgba(0, 163, 246, 0.2)', 'rgba(139, 92, 246, 0.1)']
                    }
                    style={styles.avatarFallback}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.avatarText}>{initials}</Text>
                  </LinearGradient>
                )}
              </View>
            </LinearGradient>
            {/* Online indicator */}
            <View style={styles.onlineIndicator} />
          </View>

          {/* Greeting Text */}
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {greeting} 👋
            </Text>
            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Right: Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* QR Scanner */}
          <TouchableOpacity
            onPress={() => router.push('/scanner' as never)}
            style={[styles.actionButton, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
            activeOpacity={0.7}
          >
            <Ionicons name="scan-outline" size={22} color={colors.text} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={() => router.push('/notifications' as never)}
            style={[styles.actionButton, { backgroundColor: isDark ? colors.surface : colors.surfaceSecondary }]}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.primary.DEFAULT,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success.DEFAULT,
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginBottom: 2,
  },
  userName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    letterSpacing: -0.3,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.danger.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
});

export default DashboardHeader;
