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

  // Fix hydration by ensuring this only runs on client
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
      // Validate required fields
      if (!formData.subject.trim()) {
        throw new Error('Subject is required');
      }
      if (!formData.message.trim()) {
        throw new Error('Message is required');
      }

      // Optional: Validate email format if provided
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Submit to backend
      const response = await contactApi.submitContact(formData);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Thank you for your message! We will get back to you soon.'
        });
        // Reset form on success
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

  // Don't render form until mounted on client
  if (!isMounted) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-lg border" style={{ borderColor: '#9B0F06' }}>
        <div className="animate-pulse">
          <div className="h-8 rounded mb-6" style={{ backgroundColor: 'rgba(155, 15, 6, 0.1)' }}></div>
          <div className="space-y-4">
            <div className="h-4 rounded" style={{ backgroundColor: 'rgba(155, 15, 6, 0.05)' }}></div>
            <div className="h-4 rounded" style={{ backgroundColor: 'rgba(155, 15, 6, 0.05)' }}></div>
            <div className="h-24 rounded" style={{ backgroundColor: 'rgba(155, 15, 6, 0.05)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg border" style={{ borderColor: '#9B0F06' }}>
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#5E0006' }}>Get In Touch</h2>
      
      {message && (
        <div
          className={`p-4 mb-6 rounded-lg border cursor-pointer transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
          onClick={() => setMessage(null)}
          role="alert"
        >
          <div className="flex items-center justify-between">
            <span>{message.text}</span>
            <button 
              onClick={() => setMessage(null)}
              className="ml-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#5E0006' }}>
              Full Name <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
              style={{ backgroundColor: 'white', borderColor: 'rgba(155, 15, 6, 0.2)' }}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#5E0006' }}>
              Email Address <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
              style={{ backgroundColor: 'white', borderColor: 'rgba(155, 15, 6, 0.2)' }}
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#5E0006' }}>
            Phone Number <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
            style={{ backgroundColor: 'white', borderColor: 'rgba(155, 15, 6, 0.2)' }}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#5E0006' }}>
            Subject <span style={{ color: '#D53E0F' }}>*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
            style={{ backgroundColor: 'white', borderColor: 'rgba(155, 15, 6, 0.2)' }}
            placeholder="What is this regarding?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#5E0006' }}>
            Message <span style={{ color: '#D53E0F' }}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200 resize-vertical"
            style={{ backgroundColor: 'white', borderColor: 'rgba(155, 15, 6, 0.2)' }}
            placeholder="Tell us how we can help you..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#9B0F06', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5E0006'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9B0F06'}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
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