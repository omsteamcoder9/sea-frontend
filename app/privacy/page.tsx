// app/privacy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';

interface PrivacyPolicySettings {
  privacyPolicyTitle: string;
  privacyPolicyLastUpdated: string;
  privacyPolicyEffectiveImmediately: boolean;
  privacyPolicyIntroduction: string;
  dataWeCollect: string[];
  howWeUseInformation: string[];
  privacyIntroductionSection: string;
  informationWeCollectSection: string;
  howWeUseInformationSection: string;
  dataSecuritySection: string;
  dataProtectionRightsSection: string;
  contactUsSection: string;
  dataProtectionRightsList: string[];
  securityMeasuresSection: string;
}

export default function PrivacyPage() {
  const [settings, setSettings] = useState<PrivacyPolicySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const privacySettings = await settingsAPI.getPrivacyPolicySettings();
        setSettings(privacySettings);
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const siteName = 'FarmTools Pro'; // Updated store name

  const privacySections = [
    {
      number: 1,
      title: 'Introduction',
      content: settings?.privacyIntroductionSection || 'Welcome to our website. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at the email provided in our contact information.'
    },
    {
      number: 2,
      title: 'Information We Collect',
      content: settings?.informationWeCollectSection || 'We collect personal information that you voluntarily provide to us when you register on our website, place an order, subscribe to our newsletter, contact us with inquiries, or participate in promotions or surveys. The personal information we collect may include your name, email address, phone number, shipping address, and payment information.'
    },
    {
      number: 3,
      title: 'How We Use Your Information',
      content: settings?.howWeUseInformationSection || 'We use the information we collect for various purposes, including to process and fulfill your orders, send you order confirmations and updates, respond to your inquiries and provide customer support, send you marketing communications (with your consent), improve our website and services, and prevent fraud and enhance security.'
    },
    {
      number: 4,
      title: 'Data Security',
      content: settings?.dataSecuritySection || 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.'
    },
    {
      number: 5,
      title: 'Your Data Protection Rights',
      content: settings?.dataProtectionRightsSection || 'Depending on your location, you may have rights regarding your personal data including: the right to access your personal data, the right to rectification of inaccurate data, the right to erasure of your data, the right to restrict processing, the right to data portability, and the right to object to processing.'
    },
    {
      number: 6,
      title: 'Contact Us',
      content: settings?.contactUsSection || 'If you have questions or comments about this policy, you may contact us at the email or phone number provided in our website footer.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97A22] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading privacy policy...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {settings?.privacyPolicyTitle || 'Privacy Policy'}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-1.5 rounded-md text-sm font-medium">
              Last updated: {settings?.privacyPolicyLastUpdated || new Date().getFullYear()}
            </div>
            {settings?.privacyPolicyEffectiveImmediately && (
              <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm">
                Effective immediately
              </div>
            )}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {settings?.privacyPolicyIntroduction || 'We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Data We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Data We Collect
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6">
                We collect the following types of personal information when you interact with our website:
              </p>
              {settings?.dataWeCollect && settings.dataWeCollect.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {settings.dataWeCollect.map((point, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-2 rounded-md hover:opacity-90 transition-all duration-200 font-medium shadow text-sm text-center"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No data collection information available.</p>
              )}
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              How We Use Your Information
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6">
                Your information is used for the following purposes:
              </p>
              {settings?.howWeUseInformation && settings.howWeUseInformation.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {settings.howWeUseInformation.map((purpose, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-2 rounded-md hover:opacity-90 transition-all duration-200 font-medium shadow text-sm text-center"
                    >
                      {purpose}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No usage information available.</p>
              )}
            </div>
          </section>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {privacySections.map((section) => (
              <section key={section.number} className="border-b border-gray-200 pb-8 last:border-0">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-bold">{section.number}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Your Rights */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Your Data Protection Rights
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6">
                You have the following rights regarding your personal data:
              </p>
              {settings?.dataProtectionRightsList && settings.dataProtectionRightsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {settings.dataProtectionRightsList.map((right, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-2 rounded-md hover:opacity-90 transition-all duration-200 font-medium shadow text-sm text-center"
                    >
                      {right}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No data protection rights information available.</p>
              )}
            </div>
          </section>

          {/* Security Notice */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Security Measures
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#D97A22] mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-gray-700 mb-3">
                    {settings?.securityMeasuresSection || 'We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Contact Us
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6">
                {settings?.contactUsSection || 'If you have questions or comments about this policy, you may contact us at the email or phone number provided in our website footer.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-[#D97A22] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Contact us using the email in our website footer</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-4 py-3 rounded-md hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] transition-all duration-200 font-medium shadow hover:shadow-lg text-center"
                  >
                    Contact Privacy Team
                  </Link>
                  <Link
                    href="/terms"
                    className="bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium shadow text-center"
                  >
                    View Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Consent Notice */}
          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#D97A22] mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-gray-700">
                  By using our website, you consent to our Privacy Policy and agree to its terms.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white font-medium rounded-lg hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] transition-all duration-200 hover:shadow-lg"
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