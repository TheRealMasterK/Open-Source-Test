/**
 * Signup Screen
 * User registration with email/password
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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Colors } from '@/config/theme';
import { useAppDispatch } from '@/store';
import { setUser, setError, setFirebaseUser } from '@/store/slices/authSlice';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputBg = isDark ? 'bg-slate-800' : 'bg-slate-100';
  const inputText = isDark ? 'text-white' : 'text-slate-900';
  const placeholderColor = isDark ? '#64748b' : '#94a3b8';

  console.log('[Signup] Rendering');

  const handleSignup = async () => {
    console.log('[Signup] handleSignup: Starting signup for', email);

    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the Terms & Conditions');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('[Signup] handleSignup: Account created, UID:', firebaseUser.uid);

      // Update display name
      await updateProfile(firebaseUser, { displayName: username });

      console.log('[Signup] handleSignup: Profile updated');

      dispatch(
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: username,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        })
      );
      dispatch(setFirebaseUser(firebaseUser));

      router.replace('/(tabs)');
    } catch (error: unknown) {
      console.error('[Signup] handleSignup: Error', error);

      let message = 'Signup failed. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          message = 'An account with this email already exists.';
        } else if (error.message.includes('invalid-email')) {
          message = 'Invalid email address.';
        } else if (error.message.includes('weak-password')) {
          message = 'Password is too weak.';
        }
      }

      dispatch(setError(message));
      Alert.alert('Signup Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="mb-4 mt-4">
            <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className={`${textColor} mb-2 text-3xl font-bold`}>Create Account</Text>
            <Text className={`${textSecondary} text-base`}>Start your crypto trading journey</Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            {/* Username Input */}
            <View className="mb-4">
              <Text className={`${textColor} mb-2 font-medium`}>Username</Text>
              <View className={`${inputBg} flex-row items-center rounded-xl px-4`}>
                <Ionicons name="person-outline" size={20} color={placeholderColor} />
                <TextInput
                  className={`flex-1 ${inputText} px-3 py-4 font-medium`}
                  placeholder="Choose a username"
                  placeholderTextColor={placeholderColor}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className={`${textColor} mb-2 font-medium`}>Email</Text>
              <View className={`${inputBg} flex-row items-center rounded-xl px-4`}>
                <Ionicons name="mail-outline" size={20} color={placeholderColor} />
                <TextInput
                  className={`flex-1 ${inputText} px-3 py-4 font-medium`}
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
              <Text className={`${textColor} mb-2 font-medium`}>Password</Text>
              <View className={`${inputBg} flex-row items-center rounded-xl px-4`}>
                <Ionicons name="lock-closed-outline" size={20} color={placeholderColor} />
                <TextInput
                  className={`flex-1 ${inputText} px-3 py-4 font-medium`}
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <View className="mb-4">
              <Text className={`${textColor} mb-2 font-medium`}>Confirm Password</Text>
              <View className={`${inputBg} flex-row items-center rounded-xl px-4`}>
                <Ionicons name="lock-closed-outline" size={20} color={placeholderColor} />
                <TextInput
                  className={`flex-1 ${inputText} px-3 py-4 font-medium`}
                  placeholder="Confirm your password"
                  placeholderTextColor={placeholderColor}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              className="flex-row items-center">
              <View
                className={`mr-3 h-6 w-6 items-center justify-center rounded-md border-2 ${
                  acceptedTerms
                    ? 'bg-primary border-primary'
                    : isDark
                      ? 'border-slate-600'
                      : 'border-slate-300'
                }`}
                style={
                  acceptedTerms
                    ? {
                        backgroundColor: Colors.primary.DEFAULT,
                        borderColor: Colors.primary.DEFAULT,
                      }
                    : {}
                }>
                {acceptedTerms && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text className={`${textSecondary} flex-1`}>
                I agree to the{' '}
                <Text style={{ color: Colors.primary.DEFAULT }}>Terms & Conditions</Text> and{' '}
                <Text style={{ color: Colors.primary.DEFAULT }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={isLoading}
            className="mb-6 items-center rounded-xl py-4"
            style={{ backgroundColor: Colors.primary.DEFAULT }}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-bold text-white">Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="mb-8 flex-row justify-center">
            <Text className={textSecondary}>Already have an account? </Text>
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
