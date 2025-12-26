/**
 * useKYC Hook
 * React Query hooks for KYC verification operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { kycApi } from '@/services/api';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { SubmitKYCPayload, UploadDocumentPayload, API_ERROR_CODES } from '@/types';

// Don't retry on auth errors
const shouldRetry = (failureCount: number, error: unknown) => {
  const apiError = error as { code?: string };
  if (apiError?.code === API_ERROR_CODES.UNAUTHORIZED || apiError?.code === API_ERROR_CODES.FORBIDDEN) {
    console.log('[useKYC] Not retrying due to auth error');
    return false;
  }
  return failureCount < 2;
};

// Query keys
export const kycKeys = {
  all: ['kyc'] as const,
  status: () => [...kycKeys.all, 'status'] as const,
  documents: () => [...kycKeys.all, 'documents'] as const,
};

/**
 * Get KYC status
 * Only fetches when authenticated
 */
export function useKYCStatus(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: kycKeys.status(),
    queryFn: () => {
      console.log('[useKYCStatus] Fetching KYC status');
      return kycApi.getStatus();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
  });
}

/**
 * Get KYC documents
 * Only fetches when authenticated
 */
export function useKYCDocuments(options?: { enabled?: boolean }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const enabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: kycKeys.documents(),
    queryFn: () => {
      console.log('[useKYCDocuments] Fetching KYC documents');
      return kycApi.getDocuments();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: shouldRetry,
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
