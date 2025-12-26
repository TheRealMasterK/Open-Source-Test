/**
 * Toast Component
 * Toast notifications for success/error messages
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeToast, Toast as ToastType } from '@/store/slices/uiSlice';

interface ToastItemProps {
  toast: ToastType;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(opacity, {
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

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: Colors.success.DEFAULT,
          icon: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          bg: Colors.danger.DEFAULT,
          icon: 'alert-circle' as const,
        };
      case 'warning':
        return {
          bg: Colors.warning.DEFAULT,
          icon: 'warning' as const,
        };
      case 'info':
      default:
        return {
          bg: Colors.info.DEFAULT,
          icon: 'information-circle' as const,
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={[
        styles.toastItem,
        {
          backgroundColor: typeStyles.bg,
          opacity,
          transform: [{ translateY }],
        },
        isDark ? {} : Shadows.lg,
      ]}>
      <Ionicons name={typeStyles.icon} size={20} color={Colors.white} style={styles.icon} />
      <Text style={styles.message} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <Ionicons name="close" size={18} color={Colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer() {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.ui);

  const handleDismiss = (id: string) => {
    dispatch(removeToast(id));
  };

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => handleDismiss(toast.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    elevation: 9999,
  },
  toastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  message: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});

export default ToastContainer;
