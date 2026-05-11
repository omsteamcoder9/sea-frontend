// app/privacy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { privacyApi } from '@/lib/privacy';
import { Privacy } from '@/types/privacy';

export default function PrivacyPage() {
  const [privacyData, setPrivacyData] = useState<Privacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const response = await privacyApi.getPrivacy();
        
        if (response.success && response.data) {
          setPrivacyData(response.data);
        } else {
          setError('Failed to load privacy policy');
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setError(error instanceof Error ? error.message : 'Failed to load privacy policy');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: '#fafafa' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#D53E0F' }}></div>
            <p className="mt-4" style={{ color: '#5E0006' }}>Loading privacy policy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !privacyData) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: '#fafafa' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'rgba(213, 62, 15, 0.1)' }}>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#D53E0F' }}>Privacy Policy Not Available</h2>
            <p style={{ color: '#5E0006' }}>{error || 'No privacy policy found'}</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#D53E0F', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5E0006'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D53E0F'}
            >
              Back to Home
            </Link>
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
            {privacyData.privacyPolicyTitle}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="px-3 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: '#5E0006', color: '#EED9B9' }}>
              Last updated: {privacyData.privacyPolicyLastUpdated}
            </div>
          </div>
          <p className="max-w-2xl mx-auto" style={{ color: '#5E0006' }}>
            {privacyData.privacyIntroduction}
          </p>
        </div>

        <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          
          {/* Data Collection */}
          {privacyData.privacyDataCollection && privacyData.privacyDataCollection.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
                <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
                Information We Collect
              </h2>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {privacyData.privacyDataCollection.map((item, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-2 rounded-md text-sm"
                      style={{ backgroundColor: 'white', color: '#5E0006', borderLeft: '4px solid #D53E0F' }}
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Data Usage */}
          {privacyData.privacyDataUsage && privacyData.privacyDataUsage.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
                <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
                How We Use Your Information
              </h2>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {privacyData.privacyDataUsage.map((item, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-2 rounded-md text-sm"
                      style={{ backgroundColor: 'white', color: '#5E0006', borderLeft: '4px solid #D53E0F' }}
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Privacy Sections */}
          {privacyData.privacySections && privacyData.privacySections.length > 0 && (
            <div className="space-y-8 mb-10">
              {privacyData.privacySections.map((section) => (
                <section key={section.number} className="pb-8" style={{ borderBottom: '1px solid rgba(213, 62, 15, 0.1)' }}>
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
              ))}
            </div>
          )}

          {/* Data Security */}
          {privacyData.privacyDataSecurity && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
                <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
                Data Security
              </h2>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
                <p style={{ color: '#5E0006' }}>{privacyData.privacyDataSecurity}</p>
              </div>
            </section>
          )}

          {/* User Rights */}
          {privacyData.privacyUserRights && privacyData.privacyUserRights.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
                <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
                Your Privacy Rights
              </h2>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {privacyData.privacyUserRights.map((item, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-2 rounded-md text-sm"
                      style={{ backgroundColor: 'white', color: '#5E0006', borderLeft: '4px solid #D53E0F' }}
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Cookies Policy */}
          {privacyData.privacyCookies && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
                <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
                Cookies Policy
              </h2>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
                <p style={{ color: '#5E0006' }}>{privacyData.privacyCookies}</p>
              </div>
            </section>
          )}

          {/* Third Party Links */}
          {privacyData.privacyThirdPartyLinks && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
                <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
                Third-Party Links
              </h2>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
                <p style={{ color: '#5E0006' }}>{privacyData.privacyThirdPartyLinks}</p>
              </div>
            </section>
          )}

          {/* Policy Changes */}
          {privacyData.privacyPolicyChanges && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
                <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
                Changes to This Privacy Policy
              </h2>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
                <p style={{ color: '#5E0006' }}>{privacyData.privacyPolicyChanges}</p>
              </div>
            </section>
          )}

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: '#D53E0F' }}>
              <div className="w-2 h-8 mr-3 rounded-full" style={{ backgroundColor: '#D53E0F' }}></div>
              Contact Us
            </h2>
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
              <p className="mb-6" style={{ color: '#5E0006' }}>{privacyData.privacyContactInfo}</p>
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
                    Contact Privacy Team
                  </Link>
                  <Link
                    href="/terms"
                    className="px-4 py-3 rounded-md transition-all duration-200 font-medium shadow text-center"
                    style={{ backgroundColor: 'white', color: '#D53E0F', border: '1px solid #D53E0F' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(213, 62, 15, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    View Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Consent Notice */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(213, 62, 15, 0.05)' }}>
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 mt-1" style={{ color: '#D53E0F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p style={{ color: '#5E0006' }}>
                  By using our website, you consent to our Privacy Policy and agree to its terms.
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