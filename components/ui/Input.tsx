/**
 * Input Component
 * Reusable text input with label, error state, and icons
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  disabled = false,
  isPassword = false,
  secureTextEntry,
  ...rest
}: InputProps) {
  const { isDark, colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getBorderColor = (): string => {
    if (error) return Colors.danger.DEFAULT;
    if (isFocused) return Colors.primary.DEFAULT;
    return colors.border;
  };

  const getBackgroundColor = (): string => {
    if (disabled) {
      return isDark ? Colors.dark.surfaceSecondary : Colors.light.surfaceSecondary;
    }
    return isDark ? Colors.dark.surface : Colors.light.surface;
  };

  const shouldSecure = isPassword && !showPassword;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
          },
        ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : Spacing.md,
              paddingRight: rightIcon || isPassword ? 0 : Spacing.md,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.textTertiary}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry ?? shouldSecure}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {hint && !error && <Text style={[styles.hint, { color: colors.textTertiary }]}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    paddingVertical: Spacing.sm,
  },
  iconLeft: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
  },
  iconRight: {
    paddingRight: Spacing.md,
    paddingLeft: Spacing.xs,
  },
  error: {
    fontSize: FontSize.xs,
    color: Colors.danger.DEFAULT,
    marginTop: Spacing.xs,
  },
  hint: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
});

export default Input;
