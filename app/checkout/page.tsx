'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrder, getWards } from '@/lib/order-api';
import { createRazorpayOrder, verifyPayment } from '@/lib/payment-api';
import { Ward } from '@/types/order';

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
  prefill: { name: string; email: string; contact: string };
  notes: { orderId: string; address: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
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
  error: { code: string; description: string; source: string; step: string; reason: string };
}

interface FormData {
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  selectedWardId: number | null;
  selectedStreet: string;
}

interface PopupState {
  isOpen: boolean;
  type: 'error' | 'success' | 'info';
  title: string;
  message: string;
}

const getProductName = (product: any): string => {
  if (typeof product === 'string') return product;
  return product?.name || 'Product';
};

const getProductPrice = (item: any): number => {
  return item.price || 0;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'Tamil Nadu',
    postalCode: '',
    country: 'India',
    selectedWardId: null,
    selectedStreet: '',
  });

  const [wards, setWards] = useState<Ward[]>([]);
  const [streetsForSelectedWard, setStreetsForSelectedWard] = useState<string[]>([]);
  const [loadingWards, setLoadingWards] = useState(true);
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
    cashOnDeliveryEnabled: true,
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([]);
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
  const [isStreetFocused, setIsStreetFocused] = useState(false);
  const streetBoxRef = useRef<HTMLDivElement>(null);

  const [wardInput, setWardInput] = useState('');
  const [wardSuggestions, setWardSuggestions] = useState<Ward[]>([]);
  const [showWardSuggestions, setShowWardSuggestions] = useState(false);
  const [isWardFocused, setIsWardFocused] = useState(false);
  const wardBoxRef = useRef<HTMLDivElement>(null);

  const [buyNowItem, setBuyNowItem] = useState<any>(null);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
  };

  const showErrorPopup = (message: string) => {
    setPopup({ isOpen: true, type: 'error', title: 'Oops!', message });
  };

  const showSuccessPopup = (message: string) => {
    setPopup({ isOpen: true, type: 'success', title: 'Success!', message });
  };

  // ✅ Hard redirect to home (bypasses Next.js router cache)
  const hardRedirectHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    loadWards();
  }, []);

  const loadWards = async () => {
    try {
      setLoadingWards(true);
      const wardData = await getWards();
      setWards(wardData);
    } catch (error) {
      console.error('❌ Error loading wards:', error);
      showErrorPopup('Failed to load ward data. Please refresh the page.');
    } finally {
      setLoadingWards(false);
    }
  };

  useEffect(() => {
    if (formData.selectedWardId) {
      const streets = getStreetsForWard(formData.selectedWardId);
      setStreetsForSelectedWard(streets);
    } else {
      setStreetsForSelectedWard([]);
    }
  }, [formData.selectedWardId]);

  const getStreetsForWard = (wardId: number): string[] => {
    const ward = wards.find(w => w.wardId === wardId);
    return ward?.streets || [];
  };

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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('buyNow') === 'true') {
      const storedItem = sessionStorage.getItem('buyNowItem');
      if (storedItem) {
        setBuyNowItem(JSON.parse(storedItem));
        setIsBuyNowMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (user && !token) {
      setAuthError('Authentication token is missing. Please log in again.');
    } else {
      setAuthError('');
    }
  }, [user, token]);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setSettingsLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/api/settings/public`);
      const data = await response.json();
      if (data.success) {
        const settings = data.data;
        setPaymentSettings({
          razorpayEnabled: settings.razorpayEnabled,
          razorpayKeyId: settings.razorpayKeyId || '',
          cashOnDeliveryEnabled: settings.cashOnDeliveryEnabled,
        });
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (streetBoxRef.current && !streetBoxRef.current.contains(e.target as Node)) {
        setShowStreetSuggestions(false);
        setIsStreetFocused(false);
      }
      if (wardBoxRef.current && !wardBoxRef.current.contains(e.target as Node)) {
        setShowWardSuggestions(false);
        setIsWardFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWardInput(value);

    const term = value.trim().toLowerCase();
    if (!term) {
      setWardSuggestions([]);
      setShowWardSuggestions(false);
      return;
    }

    const matches = wards.filter(w =>
      w.wardName.toLowerCase().includes(term)
    ).slice(0, 10);

    setWardSuggestions(matches);
    setShowWardSuggestions(matches.length > 0);
  };

  const handleWardFocus = () => {
    setIsWardFocused(true);
    if (wardInput.trim() && wardSuggestions.length > 0) {
      setShowWardSuggestions(true);
    }
  };

  const handleWardSuggestionClick = (ward: Ward) => {
    setFormData(prev => ({
      ...prev,
      selectedWardId: ward.wardId,
      street: '',
      selectedStreet: '',
    }));
    setWardInput(ward.wardName);
    setShowWardSuggestions(false);
    setWardSuggestions([]);
    setIsWardFocused(false);
    setStreetSuggestions([]);
    setShowStreetSuggestions(false);
  };

  const handleClearWard = () => {
    setWardInput('');
    setFormData(prev => ({
      ...prev,
      selectedWardId: null,
      street: '',
      selectedStreet: '',
    }));
    setWardSuggestions([]);
    setShowWardSuggestions(false);
    setStreetSuggestions([]);
    setShowStreetSuggestions(false);
  };

  const handleStreetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, street: value, selectedStreet: '' }));

    const term = value.trim().toLowerCase();
    if (!term) {
      setStreetSuggestions([]);
      setShowStreetSuggestions(false);
      return;
    }

    const pool = formData.selectedWardId
      ? streetsForSelectedWard
      : wards.flatMap(w => w.streets);

    const matches = pool
      .filter(s => s.toLowerCase().includes(term))
      .slice(0, 10);

    setStreetSuggestions(matches);
    setShowStreetSuggestions(matches.length > 0);
  };

  const handleStreetFocus = () => {
    setIsStreetFocused(true);
    if (formData.street.trim() && streetSuggestions.length > 0) {
      setShowStreetSuggestions(true);
    }
  };

  const handleStreetSuggestionClick = (street: string) => {
    const ward = wards.find(w => w.streets.includes(street));
    setFormData(prev => ({
      ...prev,
      street,
      selectedStreet: street,
      selectedWardId: ward ? ward.wardId : prev.selectedWardId,
    }));
    if (ward) {
      setWardInput(ward.wardName);
    }
    setShowStreetSuggestions(false);
    setStreetSuggestions([]);
    setIsStreetFocused(false);
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getDisplayItems = () => {
    if (isBuyNowMode && buyNowItem) {
      return [{
        _id: 'buynow',
        product: buyNowItem.product,
        quantity: buyNowItem.quantity,
        selectedVariant: buyNowItem.selectedVariant,
        price: buyNowItem.price,
      }];
    }
    return cart.items;
  };

  const getSubtotal = () => {
    if (isBuyNowMode && buyNowItem) return buyNowItem.price * buyNowItem.quantity;
    return cart.totalPrice || 0;
  };

  const handleCashOnDelivery = async (): Promise<void> => {
    try {
      setLoading(true);
      setAuthError('');

      if (!formData.phone || !formData.street || !formData.city ||
          !formData.state || !formData.postalCode) {
        showErrorPopup('Please fill all the required fields before placing order.');
        setLoading(false);
        return;
      }

      const displayItems = getDisplayItems();
      if (!displayItems || displayItems.length === 0) {
        showErrorPopup('No items to checkout. Please add items to cart first.');
        setLoading(false);
        return;
      }

      const orderData: any = {
        shippingAddress: {
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: 'cod',
        typedArea: wardInput,
      };

      if (isBuyNowMode) {
        orderData.skipCartClear = true;
        orderData.products = displayItems.map((item: any) => ({
          product: item.product._id,
          variantId: item.selectedVariant?._id,
          variantName: item.selectedVariant?.variantName,
          price: item.price,
          quantity: item.quantity,
        }));
      }

      const result = await createOrder(orderData);

      if (isBuyNowMode) {
        sessionStorage.removeItem('buyNowItem');
      } else {
        clearCart();
      }

      showSuccessPopup(`Order placed successfully! Order ID: ${result.order.orderId}`);
      setTimeout(() => {
        window.location.href = `/order-success?orderId=${result.order.orderId}`;
      }, 2000);

    } catch (error: any) {
      // ✅ Cart empty → redirect home
      if (error.code === 'CART_EMPTY' || error.message === 'Cart is empty') {
        hardRedirectHome();
        return;
      }

      let errorMessage = 'Unable to place your order. Please try again.';
      if (error.code === 'STREET_NOT_FOUND') {
        errorMessage = 'We could not verify your street address. Please pick a suggestion or select a valid street.';
      } else if (error.code === 'DELIVERY_AREA_NOT_AVAILABLE') {
        errorMessage = 'Sorry, we currently deliver only to Karaikudi and surrounding areas. Please check your city.';
      } else if (error.code === 'INSUFFICIENT_STOCK') {
        errorMessage = 'Some items in your cart are out of stock. Please remove them and try again.';
      } else if (error.code === 'VARIANT_REQUIRED') {
        errorMessage = 'Please select a product variant before adding to cart.';
      } else if (error.code === 'MISSING_FIELD') {
        errorMessage = 'Please fill all required fields.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      showErrorPopup(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (): Promise<void> => {
    try {
      setPaymentLoading(true);
      setAuthError('');

      if (!paymentSettings.razorpayEnabled || !paymentSettings.razorpayKeyId) {
        showErrorPopup('Razorpay payment is not configured properly. Please use Cash on Delivery.');
        setPaymentLoading(false);
        return;
      }

      if (!formData.phone || !formData.street || !formData.city ||
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

      const displayItems = getDisplayItems();
      if (!displayItems || displayItems.length === 0) {
        showErrorPopup('No items to checkout. Please add items to cart first.');
        setPaymentLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showErrorPopup('Razorpay SDK failed to load. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      const orderData: any = {
        shippingAddress: {
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: 'razorpay',
        typedArea: wardInput,
      };

      if (isBuyNowMode) {
        orderData.skipCartClear = true;
        orderData.products = displayItems.map((item: any) => ({
          product: item.product._id,
          variantId: item.selectedVariant?._id,
          variantName: item.selectedVariant?.variantName,
          price: item.price,
          quantity: item.quantity,
        }));
      }

      const orderResult = await createOrder(orderData);
      const orderId = orderResult.order.orderId;

      const razorpayOrder = await createRazorpayOrder(orderId);

      const options: RazorpayOptions = {
        key: razorpayOrder.key || paymentSettings.razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Meenavan Fresh',
        description: 'Order Payment',
        image: '/logo2.png',
        order_id: razorpayOrder.id,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResult.success) {
              if (isBuyNowMode) sessionStorage.removeItem('buyNowItem');
              else clearCart();
              showSuccessPopup(`Payment successful! Order ID: ${orderId}`);
              setTimeout(() => {
                window.location.href = `/order-success?orderId=${orderId}`;
              }, 2000);
            } else {
              // ✅ Payment verification failed → redirect home
              hardRedirectHome();
            }
          } catch (error) {
            console.error('Verification error:', error);
            // ✅ Verification error → redirect home
            hardRedirectHome();
          }
          setPaymentLoading(false);
        },
        prefill: {
          name: user?.name || 'Customer',
          email: formData.email,
          contact: formData.phone,
        },
        notes: { orderId, address: formData.street },
        theme: { color: '#064B6A' },
        modal: {
          ondismiss: () => {
            console.log('🚪 Razorpay modal dismissed — redirecting home');
            setPaymentLoading(false);
            // ✅ ALWAYS redirect home on cancel
            hardRedirectHome();
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response: RazorpayErrorResponse) {
        console.error('❌ Payment failed:', response.error);
        setPaymentLoading(false);
        // ✅ ALWAYS redirect home on failure
        hardRedirectHome();
      });

      razorpay.open();

    } catch (error: any) {
      // ✅ Cart empty → redirect home
      if (error.code === 'CART_EMPTY' || error.message === 'Cart is empty') {
        hardRedirectHome();
        return;
      }

      console.error('Razorpay error:', error);
      let errorMessage = 'Payment initialization failed. Please try again or use Cash on Delivery.';
      if (error.code === 'STREET_NOT_FOUND') {
        errorMessage = 'We could not verify your street address. Please pick a suggestion or select a valid street.';
      } else if (error.code === 'DELIVERY_AREA_NOT_AVAILABLE') {
        errorMessage = 'Sorry, we currently deliver only to Karaikudi and surrounding areas. Please check your city.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      showErrorPopup(errorMessage);
      setPaymentLoading(false);
    }
  };

  const displayItems = getDisplayItems();
  const subtotal = getSubtotal();
  const tax = subtotal * 0.05;
  const shippingFee = 0;
  const total = subtotal + tax + shippingFee;

  if (settingsLoading || loadingWards) {
    return (
      <div className="min-h-screen bg-[#F8FCFD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008FB8] mx-auto mb-4"></div>
          <p className="text-[#315A6E]">{loadingWards ? 'Loading ward data...' : 'Loading payment methods...'}</p>
        </div>
      </div>
    );
  }

  const isAnyPaymentMethodAvailable = paymentSettings.razorpayEnabled || paymentSettings.cashOnDeliveryEnabled;

  if (!isAnyPaymentMethodAvailable) {
    return (
      <div className="min-h-screen bg-[#F8FCFD] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-4">
            <h2 className="text-xl font-semibold text-[#063B5C] mb-2">No Payment Methods Available</h2>
            <p className="text-[#315A6E] mb-4">All payment methods are currently disabled. Please contact the store administrator.</p>
            <button
              onClick={() => router.push('/cart')}
              className="px-6 py-3 text-white font-medium rounded-lg"
              style={{ backgroundColor: '#064B6A' }}
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
      {popup.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePopup} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className={`pt-8 pb-4 text-center ${popup.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-green-50 to-green-100'}`}>
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${popup.type === 'error' ? 'bg-red-500' : 'bg-green-500'} shadow-lg`}>
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
              <h3 className={`text-2xl font-bold mb-3 ${popup.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{popup.title}</h3>
              <p className="text-[#315A6E] text-base leading-relaxed">{popup.message}</p>
            </div>
            <div className="px-8 pb-8">
              <button
                onClick={closePopup}
                className={`w-full py-3 rounded-xl font-semibold text-white ${popup.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'} shadow-lg`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#F8FCFD] py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#063B5C]">Checkout</h1>
            {!user && !isBuyNowMode && (
              <div className="border px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm" style={{ backgroundColor: '#008FB8/10', borderColor: '#008FB8/20', color: '#008FB8' }}>
                <p>🛒 Shopping as Guest •{' '}<Link href="/signup" className="font-semibold underline" style={{ color: '#008FB8' }}>Create account for faster checkout</Link></p>
              </div>
            )}
            {isBuyNowMode && (
              <div className="border px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm" style={{ backgroundColor: '#008FB8/10', borderColor: '#008FB8/20', color: '#008FB8' }}>
                <p>⚡ Buy Now Mode • Checking out this item only</p>
              </div>
            )}
          </div>

          {authError && (
            <div className="mb-4 sm:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm sm:text-base">{authError}</span>
              </div>
              <div className="mt-2">
                <Link href="/login" className="text-red-600 underline font-semibold text-sm sm:text-base">Click here to log in again</Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 border border-[#B8DCE7]">
              <h2 className="text-lg sm:text-xl font-semibold text-[#063B5C] mb-4 sm:mb-6">Shipping Information</h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div ref={wardBoxRef} className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">
                    Area
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="off"
                      value={wardInput}
                      onChange={handleWardInputChange}
                      onFocus={handleWardFocus}
                      className="w-full px-3 py-2 pr-9 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
                      placeholder="Type your area"
                    />
                    {wardInput && (
                      <button
                        type="button"
                        onClick={handleClearWard}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                        aria-label="Clear area"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {isWardFocused && showWardSuggestions && wardSuggestions.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#B8DCE7] rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {wardSuggestions.map((ward) => (
                        <button
                          key={ward.wardId}
                          type="button"
                          onClick={() => handleWardSuggestionClick(ward)}
                          className="w-full text-left px-3 py-2 text-sm text-[#063B5C] hover:bg-[#008FB8]/10 border-b border-[#B8DCE7] last:border-b-0"
                        >
                          {ward.wardName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div ref={streetBoxRef} className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    autoComplete="off"
                    value={formData.street}
                    onChange={handleStreetInputChange}
                    onFocus={handleStreetFocus}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
                    placeholder="Type your street"
                  />

                  {isStreetFocused && showStreetSuggestions && streetSuggestions.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#B8DCE7] rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {streetSuggestions.map((street, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleStreetSuggestionClick(street)}
                          className="w-full text-left px-3 py-2 text-sm text-[#063B5C] hover:bg-[#008FB8]/10 border-b border-[#B8DCE7] last:border-b-0"
                        >
                          {street}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
                      placeholder="Postal Code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#315A6E] mb-1">Country *</label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-[#B8DCE7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#008FB8]"
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

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 border border-[#B8DCE7]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#063B5C] mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {displayItems.map((item: any) => (
                    <div key={item._id} className="flex justify-between items-center border-b border-[#B8DCE7] pb-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#063B5C]">{getProductName(item.product)}</p>
                        {item.selectedVariant && (
                          <p className="text-xs font-medium" style={{ color: '#008FB8' }}>
                            📦 Pack: {item.selectedVariant.variantName || item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-xs text-[#315A6E]">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-[#063B5C]">
                        ₹{(getProductPrice(item) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="">
                  <div className="flex justify-between text-sm sm:text-base text-[#315A6E]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-[#315A6E]">
                    <span>Shipping</span>
                    <span className="font-medium" style={{ color: '#008FB8' }}>FREE</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-[#315A6E]">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-semibold border-t border-[#B8DCE7] pt-2 text-[#063B5C]">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 border border-[#B8DCE7]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#063B5C] mb-4">Payment Method</h2>

                <div className="space-y-4">
                  {paymentSettings.razorpayEnabled && (
                    <button
                      onClick={handleRazorpayPayment}
                      disabled={paymentLoading || loading || !!authError || !paymentSettings.razorpayKeyId}
                      className="w-full text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg text-sm sm:text-base cursor-pointer"
                      style={{ backgroundColor: '#064B6A' }}
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
                      className="w-full py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base cursor-pointer"
                      style={{ border: '1px solid #008FB8', color: '#008FB8' }}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-[#008FB8] mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Cash On Delivery'
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#008FB8/10', border: '1px solid #008FB8/20' }}>
                  {user ? (
                    <div className="flex items-center space-x-2" style={{ color: '#008FB8' }}>
                      <span className="text-xs sm:text-sm">Logged in as {user.phoneNumber}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2" style={{ color: '#008FB8' }}>
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