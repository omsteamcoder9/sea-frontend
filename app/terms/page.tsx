// app/terms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { termsApi } from '@/lib/terms';
import { Terms } from '@/types/terms';

export default function TermsPage() {
  const [termsData, setTermsData] = useState<Terms | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await termsApi.getTerms();
        
        if (response.success && response.data) {
          setTermsData(response.data);
          setError(null);
        } else {
          setError('Failed to load terms of service');
        }
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError(err instanceof Error ? err.message : 'Failed to load terms of service');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: '#F8FCFD' }}>
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto" style={{ borderColor: '#008FB8' }}></div>
            <p className="mt-4 text-sm sm:text-base" style={{ color: '#063B5C' }}>Loading terms of service...</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error || !termsData) {
    return (
      <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: '#F8FCFD' }}>
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div className="rounded-lg p-5 sm:p-6 text-center" style={{ backgroundColor: 'rgba(0, 143, 184, 0.1)' }}>
            <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: '#008FB8' }}>Error Loading Terms</h2>
            <p className="text-sm sm:text-base" style={{ color: '#063B5C' }}>{error || 'Terms of service not available'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full sm:w-auto px-4 py-2.5 rounded-lg transition-colors text-sm sm:text-base"
              style={{ backgroundColor: '#008FB8', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#064B6A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#008FB8'}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- MAIN CONTENT ----------
  return (
    <div className="min-h-screen py-6 sm:py-12" style={{ backgroundColor: '#F8FCFD' }}>
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#063B5C' }}>
            {termsData.termsOfServiceTitle}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium" style={{ backgroundColor: '#064B6A', color: '#EAF8FC' }}>
              Last updated: {termsData.termsOfServiceLastUpdated}
            </div>
          </div>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: '#315A6E' }}>
            Please read these terms carefully before using our website. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-12" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Important Notice */}
          <div className="mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center" style={{ color: '#063B5C' }}>
              <div className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full" style={{ backgroundColor: '#008FB8' }}></div>
              Important Notice
            </h2>
            <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}>
              <p className="text-sm sm:text-base mb-3 sm:mb-4" style={{ color: '#315A6E' }}>
                {termsData.termsImportantNotice}
              </p>
              {termsData.termsUserRequirements && termsData.termsUserRequirements.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {termsData.termsUserRequirements.map((point, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-2 rounded-md transition-all duration-200 font-medium shadow text-xs sm:text-sm"
                      style={{ backgroundColor: '#008FB8', color: 'white' }}
                    >
                      {point}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6 sm:space-y-8">
            {termsData.termsSections && termsData.termsSections.length > 0 ? (
              termsData.termsSections.map((section) => (
                <section key={section.number} className="pb-6 sm:pb-8 last:border-0" style={{ borderBottom: '1px solid rgba(0, 143, 184, 0.1)' }}>
                  <div className="flex items-start mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 text-sm sm:text-base" style={{ backgroundColor: '#008FB8', color: 'white' }}>
                      <span className="font-bold">{section.number}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-2xl font-semibold mb-2 sm:mb-3" style={{ color: '#063B5C' }}>{section.title}</h2>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#315A6E' }}>{section.content}</p>
                    </div>
                  </div>
                </section>
              ))
            ) : (
              <p className="text-center text-sm sm:text-base" style={{ color: '#315A6E' }}>No terms sections available</p>
            )}
          </div>

          {/* Legal Information */}
          <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}>
              <h3 className="text-sm sm:text-base font-semibold mb-2" style={{ color: '#063B5C' }}>Intellectual Property</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#315A6E' }}>{termsData.termsIntellectualProperty}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}>
              <h3 className="text-sm sm:text-base font-semibold mb-2" style={{ color: '#063B5C' }}>Limitation of Liability</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#315A6E' }}>{termsData.termsLimitationLiability}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}>
              <h3 className="text-sm sm:text-base font-semibold mb-2" style={{ color: '#063B5C' }}>Changes to Terms</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#315A6E' }}>{termsData.termsChangesNotice}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}>
              <h3 className="text-sm sm:text-base font-semibold mb-2" style={{ color: '#063B5C' }}>Contact Information</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#315A6E' }}>{termsData.termsContactInfo}</p>
            </div>
          </div>

          {/* Contact Section */}
          <section className="mt-6 sm:mt-10">
            <h2 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center" style={{ color: '#063B5C' }}>
              <div className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full" style={{ backgroundColor: '#008FB8' }}></div>
              Need Help?
            </h2>
            <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start sm:items-center text-sm sm:text-base" style={{ color: '#315A6E' }}>
                  <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 sm:mt-0" style={{ color: '#008FB8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact us using the email in our website footer</span>
                </div>
                
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <Link
                    href="/contact"
                    className="px-4 py-3 rounded-md transition-all duration-200 font-medium shadow text-center text-sm sm:text-base w-full"
                    style={{ backgroundColor: '#008FB8', color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#064B6A'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#008FB8'}
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/privacy"
                    className="px-4 py-3 rounded-md transition-all duration-200 font-medium shadow text-center text-sm sm:text-base w-full"
                    style={{ backgroundColor: 'white', color: '#008FB8', border: '1px solid #008FB8' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 143, 184, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    View Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptance Section */}
          <div className="mt-6 sm:mt-10 p-4 sm:p-6 rounded-lg sm:rounded-xl" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}>
            <div className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" style={{ color: '#008FB8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm sm:text-base" style={{ color: '#315A6E' }}>
                  By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-6 sm:mt-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 font-medium rounded-lg transition-all duration-200 text-sm sm:text-base"
              style={{ backgroundColor: '#064B6A', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008FB8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#064B6A'}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}