import { 
  SendOtpResponse, 
  VerifyOtpResponse, 
  OtpUser,
  ApiError 
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN_KEY = 'otp_auth_token';
const USER_KEY = 'otp_user_data';

class OtpAuthService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  }

  private getUser(): OtpUser | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private setUser(user: OtpUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
      const customHeaders = options.headers as Record<string, string>;
      Object.assign(headers, customHeaders);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        success: false,
        message: data.message || 'An error occurred',
        statusCode: response.status,
      };
      throw error;
    }

    return data as T;
  }

  /**
   * Send OTP for LOGIN - Checks if user exists first
   * ✅ If user doesn't exist, returns exists: false (NO OTP sent)
   */
  async sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      // ✅ If user doesn't exist, return exists: false
      if (!response.ok && data.exists === false) {
        return {
          success: false,
          exists: false,
          message: data.message || 'No account found with this number',
          otpSessionId: undefined,
          isNewUser: true,
        };
      }

      // ✅ If user exists, return sessionId
      if (response.ok && data.success) {
        return {
          success: true,
          exists: true,
          message: data.message || 'OTP sent successfully',
          otpSessionId: data.sessionId,
          isNewUser: false,
        };
      }

      // Other errors
      throw new Error(data.message || 'Failed to send OTP');
      
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  /**
   * Send OTP for SIGNUP - Allows new users
   * ✅ If user exists and is active, returns exists: true, isActive: true
   * ✅ If user is new or inactive, sends OTP
   */
  async sendSignupOtp(phoneNumber: string): Promise<SendOtpResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-signup-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      // ✅ If user exists and is active, return exists: true
      if (!response.ok && data.exists && data.isActive) {
        return {
          success: false,
          exists: true,
          isActive: true,
          message: data.message || 'Account already exists. Please login.',
          otpSessionId: undefined,
          isNewUser: false,
        };
      }

      // ✅ New user or inactive user - OTP sent
      if (response.ok && data.success) {
        return {
          success: true,
          exists: false,
          isActive: false,
          message: data.message || 'OTP sent successfully',
          otpSessionId: data.sessionId,
          isNewUser: data.isNewUser !== undefined ? data.isNewUser : true,
          hasInactiveUser: data.hasInactiveUser || false,
        };
      }

      throw new Error(data.message || 'Failed to send OTP');
      
    } catch (error: any) {
      console.error('Send signup OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP and login/signup
   */
  async verifyOtp(otpSessionId: string, otpCode: string): Promise<{ token: string; user: OtpUser }> {
    const response = await this.request<VerifyOtpResponse>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ sessionId: otpSessionId, otpCode }),
    });

    if (!response.success || !response.token || !response.user) {
      throw new Error(response.message || 'Verification failed');
    }

    this.setToken(response.token);
    this.setUser(response.user);

    return {
      token: response.token,
      user: response.user,
    };
  }

  /**
   * Resend OTP for LOGIN
   */
  async resendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    return this.sendOtp(phoneNumber);
  }

  /**
   * Resend OTP for SIGNUP
   */
  async resendSignupOtp(phoneNumber: string): Promise<SendOtpResponse> {
    return this.sendSignupOtp(phoneNumber);
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): OtpUser | null {
    return this.getUser();
  }

  /**
   * Get current authentication token
   */
  getCurrentToken(): string | null {
    return this.getToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * Fetch user profile from server
   */
  async getProfile(): Promise<OtpUser> {
    const response = await this.request<{ success: boolean; user: OtpUser }>('/api/auth/profile', {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error('Failed to fetch profile');
    }

    this.setUser(response.user);
    return response.user;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Handle phone number submission for LOGIN (Step 1)
   * ✅ Returns sessionId only if user exists
   */
  async submitPhone(phoneNumber: string): Promise<{ 
    sessionId?: string; 
    isNewUser: boolean;
    exists: boolean;
  }> {
    const response = await this.sendOtp(phoneNumber);
    
    // ✅ If user doesn't exist, return exists: false
    if (!response.success && response.exists === false) {
      return {
        sessionId: undefined,
        isNewUser: true,
        exists: false,
      };
    }

    // ✅ User exists - return sessionId
    if (response.success && response.otpSessionId) {
      return {
        sessionId: response.otpSessionId,
        isNewUser: false,
        exists: true,
      };
    }

    throw new Error(response.message || 'Failed to send OTP');
  }

  /**
   * Handle phone number submission for SIGNUP (Step 1)
   * ✅ Returns sessionId only for new/inactive users
   */
  async submitSignupPhone(phoneNumber: string): Promise<{
    sessionId?: string;
    isNewUser: boolean;
    exists: boolean;
    isActive: boolean;
    hasInactiveUser: boolean;
  }> {
    const response = await this.sendSignupOtp(phoneNumber);
    
    // ✅ If user exists and is active, return exists: true
    if (!response.success && response.exists && response.isActive) {
      return {
        sessionId: undefined,
        isNewUser: false,
        exists: true,
        isActive: true,
        hasInactiveUser: false,
      };
    }

    // ✅ New user or inactive user - return sessionId
    if (response.success && response.otpSessionId) {
      return {
        sessionId: response.otpSessionId,
        isNewUser: response.isNewUser !== undefined ? response.isNewUser : true,
        exists: false,
        isActive: false,
        hasInactiveUser: response.hasInactiveUser || false,
      };
    }

    throw new Error(response.message || 'Failed to send OTP');
  }

  /**
   * Verify OTP and complete authentication (Step 2)
   */
  async verifyAndAuthenticate(sessionId: string, otpCode: string): Promise<OtpUser> {
    const { user } = await this.verifyOtp(sessionId, otpCode);
    return user;
  }
}

// Export singleton instance
export const otpAuth = new OtpAuthService();

// Export individual functions for convenience
export const sendOtp = (phoneNumber: string) => otpAuth.sendOtp(phoneNumber);
export const sendSignupOtp = (phoneNumber: string) => otpAuth.sendSignupOtp(phoneNumber);
export const verifyOtp = (sessionId: string, otpCode: string) => otpAuth.verifyOtp(sessionId, otpCode);
export const logout = () => otpAuth.logout();
export const getCurrentUser = () => otpAuth.getCurrentUser();
export const isAuthenticated = () => otpAuth.isAuthenticated();
export const getProfile = () => otpAuth.getProfile();