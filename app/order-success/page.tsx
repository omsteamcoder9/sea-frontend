'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get orderId and clear cart
  useEffect(() => {
    if (!isClient) return;

    try {
      // Get orderId from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const orderIdParam = urlParams.get('orderId');
      
      if (orderIdParam) {
        setOrderId(orderIdParam);
      } else {
        setError('No order ID found in URL');
      }

      // Clear cart data (only if it exists)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('guestCart');
      }
    } catch (err) {
      console.error('Error processing order success:', err);
      setError('Failed to process order details');
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Countdown effect
  useEffect(() => {
    if (!orderId) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId]);

  // Separate effect for redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && orderId) {
      router.push('/');
    }
  }, [countdown, orderId, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FCFD] flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-md p-8 border border-[#B8DCE7]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008FB8] mx-auto mb-4"></div>
            <p className="text-[#315A6E]">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FCFD] flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-md p-8 border border-[#B8DCE7]">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-[#063B5C] mb-4">Something went wrong</h1>
            
            <p className="text-[#315A6E] mb-6">
              {error}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium text-center shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#064B6A' }}
              >
                Return to Home
              </Link>
              <Link 
                href="/cart"
                className="px-6 py-3 rounded-lg transition-all duration-200 font-medium text-center"
                style={{ border: '1px solid #008FB8', color: '#008FB8' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#008FB8';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#008FB8';
                }}
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  return (
    <div className="min-h-screen bg-[#F8FCFD] flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-md p-8 border border-[#B8DCE7]">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border" style={{ backgroundColor: '#008FB8/10', borderColor: '#008FB8/20' }}>
            <svg className="w-8 h-8" style={{ color: '#008FB8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-[#063B5C] mb-4">Order Placed Successfully!</h1>
          
          <p className="text-[#315A6E] mb-2">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <p className="text-[#315A6E] mb-6">
            Order ID: <span className="font-mono font-semibold text-[#063B5C]">#{orderId}</span>
          </p>

          <div className="space-y-4 mb-8">
            <div className="rounded-lg p-4" style={{ backgroundColor: '#008FB8/10', border: '1px solid #008FB8/20' }}>
              <p className="text-sm" style={{ color: '#008FB8' }}>
                You will receive an order confirmation email shortly with all the details.
              </p>
              <p className="text-[#315A6E] text-sm mt-2 font-medium">
                {countdown > 0 ? `Redirecting to home page in ${countdown} seconds...` : 'Redirecting now...'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium text-center shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#064B6A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#008FB8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#064B6A';
              }}
            >
              Continue Shopping
            </Link>
            <Link 
              href="/"
              className="px-6 py-3 rounded-lg transition-all duration-200 font-medium text-center"
              style={{ border: '1px solid #008FB8', color: '#008FB8' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#008FB8';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#008FB8';
              }}
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              Go to Home Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}