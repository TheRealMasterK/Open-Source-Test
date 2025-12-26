/**
 * Settings Stack Layout
 */

import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/common/useTheme';

export default function SettingsLayout() {
  const { colors } = useTheme();

  console.log('[SettingsLayout] Rendering');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
