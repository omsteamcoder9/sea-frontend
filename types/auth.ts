// types/auth.ts

// ========== OTP AUTH TYPES ==========

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otpSessionId?: string;
  isNewUser?: boolean;
}

export interface VerifyOtpRequest {
  otpSessionId: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: OtpUser;
}

export interface OtpUser {
  id: string;
  phoneNumber: string;
  email?: string;  // ✅ ADD THIS - optional since OTP users may not have email
  name?: string;   // ✅ ADD THIS - optional name field
  createdAt: string;
  lastLogin: string;
  isActive?: boolean;
  role?: 'user' | 'admin';  // ✅ ADD THIS for admin check
}

export interface OtpAuthResponse {
  token: string;
  user: OtpUser;
}

export interface ApiError {
  success: boolean;
  message: string;
  statusCode?: number;
}

// Session management
export interface OtpSession {
  sessionId: string;
  phoneNumber: string;
  expiresAt: number;
}

// Component Props
export interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export interface OtpInputProps {
  sessionId: string;
  phoneNumber: string;
  onVerify: (sessionId: string, otpCode: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export interface UserState {
  user: OtpUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}