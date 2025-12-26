/**
 * CountUpText Component
 * Animated number counting effect
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export interface CountUpTextProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  style?: TextStyle;
  formatFn?: (value: number) => string;
}

export function CountUpText({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 800,
  style,
  formatFn,
}: CountUpTextProps) {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState('0');

  const updateDisplay = useCallback((val: number) => {
    if (formatFn) {
      setDisplayValue(formatFn(val));
    } else {
      setDisplayValue(val.toFixed(decimals));
    }
  }, [formatFn, decimals]);

  useEffect(() => {
    console.log('[CountUpText] Animating to:', value);
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration]);

  useAnimatedReaction(
    () => animatedValue.value,
    (val) => {
      runOnJS(updateDisplay)(val);
    }
  );

  return (
    <Text style={style}>
      {prefix}{displayValue}{suffix}
    </Text>
  );
}

export default CountUpText;
