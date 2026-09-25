"use client";

import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export default function ContactPage() {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Sea Food';
  
  return (
    <div className="min-h-screen bg-white py-6 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#063B5C] mb-2 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#315A6E] max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Have questions about our premium MeenavanFresh including fresh fish, prawns, crabs, and daily catches? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 sm:mt-12 lg:mt-16 max-w-4xl mx-auto rounded-xl overflow-hidden" style={{ backgroundColor: '#064B6A', borderColor: '#176B8C', borderWidth: '1px' }}>
          <div className="p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center" style={{ color: '#FFFFFF' }}>
              Why Choose {storeName}?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 169, 224, 0.2)' }}>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#00A9E0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm sm:text-base" style={{ color: '#EAF8FC' }}>Premium Quality</h4>
                <p className="text-xs sm:text-sm px-2 sm:px-0" style={{ color: '#EAF8FC' }}>Fresh MeenavanFresh sourced daily from local fishermen for exceptional quality and taste</p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 169, 224, 0.2)' }}>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#00A9E0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm sm:text-base" style={{ color: '#EAF8FC' }}>100% Fresh</h4>
                <p className="text-xs sm:text-sm px-2 sm:px-0" style={{ color: '#EAF8FC' }}>Same-day delivery with ice packing to maintain peak freshness from harbour to home</p>
              </div>
              <div className="space-y-2 sm:space-y-3 sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 169, 224, 0.2)' }}>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#00A9E0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 5a1 1 0 011 1v3a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h4zM4 3a1 1 0 00-1 1v4a1 1 0 001 1h2M10 5h4a1 1 0 011 1v3a1 1 0 01-1 1h-4M6 11h4M4 15h16M6 15v4a1 1 0 001 1h10a1 1 0 001-1v-4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm sm:text-base" style={{ color: '#EAF8FC' }}>Quick Delivery</h4>
                <p className="text-xs sm:text-sm px-2 sm:px-0" style={{ color: '#EAF8FC' }}>Fast and reliable delivery across all major locations with proper cold chain management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}