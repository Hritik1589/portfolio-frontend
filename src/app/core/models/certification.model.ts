export interface CertificationResponse {
  id: number;
  certificateName: string;
  issuingOrganization: string;
  issueDate: string; // ISO format YYYY-MM-DD
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
}

export interface CertificationRequest {
  certificateName: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}