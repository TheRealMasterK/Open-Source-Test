/**
 * AnimatedView Component
 * Entrance animations with stagger support
 * Uses a View wrapper to ensure proper ReactNode typing with React 19
 */

import React, { useEffect, useRef, ReactNode } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

export type AnimationType = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'fadeSlideUp' | 'bounce';

export interface AnimatedViewProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
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
  const progress = useRef(new Animated.Value(0)).current;
  const totalDelay = delay + staggerIndex * staggerDelay;

  useEffect(() => {
    console.log('[AnimatedView] Starting animation:', animation, 'staggerIndex:', staggerIndex);

    const springConfig = {
      toValue: 1,
      tension: animation === 'bounce' ? 40 : 50,
      friction: animation === 'bounce' ? 3 : 7,
      useNativeDriver: true,
      delay: totalDelay,
    };

    const timingConfig = {
      toValue: 1,
      duration,
      delay: totalDelay,
      useNativeDriver: true,
    };

    const anim = animation === 'bounce'
      ? Animated.spring(progress, springConfig)
      : Animated.timing(progress, timingConfig);

    anim.start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => anim.stop();
  }, []);

  const getAnimatedStyle = (): object => {
    switch (animation) {
      case 'fadeIn':
        return { opacity: progress };

      case 'slideUp':
        return {
          opacity: progress,
          transform: [{
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        };

      case 'slideDown':
        return {
          opacity: progress,
          transform: [{
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-30, 0],
            }),
          }],
        };

      case 'slideLeft':
        return {
          opacity: progress,
          transform: [{
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        };

      case 'slideRight':
        return {
          opacity: progress,
          transform: [{
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-30, 0],
            }),
          }],
        };

      case 'scale':
        return {
          opacity: progress,
          transform: [{
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          }],
        };

      case 'bounce':
        return {
          opacity: progress,
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
            },
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        };

      case 'fadeSlideUp':
      default:
        return {
          opacity: progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.8, 1],
          }),
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
              }),
            },
          ],
        };
    }
  };

  // Note: Removed flex: 0 wrapper which was causing layout issues in flex containers
  return (
    <Animated.View style={[getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  ) as React.ReactElement;
}

export default AnimatedView;
