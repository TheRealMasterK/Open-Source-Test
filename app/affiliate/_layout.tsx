/**
 * Affiliate Stack Layout
 */

import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/common/useTheme';

export default function AffiliateLayout() {
  const { colors } = useTheme();

  console.log('[AffiliateLayout] Rendering');

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
