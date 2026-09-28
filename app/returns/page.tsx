// app/returns/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReturnPolicy } from '@/lib/returns-api';
import { Return } from '@/types/returns';

export default function ReturnsPage() {
  const [data, setData] = useState<Return | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturnPolicy = async () => {
      try {
        setLoading(true);
        const response = await getReturnPolicy();

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError('Failed to load return policy');
        }
      } catch (err) {
        console.error('Error fetching return policy:', err);
        setError(err instanceof Error ? err.message : 'Failed to load return policy');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnPolicy();
  }, []);

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: '#F8FCFD' }}>
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto"
              style={{ borderColor: '#008FB8' }}
            ></div>
            <p className="mt-4 text-sm sm:text-base" style={{ color: '#063B5C' }}>
              Loading return policy...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error || !data) {
    return (
      <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: '#F8FCFD' }}>
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div
            className="rounded-lg p-5 sm:p-6 text-center"
            style={{ backgroundColor: 'rgba(0, 143, 184, 0.1)' }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: '#008FB8' }}>
              Return Policy Not Available
            </h2>
            <p className="text-sm sm:text-base" style={{ color: '#063B5C' }}>
              {error || 'No return policy found'}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-lg transition-colors text-sm sm:text-base"
              style={{ backgroundColor: '#008FB8', color: 'white' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#064B6A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#008FB8')}
            >
              Back to Home
            </Link>
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
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: '#063B5C' }}
          >
            {data.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            {data.headerBadge && (
              <div
                className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium"
                style={{ backgroundColor: '#064B6A', color: '#EAF8FC' }}
              >
                {data.headerBadge}
              </div>
            )}
          </div>
          <p
            className="text-sm sm:text-base max-w-2xl mx-auto"
            style={{ color: '#315A6E' }}
          >
            {data.headerSubtitle}
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-12"
          style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >

          {/* Returns Policy */}
          {data.returnsPolicy?.title && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                Our Returns Policy
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div className="flex items-start mb-4">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 mr-4 flex-shrink-0"
                    style={{ color: '#008FB8' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p
                      className="text-base sm:text-lg font-semibold mb-1"
                      style={{ color: '#063B5C' }}
                    >
                      {data.returnsPolicy.title}
                    </p>
                    <p className="text-sm sm:text-base" style={{ color: '#315A6E' }}>
                      {data.returnsPolicy.description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* How to Return */}
          {data.returnSteps?.length > 0 && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                How to Request a Return
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div className="space-y-4">
                  {data.returnSteps.map((step, index) => (
                    <div key={step._id || index} className="flex items-start">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-sm sm:text-base font-bold"
                        style={{ backgroundColor: '#008FB8', color: 'white' }}
                      >
                        {step.stepNumber}
                      </div>
                      <div>
                        <p
                          className="font-semibold text-sm sm:text-base mb-1"
                          style={{ color: '#063B5C' }}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs sm:text-sm" style={{ color: '#315A6E' }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Eligibility */}
          {data.eligibleItems?.length > 0 && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                What's Eligible for Return?
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {data.eligibleItems.map((item, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 rounded-md text-xs sm:text-sm"
                      style={{
                        backgroundColor: 'white',
                        color: '#315A6E',
                        borderLeft: '4px solid #008FB8',
                      }}
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Non-Returnable */}
          {data.nonEligibleItems?.length > 0 && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                What's Not Eligible?
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {data.nonEligibleItems.map((item, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 rounded-md text-xs sm:text-sm"
                      style={{
                        backgroundColor: 'white',
                        color: '#315A6E',
                        borderLeft: '4px solid #008FB8',
                      }}
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Refund Timeline */}
          {data.refundTimeline?.length > 0 && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                Refund Timeline
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div className="space-y-3">
                  {data.refundTimeline.map((row, index) => (
                    <div
                      key={row._id || index}
                      className="flex justify-between items-center px-4 py-3 rounded-md"
                      style={{ backgroundColor: 'white' }}
                    >
                      <span className="text-sm sm:text-base" style={{ color: '#315A6E' }}>
                        {row.method}
                      </span>
                      <span
                        className="font-semibold text-sm sm:text-base"
                        style={{ color: '#008FB8' }}
                      >
                        {row.timeline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact */}
          <section className="mb-6 sm:mb-10">
            <h2
              className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
              style={{ color: '#063B5C' }}
            >
              <div
                className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                style={{ backgroundColor: '#008FB8' }}
              ></div>
              {data.contact?.title || 'Need Help?'}
            </h2>
            <div
              className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
              style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
            >
              <p className="text-sm sm:text-base mb-4" style={{ color: '#315A6E' }}>
                {data.contact?.description ||
                  'Our support team is here to help with returns, refunds, or any questions.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div
                  className="flex items-start sm:items-center text-sm sm:text-base"
                  style={{ color: '#315A6E' }}
                >
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 sm:mt-0"
                    style={{ color: '#008FB8' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Contact us using the email in our website footer</span>
                </div>
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <Link
                    href="/contact"
                    className="px-4 py-3 rounded-md transition-all duration-200 font-medium shadow text-center text-sm sm:text-base w-full"
                    style={{ backgroundColor: '#008FB8', color: 'white' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#064B6A')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#008FB8')}
                  >
                    Contact Returns Team
                  </Link>
                  <Link
                    href="/shipping"
                    className="px-4 py-3 rounded-md transition-all duration-200 font-medium shadow text-center text-sm sm:text-base w-full"
                    style={{
                      backgroundColor: 'white',
                      color: '#008FB8',
                      border: '1px solid #008FB8',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(0, 143, 184, 0.05)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                  >
                    View Shipping Info
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Back Button */}
          <div className="text-center mt-6 sm:mt-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 font-medium rounded-lg transition-all duration-200 text-sm sm:text-base"
              style={{ backgroundColor: '#064B6A', color: 'white' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#008FB8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#064B6A')}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}