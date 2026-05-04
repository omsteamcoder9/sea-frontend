"use client";

import { Suspense } from 'react';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6600] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}