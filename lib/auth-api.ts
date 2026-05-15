// lib/auth.ts - CORRECTED FOR YOUR BACKEND (OTP BASED)

import { 
  SendOtpRequest, 
  SendOtpResponse, 
  VerifyOtpRequest, 
  VerifyOtpResponse,
  ApiError
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Send OTP
export async function sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
  try {
    console.log('📞 Sending OTP to:', phoneNumber);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to send OTP');
    }

    const data: SendOtpResponse = await response.json();
    console.log('✅ OTP sent:', data.otpSessionId);
    
    return data;
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    throw error;
  }
}

// Verify OTP
export async function verifyOtp(otpSessionId: string, otpCode: string): Promise<VerifyOtpResponse> {
  try {
    console.log('🔐 Verifying OTP for session:', otpSessionId);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otpSessionId, otpCode }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Invalid OTP');
    }

    const data: VerifyOtpResponse = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('otp_auth_token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      console.log('✅ OTP verified, user logged in');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    throw error;
  }
}

// Get Profile (for authenticated user)
export async function getProfile(): Promise<VerifyOtpResponse> {
  try {
    const token = localStorage.getItem('otp_auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('otp_auth_token');
        localStorage.removeItem('user');
      }
      throw new Error('Failed to fetch profile');
    }

    const data: VerifyOtpResponse = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Get profile error:', error);
    throw error;
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem('otp_auth_token');
    
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('otp_auth_token');
    localStorage.removeItem('user');
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('otp_auth_token');
    return !!token;
  }
  return false;
}

// Get current user from localStorage
export function getCurrentUser(): any {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}