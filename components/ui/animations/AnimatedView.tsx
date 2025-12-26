/**
 * AnimatedView Component
 * Reanimated-powered entrance animations with stagger support
 */

import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

export type AnimationType = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'fadeSlideUp' | 'bounce';

export interface AnimatedViewProps {
  children: React.ReactElement | React.ReactElement[];
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  staggerIndex?: number;
  staggerDelay?: number;
  onAnimationComplete?: () => void;
}

const STAGGER_BASE_DELAY = 100;
const DEFAULT_DURATION = 400;

export function AnimatedView({
  children,
  animation = 'fadeSlideUp',
  delay = 0,
  duration = DEFAULT_DURATION,
  style,
  staggerIndex = 0,
  staggerDelay = STAGGER_BASE_DELAY,
  onAnimationComplete,
}: AnimatedViewProps) {
  const progress = useSharedValue(0);
  const totalDelay = delay + staggerIndex * staggerDelay;

  useEffect(() => {
    console.log('[AnimatedView] Starting animation:', animation, 'staggerIndex:', staggerIndex);

    const animationConfig = animation === 'bounce'
      ? withSpring(1, { damping: 12, stiffness: 100 })
      : withTiming(1, { duration, easing: Easing.out(Easing.cubic) });

    progress.value = withDelay(totalDelay, animationConfig);

    // Callback after animation completes
    if (onAnimationComplete) {
      const callbackDelay = totalDelay + duration + 50;
      setTimeout(() => runOnJS(onAnimationComplete)(), callbackDelay);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animation) {
      case 'fadeIn':
        return { opacity: progress.value };

      case 'slideUp':
        return {
          opacity: progress.value,
          transform: [{ translateY: interpolate(progress.value, [0, 1], [30, 0]) }],
        };

      case 'slideDown':
        return {
          opacity: progress.value,
          transform: [{ translateY: interpolate(progress.value, [0, 1], [-30, 0]) }],
        };

      case 'slideLeft':
        return {
          opacity: progress.value,
          transform: [{ translateX: interpolate(progress.value, [0, 1], [30, 0]) }],
        };

      case 'slideRight':
        return {
          opacity: progress.value,
          transform: [{ translateX: interpolate(progress.value, [0, 1], [-30, 0]) }],
        };

      case 'scale':
        return {
          opacity: progress.value,
          transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1]) }],
        };

      case 'bounce':
        return {
          opacity: progress.value,
          transform: [
            { scale: interpolate(progress.value, [0, 1], [0.85, 1]) },
            { translateY: interpolate(progress.value, [0, 1], [20, 0]) },
          ],
        };

      case 'fadeSlideUp':
      default:
        return {
          opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.8, 1]),
          transform: [
            { translateY: interpolate(progress.value, [0, 1], [24, 0]) },
            { scale: interpolate(progress.value, [0, 1], [0.97, 1]) },
          ],
        };
    }
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

export default AnimatedView;
