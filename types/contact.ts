export interface ContactFormData {
  name?: string;  // Made optional - backend defaults to 'Anonymous'
  email?: string; // Made optional - backend defaults to 'No email provided'
  phone?: string; // Made optional - backend defaults to 'No phone provided'
  subject: string; // Required
  message: string; // Required
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  error?: string; // Backend sometimes returns 'error' field
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Use type aliases instead of empty extending interfaces
export type ContactResponse = ApiResponse<Contact>;

export type ContactsResponse = ApiResponse<{
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}>;

// Backend error response type
export interface BackendError {
  success: false;
  message: string;
  errors?: string[];
  error?: string;
}