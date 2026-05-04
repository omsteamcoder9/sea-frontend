// app/terms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';

interface TermsOfServiceSettings {
  termsOfServiceTitle: string;
  termsOfServiceLastUpdated: string;
  termsImportantNotice: string;
  termsUserRequirements: string[];
  termsSections: Array<{ number: number; title: string; content: string }>;
  termsIntellectualProperty: string;
  termsLimitationLiability: string;
  termsChangesNotice: string;
  termsContactInfo: string;
}

export default function TermsPage() {
  const [settings, setSettings] = useState<TermsOfServiceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const termsSettings = await settingsAPI.getTermsOfServiceSettings();
        setSettings(termsSettings);
      } catch (error) {
        console.error('Error fetching terms settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97A22] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading terms of service...</p>
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
            {settings?.termsOfServiceTitle || 'Terms of Service'}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-1.5 rounded-md text-sm font-medium">
              Last updated: {settings?.termsOfServiceLastUpdated || new Date().getFullYear()}
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our website. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Important Notice */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Important Notice
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                {settings?.termsImportantNotice || 'These Terms of Service govern your use of our website and services. By using our website, you acknowledge that you have read, understood, and agree to be bound by these terms.'}
              </p>
              {settings?.termsUserRequirements && settings.termsUserRequirements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {settings.termsUserRequirements.map((point, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-2 rounded-md hover:opacity-90 transition-all duration-200 font-medium shadow text-sm"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'You must be at least 18 years old to place an order',
                    'Payment processing is handled by secure third-party providers',
                    'All product images are for illustrative purposes only',
                    'Shipping times are estimates and not guarantees',
                    'We reserve the right to refuse service to anyone'
                  ].map((point, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-2 rounded-md hover:opacity-90 transition-all duration-200 font-medium shadow text-sm"
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
            {settings?.termsSections && settings.termsSections.length > 0 ? (
              settings.termsSections.map((section) => (
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
              ))
            ) : (
              // Fallback to default sections if none exist
              [
                {
                  number: 1,
                  title: 'Agreement to Terms',
                  content: 'By accessing and using our website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Website.'
                },
                {
                  number: 2,
                  title: 'User Accounts',
                  content: 'When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.'
                },
                {
                  number: 3,
                  title: 'Product Information',
                  content: 'We make every effort to display as accurately as possible the colors, features, specifications, and details of products available on the Website. However, we do not guarantee that the colors, features, specifications, and details will be completely accurate. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time.'
                },
                {
                  number: 4,
                  title: 'Orders and Payment',
                  content: 'By placing an order through our Website, you warrant that you are legally capable of entering into binding contracts and are at least 18 years old. We accept various payment methods as indicated on the Website. All payments are processed through secure third-party payment processors. We do not store your credit card information.'
                },
                {
                  number: 5,
                  title: 'Shipping and Delivery',
                  content: 'Shipping times and costs will vary depending on your location and the shipping method selected. Estimated delivery times are provided at checkout and are estimates only. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.'
                },
                {
                  number: 6,
                  title: 'Returns and Refunds',
                  content: 'Please review our Returns Policy for detailed information about returning products. Returns must be initiated within the specified return period and meet all return requirements.'
                },
                {
                  number: 7,
                  title: 'Intellectual Property',
                  content: settings?.termsIntellectualProperty || 'All content on this Website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by copyright and other intellectual property laws.'
                },
                {
                  number: 8,
                  title: 'Limitation of Liability',
                  content: settings?.termsLimitationLiability || 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.'
                },
                {
                  number: 9,
                  title: 'Changes to Terms',
                  content: settings?.termsChangesNotice || 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.'
                },
                {
                  number: 10,
                  title: 'Contact Information',
                  content: settings?.termsContactInfo || 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'
                }
              ].map((section) => (
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
              ))
            )}
          </div>

          {/* Contact Information */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Contact Us
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6">
                {settings?.termsContactInfo || 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'}
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
                    Contact Support
                  </Link>
                  <Link
                    href="/privacy"
                    className="bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium shadow text-center"
                  >
                    View Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptance Section */}
          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#D97A22] mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-gray-700">
                  By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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