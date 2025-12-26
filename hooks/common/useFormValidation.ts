/**
 * useFormValidation Hook
 * Provides form validation utilities with real-time feedback
 */

import { useState, useCallback, useMemo } from 'react';

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface FieldValidation {
  isValid: boolean;
  error: string | null;
  touched: boolean;
}

export interface FormValidationState {
  [field: string]: FieldValidation;
}

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  password: (message = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'): ValidationRule => ({
    validate: (value) => {
      const hasMinLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
    },
    message,
  }),

  passwordSimple: (message = 'Password must be at least 6 characters'): ValidationRule => ({
    validate: (value) => value.length >= 6,
    message,
  }),

  match: (matchValue: string, message = 'Fields do not match'): ValidationRule => ({
    validate: (value) => value === matchValue,
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value) => /^\+?[\d\s-]{10,}$/.test(value.replace(/\s/g, '')),
    message,
  }),

  numeric: (message = 'Please enter a valid number'): ValidationRule => ({
    validate: (value) => !isNaN(parseFloat(value)) && isFinite(Number(value)),
    message,
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
};

export interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  validationSchema: Partial<Record<keyof T, ValidationRule[]>>,
  options: UseFormValidationOptions = {}
) {
  const { validateOnChange = true, validateOnBlur = true } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [validation, setValidation] = useState<FormValidationState>(() => {
    const initial: FormValidationState = {};
    Object.keys(initialValues).forEach((key) => {
      initial[key] = { isValid: true, error: null, touched: false };
    });
    return initial;
  });

  console.log('[useFormValidation] Validation state:', validation);

  const validateField = useCallback(
    (field: keyof T, value: string): FieldValidation => {
      const rules = validationSchema[field] || [];
      for (const rule of rules) {
        if (!rule.validate(value)) {
          console.log('[useFormValidation] Field failed validation:', field, rule.message);
          return { isValid: false, error: rule.message, touched: true };
        }
      }
      return { isValid: true, error: null, touched: true };
    },
    [validationSchema]
  );

  const handleChange = useCallback(
    (field: keyof T) => (value: string) => {
      console.log('[useFormValidation] Field changed:', field, value.length > 0 ? '(has value)' : '(empty)');
      setValues((prev) => ({ ...prev, [field]: value }));

      if (validateOnChange && validation[field as string]?.touched) {
        const result = validateField(field, value);
        setValidation((prev) => ({ ...prev, [field as string]: result }));
      }
    },
    [validateField, validateOnChange, validation]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      if (validateOnBlur) {
        const result = validateField(field, values[field]);
        setValidation((prev) => ({ ...prev, [field as string]: result }));
      }
    },
    [validateField, validateOnBlur, values]
  );

  const validateAll = useCallback((): boolean => {
    let isFormValid = true;
    const newValidation: FormValidationState = {};

    Object.keys(values).forEach((field) => {
      const result = validateField(field as keyof T, values[field as keyof T]);
      newValidation[field] = result;
      if (!result.isValid) {
        isFormValid = false;
      }
    });

    console.log('[useFormValidation] Validate all result:', isFormValid);
    setValidation(newValidation);
    return isFormValid;
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    console.log('[useFormValidation] Resetting form');
    setValues(initialValues);
    const initial: FormValidationState = {};
    Object.keys(initialValues).forEach((key) => {
      initial[key] = { isValid: true, error: null, touched: false };
    });
    setValidation(initial);
  }, [initialValues]);

  const isFormValid = useMemo(() => {
    return Object.values(validation).every((v) => v.isValid || !v.touched);
  }, [validation]);

  const hasErrors = useMemo(() => {
    return Object.values(validation).some((v) => !v.isValid && v.touched);
  }, [validation]);

  return {
    values,
    validation,
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    resetForm,
    isFormValid,
    hasErrors,
    setValues,
  };
}

export default useFormValidation;
