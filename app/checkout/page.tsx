'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrder } from '@/lib/order-api';
import { createRazorpayOrder, verifyPayment } from '@/lib/payment-api';
import { CreateOrderRequest } from '@/types/order';

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void> | void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    orderId: string;
    address: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', handler: (response: RazorpayErrorResponse) => void) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

// ✅ ADDED email to FormData
interface FormData {
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PublicSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  cashOnDeliveryEnabled: boolean;
}

interface PopupState {
  isOpen: boolean;
  type: 'error' | 'success' | 'info';
  title: string;
  message: string;
}

// Helper to get product name safely
const getProductName = (product: any): string => {
  if (typeof product === 'string') return product;
  return product?.name || 'Product';
};

// Helper to get product price safely
const getProductPrice = (item: any): number => {
  return item.price || 0;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  // ✅ ADDED email to initial state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: false,
    razorpayKeyId: '',
    cashOnDeliveryEnabled: true
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Close popup
  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
  };

  // Show error popup
  const showErrorPopup = (message: string) => {
    setPopup({
      isOpen: true,
      type: 'error',
      title: 'Oops!',
      message,
    });
  };

  // Show success popup
  const showSuccessPopup = (message: string) => {
    setPopup({
      isOpen: true,
      type: 'success',
      title: 'Success!',
      message,
    });
  };

  // Auto-fill phone and email if user is logged in
  useEffect(() => {
    if (user) {
      if (user.phoneNumber && !formData.phone) {
        setFormData(prev => ({ ...prev, phone: user.phoneNumber || '' }));
      }
      if (user.email && !formData.email) {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    }
  }, [user, formData.phone, formData.email]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !settingsLoading) {
      router.push('/cart');
    }
  }, [cart.items.length, router, settingsLoading]);

  // Check authentication status
  useEffect(() => {
    if (user && !token) {
      setAuthError('Authentication token is missing. Please log in again.');
    } else {
      setAuthError('');
    }
  }, [user, token]);

  // Fetch public settings
  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setSettingsLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/api/settings/public`);
      const data = await response.json();
      
      console.log('🔍 Settings response:', data);
      
      if (data.success) {
        const settings = data.data;
        setPaymentSettings({
          razorpayEnabled: settings.razorpayEnabled,
          razorpayKeyId: settings.razorpayKeyId || '',
          cashOnDeliveryEnabled: settings.cashOnDeliveryEnabled
        });
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Cash on Delivery handler - ✅ ADDED email validation
  const handleCashOnDelivery = async (): Promise<void> => {
    try {
      setLoading(true);
      setAuthError('');

      if (!formData.email || !formData.phone || !formData.street || !formData.city || 
          !formData.state || !formData.postalCode) {
        showErrorPopup('Please fill all the required fields before placing order.');
        setLoading(false);
        return;
      }

      if (!cart.items || cart.items.length === 0) {
        showErrorPopup('Your cart is empty. Please add items to cart first.');
        router.push('/cart');
        setLoading(false);
        return;
      }

      // ✅ ADDED email to shippingAddress
      const orderData: CreateOrderRequest = {
        shippingAddress: {
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: 'cod'
      };

      const result = await createOrder(orderData);
      
      clearCart();

      showSuccessPopup(`Order placed successfully! Order ID: ${result.order.orderId}`);
      setTimeout(() => {
        window.location.href = `/order-success?orderId=${result.order.orderId}`;
      }, 2000);
      
    } catch (error: any) {
      let errorMessage = 'Unable to place your order. Please try again.';
      
      if (error.code === 'STREET_NOT_FOUND') {
        errorMessage = 'We could not verify your street address. Please enter a valid street name in Karaikudi.';
      } 
      else if (error.code === 'DELIVERY_AREA_NOT_AVAILABLE') {
        errorMessage = 'Sorry, we currently deliver only to Karaikudi and surrounding areas. Please check your city.';
      }
      else if (error.code === 'CART_EMPTY') {
        errorMessage = 'Your cart is empty. Please add items to cart before checkout.';
      }
      else if (error.code === 'INSUFFICIENT_STOCK') {
        errorMessage = 'Some items in your cart are out of stock. Please remove them and try again.';
      }
      else if (error.code === 'VARIANT_REQUIRED') {
        errorMessage = 'Please select a product variant before adding to cart.';
      }
      else if (error.code === 'MISSING_FIELD') {
        errorMessage = 'Please fill all required fields.';
      }
      else if (error.message) {
        errorMessage = error.message;
      }
      
      showErrorPopup(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Razorpay handler - ✅ ADDED email validation
  const handleRazorpayPayment = async (): Promise<void> => {
    try {
      setPaymentLoading(true);
      setAuthError('');

      if (!paymentSettings.razorpayEnabled || !paymentSettings.razorpayKeyId) {
        showErrorPopup('Razorpay payment is not configured properly. Please use Cash on Delivery.');
        setPaymentLoading(false);
        return;
      }

      if (!formData.email || !formData.phone || !formData.street || !formData.city || 
          !formData.state || !formData.postalCode) {
        showErrorPopup('Please fill all the required fields before proceeding to payment.');
        setPaymentLoading(false);
        return;
      }

      if (user && !token) {
        setAuthError('Your session has expired. Please log in again.');
        showErrorPopup('Your session has expired. Please log in again.');
        setPaymentLoading(false);
        return;
      }

      // Step 1: Create order in database - ✅ ADDED email
      const orderData: CreateOrderRequest = {
        shippingAddress: {
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: 'razorpay'
      };

      console.log('Creating order for Razorpay:', orderData);
      const orderResult = await createOrder(orderData);
      const orderId = orderResult.order.orderId;
      const finalAmount = orderResult.order.finalAmount;

      console.log('Order created:', orderId, 'Amount:', finalAmount);

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showErrorPopup('Razorpay SDK failed to load. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      // Step 3: Create Razorpay order using the API
      const razorpayOrder = await createRazorpayOrder(orderId);
      
      console.log('Razorpay order created:', razorpayOrder);

      // Step 4: Open Razorpay checkout - ✅ Use actual email from form
      const options: RazorpayOptions = {
        key: razorpayOrder.key || paymentSettings.razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Beauty Care',
        description: 'Order Payment',
        image: '/logo2.png',
        order_id: razorpayOrder.id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Step 5: Verify payment
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResult.success) {
              clearCart();
              showSuccessPopup(`Payment successful! Order ID: ${orderId}`);
              setTimeout(() => {
                window.location.href = `/order-success?orderId=${orderId}`;
              }, 2000);
            } else {
              showErrorPopup(verifyResult.message || 'Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            showErrorPopup('Payment verification failed. Please contact support.');
          }
          setPaymentLoading(false);
        },
        prefill: {
          name: user?.name || 'Customer',
          email: formData.email,  // ✅ Use actual email from form
          contact: formData.phone,
        },
        notes: {
          orderId: orderId,
          address: formData.street,
        },
        theme: {
          color: '#9B0F06',
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            showErrorPopup('Payment cancelled. You can try again or use Cash on Delivery.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: RazorpayErrorResponse) {
        console.error('Payment failed:', response.error);
        showErrorPopup(`Payment failed: ${response.error.description || 'Please try again.'}`);
        setPaymentLoading(false);
      });

      razorpay.open();

    } catch (error: any) {
      console.error('Razorpay error:', error);
      
      let errorMessage = 'Payment initialization failed. Please try again or use Cash on Delivery.';
      
      if (error.code === 'STREET_NOT_FOUND') {
        errorMessage = 'We could not verify your street address. Please enter a valid street name in Karaikudi.';
      } 
      else if (error.code === 'DELIVERY_AREA_NOT_AVAILABLE') {
        errorMessage = 'Sorry, we currently deliver only to Karaikudi and surrounding areas. Please check your city.';
      }
      else if (error.message) {
        errorMessage = error.message;
      }
      
      showErrorPopup(errorMessage);
      setPaymentLoading(false);
    }
  };

  const tax = (cart.totalPrice || 0) * 0.05;
  const shippingFee = 0;
  const total = (cart.totalPrice || 0) + tax + shippingFee;

  if (cart.items.length === 0 || settingsLoading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B0F06] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  const isAnyPaymentMethodAvailable = paymentSettings.razorpayEnabled || paymentSettings.cashOnDeliveryEnabled;

  if (!isAnyPaymentMethodAvailable) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-4">
            <svg className="w-16 h-16 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Payment Methods Available</h2>
            <p className="text-gray-600 mb-4">All payment methods are currently disabled. Please contact the store administrator.</p>
            <button
              onClick={() => router.push('/cart')}
              className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-200"
              style={{ backgroundColor: '#9B0F06' }}
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Attractive Custom Popup Modal */}
      {popup.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closePopup}
          />
          
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in">
            <div className={`relative pt-8 pb-4 text-center ${popup.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-green-50 to-green-100'}`}>
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${popup.type === 'error' ? 'bg-red-500' : 'bg-green-500'} shadow-lg transform transition-transform duration-300 animate-bounce`}>
                {popup.type === 'error' ? (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="px-8 pt-4 pb-6 text-center">
              <h3 className={`text-2xl font-bold mb-3 ${popup.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {popup.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {popup.message}
              </p>
            </div>
            
            <div className="px-8 pb-8">
              <button
                onClick={closePopup}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  popup.type === 'error'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                } shadow-lg`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#f2f2f2] py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#5E0006]">Checkout</h1>
            {!user && (
              <div className="border px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm" style={{ backgroundColor: '#9B0F06/10', borderColor: '#9B0F06/20', color: '#9B0F06' }}>
                <p>
                  🛒 Shopping as Guest •{' '}
                  <Link href="/signup" className="font-semibold underline hover:opacity-80 transition-colors duration-200" style={{ color: '#9B0F06' }}>
                    Create account for faster checkout
                  </Link>
                </p>
              </div>
            )}
          </div>

          {authError && (
            <div className="mb-4 sm:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base">{authError}</span>
              </div>
              <div className="mt-2">
                <Link href="/login" className="text-red-600 underline font-semibold hover:text-red-700 transition-colors duration-200 text-sm sm:text-base">
                  Click here to log in again
                </Link>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold text-[#5E0006] mb-4 sm:mb-6">
                Shipping Information
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {/* ✅ ADDED EMAIL FIELD */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <textarea
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
                      placeholder="Postal Code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B0F06] focus:border-[#9B0F06] transition-all duration-200"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-300">
                <h2 className="text-lg sm:text-xl font-semibold text-[#5E0006] mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{getProductName(item.product)}</p>
                        {item.selectedVariant && (
                          <p className="text-xs font-medium" style={{ color: '#D53E0F' }}>📦 Pack: {item.selectedVariant.variantName || item.selectedVariant.name}</p>
                        )}
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base">₹{(getProductPrice(item) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>₹{(cart.totalPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="font-medium" style={{ color: '#D53E0F' }}>FREE</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span className="text-gray-800">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-300">
                <h2 className="text-lg sm:text-xl font-semibold text-[#5E0006] mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  {paymentSettings.razorpayEnabled && (
                    <button
                      onClick={handleRazorpayPayment}
                      disabled={paymentLoading || loading || !!authError || !paymentSettings.razorpayKeyId}
                      className="w-full text-white py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg text-sm sm:text-base cursor-pointer"
                      style={{ backgroundColor: '#9B0F06' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#5E0006';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#9B0F06';
                      }}
                    >
                      {paymentLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : !paymentSettings.razorpayKeyId ? (
                        'Razorpay Configuration Required'
                      ) : (
                        `Pay ₹${total.toFixed(2)}`
                      )}
                    </button>
                  )}

                  {paymentSettings.cashOnDeliveryEnabled && (
                    <button
                      onClick={handleCashOnDelivery}
                      disabled={loading || paymentLoading || !!authError}
                      className="w-full py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base cursor-pointer"
                      style={{ border: '1px solid #9B0F06', color: '#9B0F06' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9B0F06';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#9B0F06';
                      }}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-[#9B0F06] mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Cash On Delivery'
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#9B0F06/10', border: '1px solid #9B0F06/20' }}>
                  {user ? (
                    <div className="flex items-center space-x-2" style={{ color: '#9B0F06' }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs sm:text-sm">Logged in as {user.phoneNumber}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2" style={{ color: '#9B0F06' }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs sm:text-sm">Checking out as guest</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}