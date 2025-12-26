/**
 * Logo Component
 * QicTrader logo image
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface LogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
  color?: string;
}

export function Logo({ width = 180, height = 40 }: LogoProps) {
  return (
    <Image
      source={require('@/assets/logo.png')}
      style={[styles.logo, { width, height }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});

export default Logo;
