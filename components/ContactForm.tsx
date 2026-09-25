'use client';

import { useState, useEffect } from 'react';
import { ContactFormData } from '@/types/contact';
import { contactApi } from '@/lib/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!formData.subject.trim()) {
        throw new Error('Subject is required');
      }
      if (!formData.message.trim()) {
        throw new Error('Message is required');
      }

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await contactApi.submitContact(formData);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Thank you for your message! We will get back to you soon.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full p-4 sm:p-6 md:p-8 rounded-2xl bg-white shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 rounded mb-4 sm:mb-6" style={{ backgroundColor: 'rgba(0, 143, 184, 0.1)' }}></div>
          <div className="space-y-3 sm:space-y-4">
            <div className="h-4 rounded" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}></div>
            <div className="h-4 rounded" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}></div>
            <div className="h-20 sm:h-24 rounded" style={{ backgroundColor: 'rgba(0, 143, 184, 0.05)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 rounded-2xl bg-white shadow-lg">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center" style={{ color: '#063B5C' }}>Get In Touch</h2>
      
      {message && (
        <div
          className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg border cursor-pointer transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
          onClick={() => setMessage(null)}
          role="alert"
        >
          <div className="flex items-start sm:items-center justify-between gap-2">
            <span className="text-xs sm:text-sm md:text-base break-words">{message.text}</span>
            <button 
              onClick={() => setMessage(null)}
              className="ml-2 flex-shrink-0 text-[#315A6E] hover:text-[#063B5C] text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#063B5C' }}>
              Full Name <span className="text-[#315A6E]/60 text-[10px] sm:text-xs">(optional)</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008FB8] focus:border-[#008FB8] transition-all duration-200"
              style={{ backgroundColor: 'white', borderColor: 'rgba(0, 143, 184, 0.2)' }}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#063B5C' }}>
              Email Address <span className="text-[#315A6E]/60 text-[10px] sm:text-xs">(optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008FB8] focus:border-[#008FB8] transition-all duration-200"
              style={{ backgroundColor: 'white', borderColor: 'rgba(0, 143, 184, 0.2)' }}
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#063B5C' }}>
            Phone Number <span className="text-[#315A6E]/60 text-[10px] sm:text-xs">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008FB8] focus:border-[#008FB8] transition-all duration-200"
            style={{ backgroundColor: 'white', borderColor: 'rgba(0, 143, 184, 0.2)' }}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#063B5C' }}>
            Subject <span style={{ color: '#00A9E0' }}>*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008FB8] focus:border-[#008FB8] transition-all duration-200"
            style={{ backgroundColor: 'white', borderColor: 'rgba(0, 143, 184, 0.2)' }}
            placeholder="What is this regarding?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#063B5C' }}>
            Message <span style={{ color: '#00A9E0' }}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008FB8] focus:border-[#008FB8] transition-all duration-200 resize-vertical"
            style={{ backgroundColor: 'white', borderColor: 'rgba(0, 143, 184, 0.2)' }}
            placeholder="Tell us how we can help you..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#064B6A', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008FB8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#064B6A'}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}