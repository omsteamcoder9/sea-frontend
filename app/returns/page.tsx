// app/returns/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';
import { PublicSettings } from '@/types/settings';

export default function ReturnsPage() {
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

  // Use dynamic returns policy settings from backend with fallback values
  const returnsPolicy = {
    title: settings?.returnsPolicyTitle || 'No Returns & No Refunds Policy',
    description: settings?.returnsPolicyDescription || 'We do not allow returns or refunds for any purchases made through our website. All sales are final and non-refundable. If the order is damaged or wrong product sent then we will process you with a refund.',
    
    returnSteps: settings?.returnProcessSteps || [
      {
        title: 'No Returns',
        description: 'We do not accept returns for any purchases made through our website.',
      },
      {
        title: 'No Refunds',
        description: 'All sales are final and non-refundable.',
      },
      {
        title: 'Damaged Items Only',
        description: 'Only if the order is damaged or wrong product sent then we will process you with a refund.',
      },
      {
        title: 'Contact Immediately',
        description: 'If you receive a damaged or wrong product, contact us immediately for a refund.',
      }
    ],
    
    timeframe: settings?.returnTimeframe || '7 days for damage/wrong item claims',
    
    conditions: settings?.returnConditions || [
      'Damaged items only',
      'Wrong products only',
      'Contact within 7 days',
      'Provide photo evidence'
    ],
    
    shippingResponsibility: settings?.customerShippingResponsibility || 'For approved damaged/wrong item cases only, we cover return shipping.',
    
    nonReturnableItems: settings?.nonReturnableItems || [
      'All purchases (no returns)',
      'No refunds for change of mind',
      'No refunds for wrong size',
      'No refunds for wrong color',
      'No refunds for any other reason',
      'All sales are final'
    ],
    
    defectiveItemsNote: settings?.defectiveItemsNote || 'We do not allow returns or refunds for any purchases made through our website. All sales are final and non-refundable. If the order is damaged or wrong product sent then we will process you with a refund.',
    
    refundProcessingTime: settings?.refundProcessingTime || '5-10 business days',
    refundNote: settings?.refundNote || 'Refunds only for damaged or wrong items. All other sales are final and non-refundable.',
    refundAmountFormula: settings?.refundAmountFormula || 'Refund = Full purchase price',
    refundAmountDescription: settings?.refundAmountDescription || 'For damaged or wrong items only: full refund including shipping.',
    
    exchangePolicy: settings?.exchangePolicy || 'We do not allow returns or refunds for any purchases. All sales are final. No exchanges.'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97A22] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading policy...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{returnsPolicy.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {returnsPolicy.description}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Return Process Steps */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Our Strict Policy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnsPolicy.returnSteps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-[#D97A22] transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Return Conditions */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Only These Exceptions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Timeframe for Claims</h3>
                <p className="text-gray-700">
                  Only <strong className="text-gray-800">{returnsPolicy.timeframe}</strong>. No returns or refunds for any other purchases.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Accept</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {returnsPolicy.conditions.map((requirement, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-2 rounded-md hover:opacity-90 transition-all duration-200 font-medium shadow text-sm text-center cursor-pointer"
                    >
                      {requirement}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Shipping Costs</h3>
                <p className="text-gray-700">
                  {returnsPolicy.shippingResponsibility}
                </p>
              </div>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              No Returns For Any Purchases
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6">
                We do not allow returns or refunds for any purchases made through our website:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {returnsPolicy.nonReturnableItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-3 py-2 rounded-md hover:opacity-90 transition-all duration-200 font-medium shadow text-sm text-center cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Defective Items */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Damaged or Wrong Product
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Important Note</h3>
                <p className="text-gray-700">
                  {returnsPolicy.defectiveItemsNote}
                </p>
              </div>
            </div>
          </section>

          {/* Refund Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Refund Information (Damaged/Wrong Only)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Processing Time</h3>
                <p className="text-gray-700 mb-3">
                  If approved for damaged/wrong item: <strong className="text-gray-800">{returnsPolicy.refundProcessingTime}</strong>.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#D97A22]">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> {returnsPolicy.refundNote}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Amount</h3>
                <p className="text-gray-700">
                  {returnsPolicy.refundAmountDescription}
                </p>
                <div className="mt-4 p-3 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white rounded-md text-center font-medium">
                  {returnsPolicy.refundAmountFormula}
                </div>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Exchange Policy
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700">
                {returnsPolicy.exchangePolicy}
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] mr-3 rounded-full"></div>
              Damaged or Wrong Product?
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6">
                We do not allow returns or refunds for any purchases. All sales are final. If the order is damaged or wrong product sent then contact us immediately.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-gray-700">
                    <span className="text-sm font-medium block mb-1">Email:</span>
                    <span className="text-sm">{contactEmail}</span>
                  </div>
                  <div className="text-gray-700">
                    <span className="text-sm font-medium block mb-1">Phone:</span>
                    <span className="text-sm">{contactNumber}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-4 py-3 rounded-md hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] transition-all duration-200 font-medium shadow hover:shadow-lg text-center text-sm cursor-pointer"
                  >
                    Report Damaged/Wrong Item
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Back Button */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white font-medium rounded-lg hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] transition-all duration-200 hover:shadow-lg text-sm cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}