// types/privacy.ts

export interface PrivacySection {
  number: number;
  title: string;
  content: string;
}

export interface PrivacyFormData {
  privacyPolicyTitle?: string;
  privacyPolicyLastUpdated?: string;
  privacyIntroduction?: string;
  privacyDataCollection?: string[];
  privacyDataUsage?: string[];
  privacyDataSharing?: string[];
  privacyDataSecurity?: string;
  privacyUserRights?: string[];
  privacyCookies?: string;
  privacyThirdPartyLinks?: string;
  privacyPolicyChanges?: string;
  privacyContactInfo?: string;
  privacySections?: PrivacySection[];
}

export interface Privacy {
  _id: string;
  privacyPolicyTitle: string;
  privacyPolicyLastUpdated: string;
  privacyIntroduction: string;
  privacyDataCollection: string[];
  privacyDataUsage: string[];
  privacyDataSharing: string[];
  privacyDataSecurity: string;
  privacyUserRights: string[];
  privacyCookies: string;
  privacyThirdPartyLinks: string;
  privacyPolicyChanges: string;
  privacyContactInfo: string;
  privacySections: PrivacySection[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  error?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type PrivacyResponse = ApiResponse<Privacy>;
export type PrivacyListResponse = ApiResponse<Privacy[]>;
export type PrivacyCreateResponse = ApiResponse<Privacy>;
export type PrivacyUpdateResponse = ApiResponse<Privacy>;
export type PrivacyDeleteResponse = ApiResponse<null>;

export interface BackendError {
  success: false;
  message: string;
  errors?: string[];
  error?: string;
}