/**
 * PremiumHeader Component - Enterprise Grade
 * Premium app header with gradient background and actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  Spacing,
  FontSize,
  FontFamily,
  BorderRadius,
  IconSize,
} from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import Avatar from './Avatar';

interface PremiumHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showAvatar?: boolean;
  userName?: string;
  userImage?: string;
  onAvatarPress?: () => void;
  showNotification?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
  rightActions?: React.ReactNode;
  transparent?: boolean;
  gradient?: boolean;
  large?: boolean;
}

export function PremiumHeader({
  title,
  subtitle,
  showBackButton = false,
  onBack,
  showAvatar = false,
  userName,
  userImage,
  onAvatarPress,
  showNotification = false,
  notificationCount = 0,
  onNotificationPress,
  rightActions,
  transparent = false,
  gradient = false,
  large = false,
}: PremiumHeaderProps) {
  const insets = useSafeAreaInsets();
  const { isDark, colors, shadows } = useTheme();

  console.log('[PremiumHeader] Rendering:', { title, showBackButton, gradient });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderContent = () => (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.sm,
          backgroundColor: transparent || gradient
            ? 'transparent'
            : isDark
            ? colors.navBg
            : colors.navBg,
        },
        !transparent && !gradient && shadows.sm,
      ]}
    >
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              onPress={onBack}
              style={[
                styles.backButton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={IconSize.lg}
                color={gradient ? Colors.white : colors.text}
              />
            </TouchableOpacity>
          )}

          {showAvatar && (
            <TouchableOpacity
              onPress={onAvatarPress}
              style={styles.avatarContainer}
              activeOpacity={0.8}
            >
              <Avatar
                name={userName || 'User'}
                imageUrl={userImage}
                size="md"
                showStatus
                isOnline
              />
            </TouchableOpacity>
          )}

          <View style={styles.titleContainer}>
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: gradient
                      ? 'rgba(255, 255, 255, 0.7)'
                      : colors.textSecondary,
                  },
                ]}
              >
                {subtitle || getGreeting()}
              </Text>
            )}
            {title && (
              <Text
                style={[
                  styles.title,
                  large && styles.titleLarge,
                  { color: gradient ? Colors.white : colors.text },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showNotification && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={[
                styles.iconButton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications-outline"
                size={IconSize.lg}
                color={gradient ? Colors.white : colors.text}
              />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {rightActions}
        </View>
      </View>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={isDark ? ['#151B28', '#0A0E17'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradientWrapper}
      >
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        {renderContent()}
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : colors.navBg}
        translucent={transparent}
      />
      {renderContent()}
    </>
  );
}

const styles = StyleSheet.create({
  gradientWrapper: {
    width: '100%',
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginBottom: 2,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
  },
  titleLarge: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
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
  badgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.white,
  },
});

export default PremiumHeader;
