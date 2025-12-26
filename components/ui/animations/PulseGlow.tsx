/**
 * PulseGlow Component
 * Animated glow/pulse effect for premium cards
 */

import React, { useEffect } from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors } from '@/config/theme';

export interface PulseGlowProps {
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: 'subtle' | 'medium' | 'strong';
  pulseSpeed?: 'slow' | 'normal' | 'fast';
  style?: ViewStyle;
  enabled?: boolean;
}

export function PulseGlow({
  children,
  glowColor = Colors.primary.DEFAULT,
  glowIntensity = 'medium',
  pulseSpeed = 'normal',
  style,
  enabled = true,
}: PulseGlowProps) {
  const pulse = useSharedValue(0);

  const durationMap = {
    slow: 3000,
    normal: 2000,
    fast: 1000,
  };

  const intensityMap = {
    subtle: { minOpacity: 0.05, maxOpacity: 0.15, blur: 8 },
    medium: { minOpacity: 0.1, maxOpacity: 0.25, blur: 12 },
    strong: { minOpacity: 0.15, maxOpacity: 0.35, blur: 16 },
  };

  const duration = durationMap[pulseSpeed];
  const intensity = intensityMap[glowIntensity];

  useEffect(() => {
    if (!enabled) {
      pulse.value = 0;
      return;
    }

    console.log('[PulseGlow] Starting pulse animation');
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [enabled, duration]);

  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(
      pulse.value,
      [0, 1],
      [intensity.minOpacity, intensity.maxOpacity]
    );

    const scale = interpolate(pulse.value, [0, 1], [1, 1.02]);

    return {
      shadowColor: glowColor,
      shadowOpacity: glowOpacity,
      shadowRadius: intensity.blur,
      shadowOffset: { width: 0, height: 4 },
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[glowStyle, style]}>
      {children}
    </Animated.View>
  );
}

export default PulseGlow;
