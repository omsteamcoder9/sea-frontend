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

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: '#fafafa' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#D53E0F' }}></div>
            <p className="mt-4" style={{ color: '#5E0006' }}>Loading terms of service...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !termsData) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: '#fafafa' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'rgba(213, 62, 15, 0.1)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#D53E0F' }}>Error Loading Terms</h2>
            <p style={{ color: '#5E0006' }}>{error || 'Terms of service not available'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#D53E0F', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5E0006'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D53E0F'}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#fafafa' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#D53E0F' }}>
            {termsData.termsOfServiceTitle}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: '#5E0006', color: '#EED9B9' }}>
              Last updated: {termsData.termsOfServiceLastUpdated}
            </div>
          </div>
          <p className="max-w-2xl mx-auto" style={{ color: '#5E0006' }}>
            Please read these terms carefully before using our website. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Important Notice */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
              <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
              Important Notice
            </h2>
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
              <p className="mb-4" style={{ color: '#5E0006' }}>
                {termsData.termsImportantNotice}
              </p>
              {termsData.termsUserRequirements && termsData.termsUserRequirements.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {termsData.termsUserRequirements.map((point, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-2 rounded-md transition-all duration-200 font-medium shadow text-sm"
                      style={{ backgroundColor: '#D53E0F', color: 'white' }}
                    >
                      {point}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {termsData.termsSections && termsData.termsSections.length > 0 ? (
              termsData.termsSections.map((section) => (
                <section key={section.number} className="pb-8 last:border-0" style={{ borderBottom: '1px solid rgba(213, 62, 15, 0.1)' }}>
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0" style={{ backgroundColor: '#D53E0F', color: 'white' }}>
                      <span className="font-bold">{section.number}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-3" style={{ color: '#D53E0F' }}>{section.title}</h2>
                      <p className="leading-relaxed" style={{ color: '#5E0006' }}>{section.content}</p>
                    </div>
                  </div>
                </section>
              ))
            ) : (
              <p className="text-center" style={{ color: '#5E0006' }}>No terms sections available</p>
            )}
          </div>

          {/* Legal Information */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#D53E0F' }}>Intellectual Property</h3>
              <p className="text-sm" style={{ color: '#5E0006' }}>{termsData.termsIntellectualProperty}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#D53E0F' }}>Limitation of Liability</h3>
              <p className="text-sm" style={{ color: '#5E0006' }}>{termsData.termsLimitationLiability}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#D53E0F' }}>Changes to Terms</h3>
              <p className="text-sm" style={{ color: '#5E0006' }}>{termsData.termsChangesNotice}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#D53E0F' }}>Contact Information</h3>
              <p className="text-sm" style={{ color: '#5E0006' }}>{termsData.termsContactInfo}</p>
            </div>
          </div>

          {/* Contact Section */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
              <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
              Need Help?
            </h2>
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center" style={{ color: '#5E0006' }}>
                  <svg className="w-5 h-5 mr-3" style={{ color: '#D53E0F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact us using the email in our website footer</span>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/contact"
                    className="px-4 py-3 rounded-md transition-all duration-200 font-medium shadow text-center"
                    style={{ backgroundColor: '#D53E0F', color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5E0006'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D53E0F'}
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/privacy"
                    className="px-4 py-3 rounded-md transition-all duration-200 font-medium shadow text-center"
                    style={{ backgroundColor: 'white', color: '#D53E0F', border: '1px solid #D53E0F' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(213, 62, 15, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    View Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptance Section */}
          <div className="mt-10 p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 mt-1" style={{ color: '#D53E0F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p style={{ color: '#5E0006' }}>
                  By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 font-medium rounded-lg transition-all duration-200"
              style={{ backgroundColor: '#D53E0F', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5E0006'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D53E0F'}
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