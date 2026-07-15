'use client';
import { useEffect, useState } from 'react';
import { settingsAPI } from '@/lib/settings-api';

// Define the contact info type
interface ContactInfo {
  contactNumber: string;
  contactEmail: string;
  companyAddress: string;
}

export default function ContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    contactNumber: '+91 7200074221',
    contactEmail: 'support@MeenavanFresh.com',
    companyAddress: '123 MeenavanFresh Street, Mumbai, India'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getPublicSettings();
        if (response.success && response.data) {
          const data = response.data;
          setContactInfo({
            contactNumber: data.contactNumber || '+91 7200074221',
            contactEmail: data.contactEmail || 'support@MeenavanFresh.com',
            companyAddress: data.companyAddress || '123 MeenavanFresh Street, Mumbai, India'
          });
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
        setError('Failed to load contact information. Using default values.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      details: contactInfo.contactEmail,
      description: 'Send us an email anytime',
      action: `mailto:${contactInfo.contactEmail}`
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      details: contactInfo.contactNumber,
      description: 'Mon-Fri from 9am to 6pm',
      action: `tel:${contactInfo.contactNumber.replace(/\s/g, '')}`
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Address',
      details: contactInfo.companyAddress,
      description: 'Visit our store',
      action: `https://maps.google.com/?q=${encodeURIComponent(contactInfo.companyAddress)}`
    }
  ];

  if (loading) {
    return (
      <div className="rounded-lg p-8 border" style={{ borderColor: '#9B0F06' }}>
        <div className="animate-pulse">
          <div className="h-8 rounded w-48 mb-6" style={{ backgroundColor: 'rgba(155, 15, 6, 0.1)' }}></div>
          <div className="space-y-6">
            <div className="h-24 rounded" style={{ backgroundColor: 'rgba(155, 15, 6, 0.05)' }}></div>
            <div className="h-24 rounded" style={{ backgroundColor: 'rgba(155, 15, 6, 0.05)' }}></div>
            <div className="h-24 rounded" style={{ backgroundColor: 'rgba(155, 15, 6, 0.05)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-8 border" style={{ borderColor: '#9B0F06' }}>
      <h3 className="text-2xl font-bold mb-6" style={{ color: '#5E0006' }}>Contact Information</h3>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(155, 15, 6, 0.1)', border: '1px solid #9B0F06', color: '#5E0006' }}>
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Email Contact */}
        <a 
          href={contactMethods[0].action}
          className="block group cursor-pointer transition-all duration-200 hover:shadow-lg"
        >
          <div 
            className="flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 hover:border-[#9B0F06]"
            style={{ borderColor: 'rgba(155, 15, 6, 0.2)' }}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: 'rgba(155, 15, 6, 0.1)', color: '#9B0F06' }}>
              {contactMethods[0].icon}
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: '#9B0F06' }}>{contactMethods[0].title}</h4>
              <p className="font-medium text-gray-800">{contactMethods[0].details}</p>
              <p className="text-sm text-gray-600">{contactMethods[0].description}</p>
            </div>
          </div>
        </a>

        {/* Phone Contact */}
        <a 
          href={contactMethods[1].action}
          className="block group cursor-pointer transition-all duration-200 hover:shadow-lg"
        >
          <div 
            className="flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 hover:border-[#9B0F06]"
            style={{ borderColor: 'rgba(155, 15, 6, 0.2)' }}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: 'rgba(155, 15, 6, 0.1)', color: '#9B0F06' }}>
              {contactMethods[1].icon}
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: '#9B0F06' }}>{contactMethods[1].title}</h4>
              <p className="font-medium text-gray-800">{contactMethods[1].details}</p>
              <p className="text-sm text-gray-600">{contactMethods[1].description}</p>
            </div>
          </div>
        </a>

        {/* Address Contact */}
        <a 
          href={contactMethods[2].action}
          className="block group cursor-pointer transition-all duration-200 hover:shadow-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div 
            className="flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 hover:border-[#9B0F06]"
            style={{ borderColor: 'rgba(155, 15, 6, 0.2)' }}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: 'rgba(155, 15, 6, 0.1)', color: '#9B0F06' }}>
              {contactMethods[2].icon}
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: '#9B0F06' }}>{contactMethods[2].title}</h4>
              <p className="font-medium text-gray-800">{contactMethods[2].details}</p>
              <p className="text-sm text-gray-600">{contactMethods[2].description}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}