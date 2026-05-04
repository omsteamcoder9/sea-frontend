"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OtpUser } from '@/types/auth';
import { otpAuth } from '@/lib/otpAuth';

interface AuthContextType {
  user: OtpUser | null;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const currentUser = otpAuth.getCurrentUser();
        const isAuth = otpAuth.isAuthenticated();
        
        if (currentUser && isAuth) {
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
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
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
      setUser(user);
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
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
        getProfile,
        isAuthenticated: !!user && otpAuth.isAuthenticated(),
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