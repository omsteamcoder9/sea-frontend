"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { sendSignupOtp, verifyOtp, isLoading } = useAuth();
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const returnTo = searchParams.get('returnTo');
  const phoneFromUrl = searchParams.get('phone');

  useEffect(() => {
    if (phoneFromUrl) {
      setPhoneNumber(phoneFromUrl);
    }
  }, [phoneFromUrl]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    if (errors.phoneNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtpCode(value);
      if (errors.otpCode) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.otpCode;
          return newErrors;
        });
      }
    }
  };

  const validatePhoneNumber = () => {
    if (!phoneNumber) {
      setErrors({ phoneNumber: 'Phone number is required' });
      return false;
    }
    if (phoneNumber.length < 10) {
      setErrors({ phoneNumber: 'Please enter a valid 10-digit phone number' });
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    if (!otpCode) {
      setErrors({ otpCode: 'OTP code is required' });
      return false;
    }
    if (otpCode.length < 4) {
      setErrors({ otpCode: 'Please enter a valid OTP code' });
      return false;
    }
    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber()) return;

    setIsSendingOtp(true);
    setErrors({});
    setResendMessage(null);
    
    try {
      const result = await sendSignupOtp(phoneNumber);
      
      // ✅ If user already exists and is active, redirect to login
      if (result.exists && result.isActive) {
        setResendMessage('Account already exists. Redirecting to login...');
        setTimeout(() => {
          router.push(`/login?phone=${phoneNumber}`);
        }, 1500);
        return;
      }
      
      // ✅ New user or inactive user - proceed with OTP verification
      // ✅ FIX: Only set sessionId if it exists, otherwise show error
      if (result.sessionId) {
        setSessionId(result.sessionId);
      } else {
        setErrors({ phoneNumber: 'Failed to get OTP session' });
        setIsSendingOtp(false);
        return;
      }
      
      setResendTimer(60);
      setResendMessage('OTP sent successfully!');
      
      setTimeout(() => setResendMessage(null), 3000);
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('Send OTP error:', error);
      setErrors({ phoneNumber: error.message || 'Failed to send OTP. Please try again.' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsSendingOtp(true);
    setResendMessage(null);
    
    try {
      const result = await sendSignupOtp(phoneNumber);
      
      if (result.exists && result.isActive) {
        setResendMessage('Account already exists. Redirecting to login...');
        setTimeout(() => {
          router.push(`/login?phone=${phoneNumber}`);
        }, 1500);
        return;
      }
      
      // ✅ FIX: Only set sessionId if it exists
      if (result.sessionId) {
        setSessionId(result.sessionId);
      } else {
        setResendMessage('Failed to get OTP session. Please try again.');
        setIsSendingOtp(false);
        return;
      }
      
      setResendTimer(60);
      setResendMessage('OTP resent successfully!');
      
      setTimeout(() => setResendMessage(null), 3000);
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setResendMessage('Failed to resend OTP. Please try again.');
      setTimeout(() => setResendMessage(null), 3000);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOtp() || !sessionId) return;

    setIsVerifyingOtp(true);
    setErrors({});
    
    try {
      const user = await verifyOtp(sessionId, otpCode);
      
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push('/profile');
      }
      
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setErrors({ otpCode: error.message || 'Invalid OTP code. Please try again.' });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const isLoadingState = isSendingOtp || isVerifyingOtp || isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#B8DCE7]">
        <div className="relative px-8 pt-8 pb-6" style={{ background: '#064B6A' }}>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative z-10"
          >
            <h2 className="text-3xl font-bold text-white">
              {sessionId ? 'Verify OTP' : 'Create Account'}
            </h2>
            <p className="text-white opacity-90 mt-2 text-sm">
              {sessionId 
                ? `Enter the 6-digit code sent to ${phoneNumber}`
                : 'Sign up with your phone number'
              }
            </p>
          </motion.div>
        </div>

        {!sessionId ? (
          <form onSubmit={handleSendOtp} className="px-8 py-8 bg-white">
            {resendMessage && (
              <div className={`mb-4 p-3 rounded-xl ${
                resendMessage.includes('already exists') 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <p className={`text-sm text-center ${
                  resendMessage.includes('already exists') ? 'text-yellow-700' : 'text-green-700'
                }`}>
                  {resendMessage}
                </p>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-[#315A6E] mb-2 ml-1">
                Phone Number
              </label>
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: focusedField === 'phoneNumber' ? 1.02 : 1,
                    borderColor: focusedField === 'phoneNumber' ? '#008FB8' : errors.phoneNumber ? '#f87171' : '#B8DCE7'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative rounded-xl border-2 ${
                    errors.phoneNumber ? 'border-red-300' : 'border-[#B8DCE7]'
                  } bg-[#F8FCFD] hover:bg-white transition-all duration-300 overflow-hidden group`}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'phoneNumber' ? 'text-[#008FB8]' : 'text-[#315A6E]/60 group-hover:text-[#315A6E]'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                    <span className="text-[#315A6E]/70">+91</span>
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-20 pr-4 py-3.5 rounded-xl outline-none bg-transparent text-[#063B5C] placeholder-[#315A6E]/50"
                    placeholder="9876543210"
                    disabled={isLoadingState}
                    maxLength={10}
                    autoFocus={!phoneFromUrl}
                  />
                </motion.div>
              </div>
              <AnimatePresence>
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phoneNumber}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={isLoadingState}
              whileHover={{ scale: isLoadingState ? 1 : 1.02 }}
              whileTap={{ scale: isLoadingState ? 1 : 0.98 }}
              className="w-full py-4 px-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: '#064B6A' }}
            >
              {isSendingOtp ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending OTP...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign Up with OTP
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#B8DCE7]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#315A6E]/60">Quick & Secure Signup</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#315A6E]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="font-semibold text-[#008FB8] hover:underline transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>

            <p className="text-xs text-center text-[#315A6E]/70 mt-4">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#008FB8] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#008FB8] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="px-8 py-8 bg-white">
            <div className="mb-6">
              <label htmlFor="otpCode" className="block text-sm font-semibold text-[#315A6E] mb-2 ml-1">
                Enter OTP Code
              </label>
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: focusedField === 'otpCode' ? 1.02 : 1,
                    borderColor: focusedField === 'otpCode' ? '#008FB8' : errors.otpCode ? '#f87171' : '#B8DCE7'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative rounded-xl border-2 ${
                    errors.otpCode ? 'border-red-300' : 'border-[#B8DCE7]'
                  } bg-[#F8FCFD] hover:bg-white transition-all duration-300 overflow-hidden group`}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'otpCode' ? 'text-[#008FB8]' : 'text-[#315A6E]/60 group-hover:text-[#315A6E]'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="otpCode"
                    name="otpCode"
                    value={otpCode}
                    onChange={handleOtpChange}
                    onFocus={() => setFocusedField('otpCode')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl outline-none bg-transparent text-[#063B5C] text-center text-2xl tracking-widest font-mono"
                    placeholder="••••••"
                    disabled={isVerifyingOtp}
                    maxLength={6}
                    autoFocus
                  />
                </motion.div>
              </div>
              <p className="mt-2 text-xs text-[#315A6E]/70 text-center">
                We've sent a 6-digit OTP to +91 {phoneNumber}
              </p>
              <AnimatePresence>
                {errors.otpCode && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="mt-2 text-sm text-red-500 flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.otpCode}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {resendMessage && !resendMessage.includes('Welcome') && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 text-center">{resendMessage}</p>
              </div>
            )}

            <div className="text-center mb-6">
              <p className="text-sm text-[#315A6E]">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isSendingOtp}
                  className={`font-semibold transition-all ${
                    resendTimer > 0 || isSendingOtp
                      ? 'text-[#315A6E]/50 cursor-not-allowed'
                      : 'text-[#008FB8] hover:underline'
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isVerifyingOtp}
              whileHover={{ scale: isVerifyingOtp ? 1 : 1.02 }}
              whileTap={{ scale: isVerifyingOtp ? 1 : 0.98 }}
              className="w-full py-4 px-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: '#064B6A' }}
            >
              {isVerifyingOtp ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Verify & Create Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </motion.button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setSessionId(null);
                  setOtpCode('');
                  setErrors({});
                  setResendMessage(null);
                }}
                className="text-sm text-[#315A6E] hover:text-[#063B5C] transition-colors"
              >
                ← Back to phone number
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}