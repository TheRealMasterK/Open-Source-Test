/**
 * AnimatedPressable Component
 * Premium touchable with scale and haptic feedback
 */

import React, { useCallback } from 'react';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

export interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  scaleAmount?: number;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';
  style?: ViewStyle;
}

export function AnimatedPressable({
  children,
  onPress,
  onLongPress,
  disabled = false,
  scaleAmount = 0.97,
  hapticFeedback = 'light',
  style,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const triggerHaptic = useCallback(() => {
    if (hapticFeedback === 'none') return;

    try {
      switch (hapticFeedback) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch (error) {
      console.log('[AnimatedPressable] Haptic error:', error);
    }
  }, [hapticFeedback]);

  const handlePress = useCallback(() => {
    console.log('[AnimatedPressable] Press triggered');
    triggerHaptic();
    onPress?.();
  }, [onPress, triggerHaptic]);

  const handleLongPress = useCallback(() => {
    console.log('[AnimatedPressable] Long press triggered');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onLongPress?.();
  }, [onLongPress]);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(scaleAmount, { damping: 15, stiffness: 300 });
      opacity.value = withSpring(0.9, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 300 });
    })
    .onEnd(() => {
      if (onPress) {
        runOnJS(handlePress)();
      }
    });

  const longPressGesture = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .minDuration(500)
    .onStart(() => {
      if (onLongPress) {
        runOnJS(handleLongPress)();
      }
    });

  const composedGesture = Gesture.Race(tapGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export default AnimatedPressable;
