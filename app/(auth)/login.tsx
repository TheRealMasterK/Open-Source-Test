/**
 * Login Screen
 * QicTrader design with inline validation
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Logo } from '@/components/ui/Logo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useAppDispatch } from '@/store';
import { setUser, setError, setFirebaseUser, setBackendToken } from '@/store/slices/authSlice';
import { authApi } from '@/services/api';
import { useFormValidation, ValidationRules } from '@/hooks/common/useFormValidation';
import { FormError } from '@/components/ui/FormError';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  console.log('[Login] Rendering');

  // Form validation setup
  const { values, validation, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', password: '' },
    {
      email: [ValidationRules.required('Email is required'), ValidationRules.email()],
      password: [ValidationRules.required('Password is required'), ValidationRules.minLength(6, 'Password must be at least 6 characters')],
    }
  );

  const handleLogin = useCallback(async () => {
    console.log('[Login] Starting login for', values.email);
    setLoginError(null);

    if (!validateAll()) {
      console.log('[Login] Validation failed');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Call backend login endpoint
      console.log('[Login] Calling backend login...');
      const authResponse = await authApi.login({
        email: values.email,
        password: values.password,
      });

      console.log('[Login] Backend login success, user:', authResponse.user?.id);

      // Step 2: Sign into Firebase using custom token from backend
      if (authResponse.token) {
        console.log('[Login] Signing into Firebase with custom token...');
        const userCredential = await signInWithCustomToken(auth, authResponse.token);
        const firebaseUser = userCredential.user;
        console.log('[Login] Firebase sign-in success, UID:', firebaseUser.uid);

        // Step 3: Update Redux state with user data
        dispatch(setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || authResponse.user?.email || '',
          displayName: firebaseUser.displayName || authResponse.user?.displayName || null,
          photoURL: firebaseUser.photoURL || null,
          emailVerified: firebaseUser.emailVerified,
        }));

        dispatch(setFirebaseUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        } as any));

        // Step 4: Store backend token and refresh token
        if (authResponse.idToken || authResponse.token) {
          const tokenToStore = authResponse.idToken || authResponse.token;
          dispatch(setBackendToken({
            token: tokenToStore,
            expiresAt: authResponse.expiresAt,
            refreshToken: authResponse.refreshToken,
          }));
          console.log('[Login] Tokens stored successfully');
          console.log('[Login] - ID Token:', !!authResponse.idToken);
          console.log('[Login] - Refresh Token:', !!authResponse.refreshToken);
          console.log('[Login] - Expires:', new Date(authResponse.expiresAt).toISOString());
        }

        router.replace('/(tabs)');
      } else {
        throw new Error('No authentication token received from backend');
      }
    } catch (error: unknown) {
      console.error('[Login] Error', error);
      let message = 'Login failed. Please try again.';
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('user-not-found') || errorMsg.includes('email_not_found')) {
          message = 'No account found with this email.';
        } else if (errorMsg.includes('wrong-password') || errorMsg.includes('invalid_password')) {
          message = 'Incorrect password.';
        } else if (errorMsg.includes('invalid-email')) {
          message = 'Invalid email address.';
        } else if (errorMsg.includes('too-many') || errorMsg.includes('too_many')) {
          message = 'Too many attempts. Please try again later.';
        } else if (errorMsg.includes('invalid-credential') || errorMsg.includes('invalid email or password')) {
          message = 'Invalid email or password.';
        } else if (errorMsg.includes('network')) {
          message = 'Network error. Please check your connection.';
        }
      }
      dispatch(setError(message));
      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  }, [values, validateAll, dispatch]);

  const getInputStyle = (field: 'email' | 'password') => [
    styles.inputContainer,
    { backgroundColor: colors.input, borderColor: validation[field]?.error && validation[field]?.touched ? Colors.danger.DEFAULT : colors.inputBorder },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.flex} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Logo width={180} height={40} />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Text style={[styles.title, { color: colors.text }]}>Welcome to QicTrader</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to your account</Text>
            </View>

            {/* Login Error Banner */}
            {loginError && (
              <View style={[styles.errorBanner, { backgroundColor: Colors.danger.bg }]}>
                <Ionicons name="alert-circle" size={20} color={Colors.danger.DEFAULT} />
                <Text style={styles.errorBannerText}>{loginError}</Text>
              </View>
            )}

            {/* Form */}
            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                <View style={getInputStyle('email')}>
                  <Ionicons name="mail-outline" size={20} color={colors.textPlaceholder} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textPlaceholder}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Email address input"
                  />
                </View>
                <FormError error={validation.email?.error} visible={validation.email?.touched} />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View style={getInputStyle('password')}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textPlaceholder} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textPlaceholder}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    accessibilityLabel="Password input"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textPlaceholder} />
                  </TouchableOpacity>
                </View>
                <FormError error={validation.password?.error} visible={validation.password?.touched} />
              </View>

              {/* Forgot Password */}
              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotPassword} accessibilityLabel="Forgot password" accessibilityRole="link">
                <Text style={[styles.forgotPasswordText, { color: Colors.primary.DEFAULT }]}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={[styles.loginButton, { backgroundColor: Colors.primary.DEFAULT }]} accessibilityLabel="Sign in" accessibilityRole="button">
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Login */}
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.card, borderColor: colors.border }]} accessibilityLabel="Continue with Google" accessibilityRole="button">
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.card, borderColor: colors.border }]} accessibilityLabel="Continue with Apple" accessibilityRole="button">
              <Ionicons name="logo-apple" size={20} color={isDark ? 'white' : 'black'} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Apple</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpRow}>
              <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')} accessibilityLabel="Sign up" accessibilityRole="link">
                <Text style={[styles.signUpLink, { color: Colors.primary.DEFAULT }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing['2xl'] },
  content: { flex: 1, paddingHorizontal: Spacing.lg },
  welcomeSection: { marginBottom: Spacing.xl },
  title: { fontSize: FontSize['2xl'], fontWeight: '700', marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.base },
  errorBanner: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, gap: Spacing.sm },
  errorBannerText: { color: Colors.danger.DEFAULT, fontSize: FontSize.sm, flex: 1 },
  form: { marginBottom: Spacing.lg },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '500', marginBottom: Spacing.sm },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.md, borderWidth: 1, height: 52 },
  input: { flex: 1, marginLeft: Spacing.sm, fontSize: FontSize.base },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: Spacing.lg },
  forgotPasswordText: { fontWeight: '500' },
  loginButton: { alignItems: 'center', borderRadius: BorderRadius.xl, paddingVertical: Spacing.md },
  loginButtonText: { color: Colors.white, fontSize: FontSize.base, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: Spacing.md },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.xl, paddingVertical: Spacing.md, borderWidth: 1, marginBottom: Spacing.md },
  socialButtonText: { marginLeft: Spacing.sm, fontWeight: '600' },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.xl },
  signUpLink: { fontWeight: '700' },
});
