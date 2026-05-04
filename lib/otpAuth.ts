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
   * Send OTP to phone number
   */
  async sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    const response = await this.request<SendOtpResponse>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
    return response;
  }

  /**
   * Verify OTP and login/signup
   */
  async verifyOtp(otpSessionId: string, otpCode: string): Promise<{ token: string; user: OtpUser }> {
    const response = await this.request<VerifyOtpResponse>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otpSessionId, otpCode }),
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
   * Resend OTP
   */
  async resendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    return this.sendOtp(phoneNumber);
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
   * Handle phone number submission (Step 1)
   */
  async submitPhone(phoneNumber: string): Promise<{ sessionId: string; isNewUser: boolean }> {
    const response = await this.sendOtp(phoneNumber);
    
    if (!response.success || !response.otpSessionId) {
      throw new Error(response.message || 'Failed to send OTP');
    }

    return {
      sessionId: response.otpSessionId,
      isNewUser: response.isNewUser || false,
    };
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
export const verifyOtp = (sessionId: string, otpCode: string) => otpAuth.verifyOtp(sessionId, otpCode);
export const logout = () => otpAuth.logout();
export const getCurrentUser = () => otpAuth.getCurrentUser();
export const isAuthenticated = () => otpAuth.isAuthenticated();
export const getProfile = () => otpAuth.getProfile();