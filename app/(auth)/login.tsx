/**
 * Login Screen
 * User authentication with email/password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Colors } from '@/config/theme';
import { useAppDispatch } from '@/store';
import { setUser, setError, setLoading, setFirebaseUser } from '@/store/slices/authSlice';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputBg = isDark ? 'bg-slate-800' : 'bg-slate-100';
  const inputText = isDark ? 'text-white' : 'text-slate-900';
  const placeholderColor = isDark ? '#64748b' : '#94a3b8';

  console.log('[Login] Rendering');

  const handleLogin = async () => {
    console.log('[Login] handleLogin: Starting login for', email);

    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('[Login] handleLogin: Success, UID:', firebaseUser.uid);

      dispatch(
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        })
      );
      dispatch(setFirebaseUser(firebaseUser));

      router.replace('/(tabs)');
    } catch (error: unknown) {
      console.error('[Login] handleLogin: Error', error);

      let message = 'Login failed. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          message = 'No account found with this email.';
        } else if (error.message.includes('wrong-password')) {
          message = 'Incorrect password.';
        } else if (error.message.includes('invalid-email')) {
          message = 'Invalid email address.';
        } else if (error.message.includes('too-many-requests')) {
          message = 'Too many attempts. Please try again later.';
        }
      }

      dispatch(setError(message));
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mt-12 mb-8">
            <Text className={`${textColor} text-3xl font-bold mb-2`}>
              Welcome Back
            </Text>
            <Text className={`${textSecondary} text-base`}>
              Sign in to continue trading
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            {/* Email Input */}
            <View className="mb-4">
              <Text className={`${textColor} font-medium mb-2`}>Email</Text>
              <View className={`${inputBg} rounded-xl flex-row items-center px-4`}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={placeholderColor}
                />
                <TextInput
                  className={`flex-1 ${inputText} py-4 px-3 font-medium`}
                  placeholder="Enter your email"
                  placeholderTextColor={placeholderColor}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className={`${textColor} font-medium mb-2`}>Password</Text>
              <View className={`${inputBg} rounded-xl flex-row items-center px-4`}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={placeholderColor}
                />
                <TextInput
                  className={`flex-1 ${inputText} py-4 px-3 font-medium`}
                  placeholder="Enter your password"
                  placeholderTextColor={placeholderColor}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={placeholderColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              className="self-end"
            >
              <Text style={{ color: Colors.primary.DEFAULT }} className="font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="py-4 rounded-xl items-center mb-6"
            style={{ backgroundColor: Colors.primary.DEFAULT }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <Text className={`${textSecondary} mx-4`}>or</Text>
            <View className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          </View>

          {/* Social Login */}
          <TouchableOpacity
            className={`${inputBg} py-4 rounded-xl flex-row items-center justify-center mb-4`}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text className={`${textColor} font-semibold ml-3`}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`${inputBg} py-4 rounded-xl flex-row items-center justify-center mb-6`}
          >
            <Ionicons name="logo-apple" size={20} color={isDark ? 'white' : 'black'} />
            <Text className={`${textColor} font-semibold ml-3`}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mb-8">
            <Text className={textSecondary}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={{ color: Colors.primary.DEFAULT }} className="font-bold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
