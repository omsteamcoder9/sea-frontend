import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export default function ContactPage() {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'FarmTools Pro';
  
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Have questions about our premium farm tools including mini hand sickles, curved harvesting knives, and traditional coconut scrapers (Thengai Thuruvi)? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-[#D97A22]/5 via-[#D97A22]/5 to-[#D97A22]/5 p-8 rounded-xl border border-[#D97A22]/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why Choose {storeName}?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D97A22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Premium Quality</h4>
              <p className="text-gray-600 text-sm">Hand-forged tools made from premium quality steel for exceptional durability and performance</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D97A22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">100% Durable</h4>
              <p className="text-gray-600 text-sm">Rust-resistant, long-lasting tools built to withstand daily farm and kitchen use</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D97A22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 5a1 1 0 011 1v3a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h4zM4 3a1 1 0 00-1 1v4a1 1 0 001 1h2M10 5h4a1 1 0 011 1v3a1 1 0 01-1 1h-4M6 11h4M4 15h16M6 15v4a1 1 0 001 1h10a1 1 0 001-1v-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Ergonomic Design</h4>
              <p className="text-gray-600 text-sm">Comfortable grip handles designed for fatigue-free use during long hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}