/**
 * useKYC Hook
 * React Query hooks for KYC verification operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kycApi } from '@/services/api';
import { SubmitKYCPayload, UploadDocumentPayload } from '@/types';

// Query keys
export const kycKeys = {
  all: ['kyc'] as const,
  status: () => [...kycKeys.all, 'status'] as const,
  documents: () => [...kycKeys.all, 'documents'] as const,
};

/**
 * Get KYC status
 */
export function useKYCStatus() {
  return useQuery({
    queryKey: kycKeys.status(),
    queryFn: () => kycApi.getStatus(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get KYC documents
 */
export function useKYCDocuments() {
  return useQuery({
    queryKey: kycKeys.documents(),
    queryFn: () => kycApi.getDocuments(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Submit KYC verification mutation
 */
export function useSubmitKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitKYCPayload) => kycApi.submitKYC(payload),
    onSuccess: (data) => {
      console.log('[useSubmitKYC] Success');
      queryClient.setQueryData(kycKeys.status(), data);
    },
    onError: (error) => {
      console.error('[useSubmitKYC] Error:', error);
    },
  });
}

/**
 * Upload KYC document mutation
 */
export function useUploadKYCDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => kycApi.uploadDocument(payload),
    onSuccess: () => {
      console.log('[useUploadKYCDocument] Success');
      queryClient.invalidateQueries({ queryKey: kycKeys.documents() });
      queryClient.invalidateQueries({ queryKey: kycKeys.status() });
    },
    onError: (error) => {
      console.error('[useUploadKYCDocument] Error:', error);
    },
  });
}

export default {
  useKYCStatus,
  useKYCDocuments,
  useSubmitKYC,
  useUploadKYCDocument,
};
