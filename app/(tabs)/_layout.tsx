/**
 * Tabs Layout
 * Main tab navigation for authenticated users
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Colors } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IconName;
  color: string;
  size: number;
  focused: boolean;
}

function TabIcon({ name, color, size, focused }: TabIconProps) {
  const iconName = focused ? name : (`${name}-outline` as IconName);
  return <Ionicons name={iconName} size={size} color={color} />;
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  const tabBarStyle = {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
  };

  const activeColor = Colors.primary.DEFAULT;
  const inactiveColor = colors.textSecondary;

  console.log('[TabsLayout] Rendering tabs, isDark:', isDark);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="wallet" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="storefront" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: 'Trades',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="swap-horizontal" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="person" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
