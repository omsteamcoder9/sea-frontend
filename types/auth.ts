// types/auth.ts

export interface OtpUser {
  id: string;
  phoneNumber: string;
  email?: string | null;
  role: 'user' | 'admin';
  name?: string | null;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string | null;
}

export interface SendOtpResponse {
  success: boolean;
  exists?: boolean;        // ✅ For login - check if user exists
  isActive?: boolean;      // ✅ For signup - check if user is active
  isNewUser?: boolean;     // ✅ For signup - check if new user
  hasInactiveUser?: boolean; // ✅ For signup - check if inactive user exists
  message: string;
  otpSessionId?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: OtpUser;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}