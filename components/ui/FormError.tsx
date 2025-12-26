/**
 * FormError Component
 * Displays inline form validation errors with animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';

export interface FormErrorProps {
  error: string | null;
  visible?: boolean;
}

export function FormError({ error, visible = true }: FormErrorProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (error && visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error, visible, fadeAnim, translateY]);

  if (!error || !visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons name="alert-circle" size={14} color={Colors.danger.DEFAULT} />
      <Text style={styles.errorText}>{error}</Text>
    </Animated.View>
  );
}

// Success feedback variant
export function FormSuccess({ message, visible = true }: { message: string; visible?: boolean }) {
  if (!visible) return null;

  return (
    <View style={styles.successContainer}>
      <Ionicons name="checkmark-circle" size={14} color={Colors.success.DEFAULT} />
      <Text style={styles.successText}>{message}</Text>
    </View>
  );
}

// Helper text variant
export function FormHint({ hint }: { hint: string }) {
  return (
    <View style={styles.hintContainer}>
      <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
      <Text style={styles.hintText}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  errorText: {
    color: Colors.danger.DEFAULT,
    fontSize: FontSize.xs,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  successText: {
    color: Colors.success.DEFAULT,
    fontSize: FontSize.xs,
    flex: 1,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  hintText: {
    color: '#6B7280',
    fontSize: FontSize.xs,
    flex: 1,
  },
});

export default FormError;
