/**
 * KYC Types
 */

export type DocumentType = 'government_id' | 'selfie' | 'address_proof';
export type DocumentStatus = 'not_uploaded' | 'uploaded' | 'verified' | 'rejected';
export type KYCStatus = 'not_started' | 'in_progress' | 'pending_review' | 'verified' | 'rejected';

export interface KYCDocument {
  id: string;
  documentType: DocumentType;
  status: DocumentStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  rejectionReason?: string;
  uploadedAt?: string;
  verifiedAt?: string;
}

export interface KYCProfile {
  userId: string;
  status: KYCStatus;
  documents: KYCDocument[];
  personalInfo?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  rejectionReason?: string;
  verifiedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentPayload {
  documentType: DocumentType;
  file: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface SubmitKYCPayload {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  government_id: 'Government ID',
  selfie: 'Selfie with ID',
  address_proof: 'Proof of Address',
};

export const KYC_STATUS_LABELS: Record<KYCStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  pending_review: 'Pending Review',
  verified: 'Verified',
  rejected: 'Rejected',
};
