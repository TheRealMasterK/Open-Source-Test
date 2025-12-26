/**
 * Forgot Password Screen
 * Password reset via email
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
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Colors } from '@/config/theme';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputBg = isDark ? 'bg-slate-800' : 'bg-slate-100';
  const inputText = isDark ? 'text-white' : 'text-slate-900';
  const placeholderColor = isDark ? '#64748b' : '#94a3b8';

  console.log('[ForgotPassword] Rendering, emailSent:', emailSent);

  const handleResetPassword = async () => {
    console.log('[ForgotPassword] handleResetPassword: Starting for', email);

    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      console.log('[ForgotPassword] handleResetPassword: Email sent');
      setEmailSent(true);
    } catch (error: unknown) {
      console.error('[ForgotPassword] handleResetPassword: Error', error);

      let message = 'Failed to send reset email. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          message = 'No account found with this email address.';
        } else if (error.message.includes('invalid-email')) {
          message = 'Invalid email address.';
        }
      }

      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView className={`flex-1 ${bgColor}`}>
        <View className="flex-1 px-6 justify-center items-center">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: `${Colors.success.DEFAULT}20` }}
          >
            <Ionicons
              name="mail-outline"
              size={40}
              color={Colors.success.DEFAULT}
            />
          </View>

          <Text className={`${textColor} text-2xl font-bold text-center mb-4`}>
            Check Your Email
          </Text>

          <Text className={`${textSecondary} text-center mb-8`}>
            We&apos;ve sent a password reset link to{'\n'}
            <Text className={textColor}>{email}</Text>
          </Text>

          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            className="py-4 px-8 rounded-xl"
            style={{ backgroundColor: Colors.primary.DEFAULT }}
          >
            <Text className="text-white font-bold">Back to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEmailSent(false)}
            className="mt-4"
          >
            <Text style={{ color: Colors.primary.DEFAULT }}>
              Didn&apos;t receive email? Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-8">
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? 'white' : 'black'}
            />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className={`${textColor} text-3xl font-bold mb-2`}>
              Forgot Password?
            </Text>
            <Text className={`${textSecondary} text-base`}>
              Enter your email and we&apos;ll send you a link to reset your password
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            <View className="mb-4">
              <Text className={`${textColor} font-medium mb-2`}>Email</Text>
              <View
                className={`${inputBg} rounded-xl flex-row items-center px-4`}
              >
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
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={isLoading}
            className="py-4 rounded-xl items-center mb-6"
            style={{ backgroundColor: Colors.primary.DEFAULT }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View className="flex-row justify-center">
            <Text className={textSecondary}>Remember your password? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={{ color: Colors.primary.DEFAULT }} className="font-bold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
