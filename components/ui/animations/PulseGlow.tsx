/**
 * PulseGlow Component
 * Animated glow/pulse effect for premium cards
 * Uses React.createElement to avoid JSX type issues with React 19
 */

import React, { useEffect, useRef, ReactNode } from 'react';
import { View, Animated, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '@/config/theme';

export interface PulseGlowProps {
  children: ReactNode;
  glowColor?: string;
  glowIntensity?: 'subtle' | 'medium' | 'strong';
  pulseSpeed?: 'slow' | 'normal' | 'fast';
  style?: StyleProp<ViewStyle>;
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
  const pulse = useRef(new Animated.Value(0)).current;

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
      pulse.setValue(0);
      return;
    }

    console.log('[PulseGlow] Starting pulse animation');
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [enabled, duration]);

  const glowStyle = {
    shadowColor: glowColor,
    shadowOpacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [intensity.minOpacity, intensity.maxOpacity],
    }),
    shadowRadius: intensity.blur,
    shadowOffset: { width: 0, height: 4 },
    transform: [{
      scale: pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.02],
      }),
    }],
  };

  return (
    <View style={{ flex: 0 }}>
      <Animated.View style={[glowStyle, style]}>
        {children}
      </Animated.View>
    </View>
  ) as React.ReactElement;
}

export default PulseGlow;
