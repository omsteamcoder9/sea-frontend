// app/shipping/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getShipping } from '@/lib/shipping-api';
import { Shipping } from '@/types/shipping';

export default function ShippingPage() {
  const [data, setData] = useState<Shipping | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        setLoading(true);
        const response = await getShipping();

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError('Failed to load shipping information');
        }
      } catch (err) {
        console.error('Error fetching shipping info:', err);
        setError(err instanceof Error ? err.message : 'Failed to load shipping information');
      } finally {
        setLoading(false);
      }
    };

    fetchShipping();
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
              Loading shipping information...
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
              Shipping Info Not Available
            </h2>
            <p className="text-sm sm:text-base" style={{ color: '#063B5C' }}>
              {error || 'No shipping information found'}
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
            {data.shippingCharges?.isFree && (
              <div
                className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium"
                style={{ backgroundColor: '#008FB8', color: 'white' }}
              >
                {data.shippingCharges.freeShippingMessage || 'FREE Shipping on All Orders'}
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

          {/* Delivery Promise */}
          {data.deliveryPromise?.title && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                Next-Day Delivery Guarantee
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
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <div>
                    <p
                      className="text-base sm:text-lg font-semibold mb-1"
                      style={{ color: '#063B5C' }}
                    >
                      {data.deliveryPromise.title}
                    </p>
                    <p className="text-sm sm:text-base" style={{ color: '#315A6E' }}>
                      {data.deliveryPromise.description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Delivery Areas */}
          {data.deliveryAreas?.length > 0 && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                Delivery Areas & Timings
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {data.deliveryAreas.map((area, index) => (
                    <div
                      key={area._id || index}
                      className="px-4 py-3 rounded-md"
                      style={{ backgroundColor: 'white', borderLeft: '4px solid #008FB8' }}
                    >
                      <p
                        className="font-semibold text-sm sm:text-base mb-1"
                        style={{ color: '#063B5C' }}
                      >
                        {area.areaName}
                      </p>
                      <p className="text-xs sm:text-sm" style={{ color: '#315A6E' }}>
                        {area.timing}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Shipping Charges */}
          {data.shippingCharges?.isFree && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                Shipping Charges
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div
                  className="flex items-start p-4 sm:p-6 rounded-lg"
                  style={{ backgroundColor: 'white', borderLeft: '4px solid #008FB8' }}
                >
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p
                      className="text-base sm:text-lg font-bold mb-1"
                      style={{ color: '#008FB8' }}
                    >
                      {data.shippingCharges.freeShippingMessage}
                    </p>
                    <p className="text-sm sm:text-base" style={{ color: '#315A6E' }}>
                      {data.shippingCharges.freeShippingDescription}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Packaging */}
          {data.packaging?.items?.length > 0 && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                {data.packaging.title}
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {data.packaging.items.map((item, index) => (
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

          {/* Order Tracking */}
          {data.orderTracking?.title && (
            <section className="mb-6 sm:mb-10">
              <h2
                className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center"
                style={{ color: '#063B5C' }}
              >
                <div
                  className="w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded-full"
                  style={{ backgroundColor: '#008FB8' }}
                ></div>
                {data.orderTracking.title}
              </h2>
              <div
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}
              >
                <p className="text-sm sm:text-base mb-3" style={{ color: '#315A6E' }}>
                  {data.orderTracking.description}
                </p>
                <div
                  className="flex items-center px-4 py-3 rounded-md"
                  style={{ backgroundColor: 'white' }}
                >
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    style={{ color: '#008FB8' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base" style={{ color: '#315A6E' }}>
                    {data.orderTracking.highlight}
                  </span>
                </div>
              </div>
            </section>
          )}

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