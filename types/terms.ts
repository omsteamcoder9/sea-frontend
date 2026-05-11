// types/terms.ts

export interface TermsSection {
  number: number;
  title: string;
  content: string;
}

export interface TermsFormData {
  termsOfServiceTitle?: string;
  termsOfServiceLastUpdated?: string;
  termsImportantNotice?: string;
  termsUserRequirements?: string[];
  termsSections?: TermsSection[];
  termsIntellectualProperty?: string;
  termsLimitationLiability?: string;
  termsChangesNotice?: string;
  termsContactInfo?: string;
}

export interface Terms {
  _id: string;
  termsOfServiceTitle: string;
  termsOfServiceLastUpdated: string;
  termsImportantNotice: string;
  termsUserRequirements: string[];
  termsSections: TermsSection[];
  termsIntellectualProperty: string;
  termsLimitationLiability: string;
  termsChangesNotice: string;
  termsContactInfo: string;
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

// Type aliases for different responses
export type TermsResponse = ApiResponse<Terms>;
export type TermsListResponse = ApiResponse<Terms[]>;
export type TermsCreateResponse = ApiResponse<Terms>;
export type TermsUpdateResponse = ApiResponse<Terms>;
export type TermsDeleteResponse = ApiResponse<null>;

// Backend error response type
export interface BackendError {
  success: false;
  message: string;
  errors?: string[];
  error?: string;
}