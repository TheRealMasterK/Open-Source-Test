/**
 * AnimatedPressable Component
 * Premium touchable with scale and haptic feedback using React Native Animated API
 */

import React, { useRef, useCallback, ReactNode } from 'react';
import { Animated, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface AnimatedPressableProps {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  scaleAmount?: number;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';
  style?: StyleProp<ViewStyle>;
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
  const scale = useRef(new Animated.Value(1)).current;

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

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleAmount,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleAmount, scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [scale]);

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

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPress={handlePress}
      onLongPress={onLongPress ? handleLongPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default AnimatedPressable;
