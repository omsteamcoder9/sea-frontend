// app/shipping/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';
import { PublicSettings } from '@/types/settings';

export default function ShippingPage() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getPublicSettings();
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const contactEmail = settings?.contactEmail || 'support@example.com';
  const contactNumber = settings?.contactNumber || '+1 (555) 123-4567';

  // Use dynamic shipping settings from backend with fallback values
  const shippingInfo = {
    shippingInfo: settings?.shippingInfo || 'Learn about our shipping policies, delivery times, and tracking information',
    orderProcessingTime: settings?.orderProcessingTime || 'All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.',
    
    domestic: {
      standard: {
        delivery: settings?.standardShippingDelivery || '5-7 business days',
        cost: 'FREE',
        freeThreshold: 'All domestic orders are delivered for free of charge.'
      },
      express: {
        delivery: settings?.expressShippingDelivery || '2-3 business days',
        cost: 'FREE',
        freeThreshold: 'All domestic orders are delivered for free of charge.'
      },
      overnight: {
        delivery: settings?.overnightShippingDelivery || '1 business day',
        cost: 'FREE',
        freeThreshold: 'All domestic orders are delivered for free of charge.'
      }
    },
    international: {
      delivery: settings?.internationalShippingDelivery || '10-15 business days',
      note: settings?.internationalShippingNote || 'International shipping costs vary by destination. You\'ll see the exact shipping cost at checkout.'
    },
    processingTime: '1-2 business days',
    tracking: 'Available for all orders',
    shippingPartners: ['FedEx', 'UPS', 'USPS', 'DHL']
  };

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97A22] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading shipping information...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {shippingInfo.shippingInfo}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Processing Time */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Order Processing Time
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700">
                {shippingInfo.orderProcessingTime}
              </p>
            </div>
          </section>

          {/* Shipping Methods */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Shipping Methods & Rates
            </h2>
            
            {/* FREE DOMESTIC SHIPPING NOTICE */}
            <div className="mb-8 p-4 bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 border border-[#D97A22]/20 rounded-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-[#D97A22] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[#D97A22] font-medium">
                  All domestic orders are delivered for free of charge.
                </p>
              </div>
            </div>
            
            {/* Single row for Standard Shipping */}
            <div className="mb-8">
              <div className="border border-gray-200 rounded-xl p-6 hover:border-[#D97A22] transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Standard Shipping</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                  <p><span className="font-medium text-gray-800">Delivery:</span> {shippingInfo.domestic.standard.delivery}</p>
                  <p><span className="font-medium text-gray-800">Cost:</span> {shippingInfo.domestic.standard.cost}</p>
                  <p><span className="font-medium text-gray-800">Free Shipping:</span> {shippingInfo.domestic.standard.freeThreshold}</p>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-[#D97A22] transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">International Shipping</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p><span className="font-medium text-gray-800">Delivery:</span> {shippingInfo.international.delivery}</p>
                <p><span className="font-medium text-gray-800">Cost:</span> Based on destination</p>
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded md:col-span-2">
                  {shippingInfo.international.note}
                </p>
              </div>
            </div>
          </section>

          {/* Contact for Support */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Need Help with Shipping?
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                If you have any questions about shipping or need assistance with your order, please contact our customer service team.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-[#D97A22] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{contactEmail}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-[#D97A22] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                  </svg>
                  <span>{contactNumber}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Back Button */}
          <div className="text-center">
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