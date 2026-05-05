// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OtpUser } from '@/types/auth';
import { otpAuth } from '@/lib/otpAuth';

interface AuthContextType {
  user: OtpUser | null;
  token: string | null; // ✅ ADD THIS
  isLoading: boolean;
  sendOtp: (phoneNumber: string) => Promise<{ sessionId: string; isNewUser: boolean }>;
  verifyOtp: (sessionId: string, otpCode: string) => Promise<OtpUser>;
  logout: () => void;
  getProfile: () => Promise<OtpUser | null>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<OtpUser | null>(null);
  const [token, setToken] = useState<string | null>(null); // ✅ ADD THIS
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const currentUser = otpAuth.getCurrentUser();
        const currentToken = otpAuth.getCurrentToken(); // ✅ GET TOKEN
        const isAuth = otpAuth.isAuthenticated();
        
        if (currentUser && isAuth) {
          setToken(currentToken); // ✅ SET TOKEN
          // Try to refresh profile from server
          try {
            const freshUser = await otpAuth.getProfile();
            setUser(freshUser);
          } catch {
            // If profile fetch fails, use stored user
            setUser(currentUser);
          }
        } else {
          setUser(null);
          setToken(null); // ✅ CLEAR TOKEN
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setToken(null); // ✅ CLEAR TOKEN
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      const result = await otpAuth.submitPhone(phoneNumber);
      return result;
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (sessionId: string, otpCode: string) => {
    try {
      setIsLoading(true);
      const user = await otpAuth.verifyAndAuthenticate(sessionId, otpCode);
      const newToken = otpAuth.getCurrentToken(); // ✅ GET NEW TOKEN AFTER VERIFY
      setUser(user);
      setToken(newToken); // ✅ SET TOKEN
      return user;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw new Error(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    otpAuth.logout();
    setUser(null);
    setToken(null); // ✅ CLEAR TOKEN ON LOGOUT
  };

  const getProfile = async () => {
    try {
      if (!otpAuth.isAuthenticated()) {
        return null;
      }
      const user = await otpAuth.getProfile();
      setUser(user);
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // ✅ EXPOSE TOKEN
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
        getProfile,
        isAuthenticated: !!user && !!token, // ✅ UPDATE THIS CHECK
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}