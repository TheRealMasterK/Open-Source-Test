/**
 * KYC API Service
 * Handles KYC verification API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { get, post, httpClient } from './http-client';
import {
  KYCProfile,
  KYCDocument,
  UploadDocumentPayload,
  SubmitKYCPayload,
  DocumentType,
} from '@/types';

/**
 * Get KYC status
 */
export async function getStatus(): Promise<KYCProfile> {
  console.log('[KYCAPI] getStatus: Fetching KYC status');

  try {
    const response = await get<KYCProfile>(API_ENDPOINTS.KYC.STATUS);

    if (response.success && response.data) {
      console.log('[KYCAPI] getStatus: Status is', response.data.status);
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch KYC status');
  } catch (error) {
    console.error('[KYCAPI] getStatus: Error', error);
    throw error;
  }
}

/**
 * Upload KYC document
 */
export async function uploadDocument(payload: UploadDocumentPayload): Promise<KYCDocument> {
  console.log('[KYCAPI] uploadDocument: Uploading', payload.documentType);

  try {
    const formData = new FormData();
    formData.append('documentType', payload.documentType);
    formData.append('file', {
      uri: payload.file.uri,
      name: payload.file.name,
      type: payload.file.type,
    } as unknown as Blob);

    const response = await httpClient.post<{
      success: boolean;
      data: KYCDocument;
      message?: string;
    }>(API_ENDPOINTS.KYC.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success && response.data.data) {
      console.log('[KYCAPI] uploadDocument: Success');
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to upload document');
  } catch (error) {
    console.error('[KYCAPI] uploadDocument: Error', error);
    throw error;
  }
}

/**
 * Submit KYC for review
 */
export async function submitKYC(payload: SubmitKYCPayload): Promise<KYCProfile> {
  console.log('[KYCAPI] submitKYC: Submitting KYC for review');

  try {
    const response = await post<KYCProfile>(API_ENDPOINTS.KYC.SUBMIT, payload);

    if (response.success && response.data) {
      console.log('[KYCAPI] submitKYC: Success, status is', response.data.status);
      return response.data;
    }

    throw new Error(response.message || 'Failed to submit KYC');
  } catch (error) {
    console.error('[KYCAPI] submitKYC: Error', error);
    throw error;
  }
}

/**
 * Get uploaded documents
 */
export async function getDocuments(): Promise<KYCDocument[]> {
  console.log('[KYCAPI] getDocuments: Fetching documents');

  try {
    const response = await get<KYCDocument[]>(API_ENDPOINTS.KYC.DOCUMENTS);

    if (response.success && response.data) {
      console.log('[KYCAPI] getDocuments: Found', response.data.length, 'documents');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch documents');
  } catch (error) {
    console.error('[KYCAPI] getDocuments: Error', error);
    throw error;
  }
}

export default {
  getStatus,
  uploadDocument,
  submitKYC,
  getDocuments,
};
