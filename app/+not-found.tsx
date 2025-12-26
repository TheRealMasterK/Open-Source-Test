/* eslint-disable react/no-unescaped-entities */
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  console.log('[NotFoundScreen] Rendering 404 page');
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-foreground">This screen doesn't exist.</Text>
      <Link href="/" className="mt-4 pt-4">
        <Text className="text-base text-brand-blue">Go to home screen!</Text>
      </Link>
    </View>
  );
}
