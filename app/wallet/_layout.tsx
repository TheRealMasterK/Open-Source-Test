/**
 * Wallet Stack Layout
 */

import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/common/useTheme';

export default function WalletLayout() {
  const { colors } = useTheme();

  console.log('[WalletLayout] Rendering');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="deposit" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="transfer" />
      <Stack.Screen name="history" />
      <Stack.Screen name="[crypto]" />
    </Stack>
  );
}
