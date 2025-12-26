/**
 * Offers Stack Layout
 */

import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/common/useTheme';

export default function OffersLayout() {
  const { colors } = useTheme();

  console.log('[OffersLayout] Rendering');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="create" />
    </Stack>
  );
}
