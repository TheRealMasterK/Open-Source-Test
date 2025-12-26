/**
 * KYC Verification Screen
 * Identity verification flow
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useKYCStatus, useSubmitKYC } from '@/hooks/api';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';

type DocumentType = 'id_front' | 'id_back' | 'selfie';

interface UploadedDoc {
  type: DocumentType;
  uri: string;
  name: string;
}

export default function KYCScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [step, setStep] = useState<'info' | 'documents' | 'review'>('info');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);

  const { data: kycStatus, isLoading } = useKYCStatus();
  const submitKYC = useSubmitKYC();

  console.log('[KYCScreen] Status:', kycStatus?.status);

  const handlePickDocument = async (docType: DocumentType) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera access is needed to take photos');
      return;
    }

    Alert.alert('Select Photo', 'Choose how to provide your document', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
          });

          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setUploadedDocs((prev) => [
              ...prev.filter((d) => d.type !== docType),
              { type: docType, uri: asset.uri, name: `${docType}.jpg` },
            ]);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
          });

          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setUploadedDocs((prev) => [
              ...prev.filter((d) => d.type !== docType),
              { type: docType, uri: asset.uri, name: `${docType}.jpg` },
            ]);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !dateOfBirth || !address) {
      Alert.alert('Error', 'Please fill in all personal information');
      return;
    }

    if (uploadedDocs.length < 3) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    try {
      console.log('[KYCScreen] Submitting KYC...');
      await submitKYC.mutateAsync({
        personalInfo: {
          firstName,
          lastName,
          dateOfBirth,
          address,
          nationality: '',
          city: '',
          postalCode: '',
          country: '',
        },
      });

      Alert.alert('Success', 'Your KYC has been submitted for review', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('[KYCScreen] Error submitting:', error);
      Alert.alert('Error', 'Failed to submit KYC. Please try again.');
    }
  };

  const isDocUploaded = (type: DocumentType) => uploadedDocs.some((d) => d.type === type);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading KYC status..." />;
  }

  // Already verified
  if (kycStatus?.status === 'verified') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="KYC Verification" showBack />
        <View style={styles.verifiedContainer}>
          <View style={[styles.verifiedIcon, { backgroundColor: Colors.success.DEFAULT + '20' }]}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success.DEFAULT} />
          </View>
          <Text style={[styles.verifiedTitle, { color: colors.text }]}>Identity Verified</Text>
          <Text style={[styles.verifiedText, { color: colors.textSecondary }]}>
            Your identity has been verified. You have full access to all features.
          </Text>
          <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: Spacing.lg }} />
        </View>
      </View>
    );
  }

  // Pending review
  if (kycStatus?.status === 'pending_review') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="KYC Verification" showBack />
        <View style={styles.verifiedContainer}>
          <View style={[styles.verifiedIcon, { backgroundColor: Colors.warning.DEFAULT + '20' }]}>
            <Ionicons name="time" size={64} color={Colors.warning.DEFAULT} />
          </View>
          <Text style={[styles.verifiedTitle, { color: colors.text }]}>Verification Pending</Text>
          <Text style={[styles.verifiedText, { color: colors.textSecondary }]}>
            Your documents are being reviewed. This usually takes 24-48 hours.
          </Text>
          <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: Spacing.lg }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="KYC Verification" showBack />

      {/* Progress Indicator */}
      <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
        {['info', 'documents', 'review'].map((s, index) => (
          <View key={s} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    ['info', 'documents', 'review'].indexOf(step) >= index
                      ? Colors.primary.DEFAULT
                      : colors.border,
                },
              ]}>
              <Text style={styles.progressNumber}>{index + 1}</Text>
            </View>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              {s === 'info' ? 'Info' : s === 'documents' ? 'Docs' : 'Review'}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {step === 'info' && (
          <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Personal Information</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Please enter your details as they appear on your ID
            </Text>

            <Input
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
            <Input
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
            <Input
              label="Address"
              placeholder="Enter your full address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </>
        )}

        {step === 'documents' && (
          <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Upload Documents</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Take clear photos of your documents
            </Text>

            {[
              { type: 'id_front' as DocumentType, label: 'ID Card - Front', icon: 'card' },
              { type: 'id_back' as DocumentType, label: 'ID Card - Back', icon: 'card-outline' },
              { type: 'selfie' as DocumentType, label: 'Selfie with ID', icon: 'person' },
            ].map((doc) => (
              <TouchableOpacity
                key={doc.type}
                style={[
                  styles.uploadCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isDocUploaded(doc.type) ? Colors.success.DEFAULT : colors.border,
                  },
                ]}
                onPress={() => handlePickDocument(doc.type)}>
                <View style={styles.uploadContent}>
                  <Ionicons
                    name={doc.icon as any}
                    size={32}
                    color={isDocUploaded(doc.type) ? Colors.success.DEFAULT : colors.textSecondary}
                  />
                  <View style={styles.uploadInfo}>
                    <Text style={[styles.uploadLabel, { color: colors.text }]}>{doc.label}</Text>
                    <Text style={[styles.uploadStatus, { color: colors.textTertiary }]}>
                      {isDocUploaded(doc.type) ? 'Uploaded' : 'Tap to upload'}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isDocUploaded(doc.type) ? 'checkmark-circle' : 'chevron-forward'}
                  size={24}
                  color={isDocUploaded(doc.type) ? Colors.success.DEFAULT : colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </>
        )}

        {step === 'review' && (
          <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Review & Submit</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Please verify your information is correct
            </Text>

            <Card variant="outlined" style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Name</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {firstName} {lastName}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>DOB</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>{dateOfBirth}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Address</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>{address}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Documents</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>
                  {uploadedDocs.length}/3 uploaded
                </Text>
              </View>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: colors.border,
          },
        ]}>
        {step === 'info' && (
          <Button
            title="Continue"
            onPress={() => setStep('documents')}
            disabled={!firstName || !lastName || !dateOfBirth || !address}
            fullWidth
            size="lg"
          />
        )}
        {step === 'documents' && (
          <View style={styles.buttonRow}>
            <Button
              title="Back"
              onPress={() => setStep('info')}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Continue"
              onPress={() => setStep('review')}
              disabled={uploadedDocs.length < 3}
              style={{ flex: 1, marginLeft: Spacing.sm }}
            />
          </View>
        )}
        {step === 'review' && (
          <View style={styles.buttonRow}>
            <Button
              title="Back"
              onPress={() => setStep('documents')}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Submit"
              onPress={handleSubmit}
              loading={submitKYC.isPending}
              style={{ flex: 1, marginLeft: Spacing.sm }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.xl,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    color: Colors.white,
    fontWeight: '600',
  },
  progressLabel: {
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadInfo: {
    marginLeft: Spacing.md,
  },
  uploadLabel: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  uploadStatus: {
    fontSize: FontSize.xs,
  },
  reviewCard: {
    marginTop: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.borderLight,
  },
  reviewLabel: {
    fontSize: FontSize.sm,
  },
  reviewValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  verifiedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  verifiedIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  verifiedTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  verifiedText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
  },
});
