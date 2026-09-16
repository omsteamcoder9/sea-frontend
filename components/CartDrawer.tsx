'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/otpAuth';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to safely get product name
const getProductName = (item: any): string => {
  if (typeof item.product === 'object' && item.product !== null) {
    return item.product.name || 'Unnamed Product';
  }
  return item.productName || 'Product';
};

const getProductImage = (item: any): string | null => {
  if (item.productImage) {
    const baseUrl = process.env.NEXT_PUBLIC_IMG_URL || '';
    const cleanPath = item.productImage.replace('/uploads/', '');
    return `${baseUrl}/${cleanPath}`;
  }
  return null;
};

// ✅ ADD WEIGHT DISPLAY HELPER
const getWeightDisplay = (item: any): string | null => {
  const weight = item.weight || item.selectedVariant?.weight;
  const weightUnit = item.weightUnit || item.selectedVariant?.weightUnit || 'gram';
  
  if (weight && weight > 0) {
    return `${weight} ${weightUnit}`;
  }
  return null;
};

// Helper function to get max stock
const getItemMaxStock = (item: any): number => {
  if (item.product?.stock !== undefined) {
    return item.product.stock;
  }
  return 999;
};

// Helper function to get variant display name
const getVariantDisplayName = (item: any): string | null => {
  if (item.variantName) {
    return item.variantName;
  }
  if (item.selectedVariant?.variantName) {
    return item.selectedVariant.variantName;
  }
  if (item.selectedVariant?.name) {
    return item.selectedVariant.name;
  }
  return null;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateCartItem, removeFromCart, clearCart, isGuest } = useCart();
  const router = useRouter();
  const [removingItems, setRemovingItems] = useState<string[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    const isLoggedIn = isAuthenticated();
    
    if (isLoggedIn) {
      onClose();
      router.push('/checkout');
    } else {
      onClose();
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      sessionStorage.setItem('pendingCheckout', 'true');
      router.push('/signup');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => [...prev, itemId]);
    try {
      await removeFromCart(itemId);
    } finally {
      setRemovingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleClearCart = async () => {
    if (isClearing) return;
    try {
      setIsClearing(true);
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const itemCount = cart.totalItems || 0;
  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        flex flex-col rounded-l-3xl overflow-hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#B8DCE7]/50 bg-white">
            <h2 className="text-lg font-bold text-[#063B5C] flex items-center gap-2">
              Your Cart 
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAF8FC] text-[#008FB8] font-semibold">
                {itemCount}
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#315A6E] hover:text-[#063B5C] hover:bg-[#EAF8FC] rounded-xl transition-all cursor-pointer"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Guest Warning */}
          {isGuest && (
            <div className="border-b px-6 py-2 text-xs flex items-center justify-between" style={{ backgroundColor: '#008FB815', borderColor: '#008FB830', color: '#008FB8' }}>
              <p className="font-medium">
                🛒 Browsing as Guest
              </p>
              <Link href="/signup" className="font-bold underline hover:opacity-80" style={{ color: '#008FB8' }}>
                Sign up to save
              </Link>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3">
          {!cart.items || cart.items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 bg-[#EAF8FC] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-[#008FB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[#063B5C] font-semibold text-base mb-1">Your cart is empty</p>
              <p className="text-[#315A6E]/70 text-xs mb-6">Looks like you haven't added anything to your cart yet.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer text-white shadow-sm"
                style={{ backgroundColor: '#064B6A' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.slice(0, 4).map((item) => {
                const imageUrl = getProductImage(item);
                const productName = getProductName(item);
                const variantName = getVariantDisplayName(item);
                const weightDisplay = getWeightDisplay(item);
                const maxStock = getItemMaxStock(item);
                const isRemoving = removingItems.includes(item._id);
                
                return (
                  <div key={item._id} className="p-3 bg-white border border-[#B8DCE7]/60 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-[#F8FCFD] rounded-xl flex-shrink-0 overflow-hidden relative border border-[#B8DCE7]/30">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={productName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#315A6E]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-semibold text-xs text-[#063B5C] line-clamp-2 flex-1">
                            {productName}
                          </h3>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={isRemoving}
                            className="text-[#315A6E]/50 hover:text-red-600 disabled:opacity-50 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Variant info */}
                        {variantName && (
                          <p className="text-[#008FB8] text-[10px] font-semibold mt-0.5">
                            {variantName}
                          </p>
                        )}
                        
                        {/* ✅ WEIGHT DISPLAY */}
                        {weightDisplay && (
                          <p className="text-[#315A6E]/70 text-[10px] mt-0.5">
                            ⚖️ {weightDisplay}
                          </p>
                        )}
                        
                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[#063B5C] text-xs font-bold">₹{item.price || 0}</p>
                          
                          <div className="flex items-center border border-[#B8DCE7] rounded-lg overflow-hidden bg-[#F8FCFD]">
                            <button 
                              onClick={() => updateCartItem(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isRemoving}
                              className="w-7 h-6 flex items-center justify-center text-[#315A6E] hover:text-[#008FB8] hover:bg-[#EAF8FC] disabled:opacity-30 text-sm cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-[#063B5C]">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartItem(item._id, item.quantity + 1)}
                              disabled={item.quantity >= maxStock || isRemoving}
                              className="w-7 h-6 flex items-center justify-center text-[#315A6E] hover:text-[#008FB8] hover:bg-[#EAF8FC] disabled:opacity-30 text-sm cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Show remaining items count if more than 4 */}
              {cart.items.length > 4 && (
                <div className="text-center py-2">
                  <p className="text-xs font-medium text-[#315A6E]/80 bg-[#EAF8FC] py-1.5 px-3 rounded-xl inline-block">
                    +{cart.items.length - 4} more item{cart.items.length - 4 > 1 ? 's' : ''} in cart
                  </p>
                </div>
              )}

              {/* Clear Cart Link */}
              {cart.items.length > 0 && (
                <div className="text-right pt-2 px-1">
                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50 font-semibold transition-colors cursor-pointer underline"
                  >
                    {isClearing ? 'Clearing...' : 'Clear entire cart'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with totals and actions */}
        {cart.items && cart.items.length > 0 && (
          <div className="flex-shrink-0 border-t border-[#B8DCE7]/50 bg-white p-4 shadow-lg rounded-t-3xl">
            {/* Order Summary */}
            <div className="space-y-1.5 mb-3 bg-[#F8FCFD] p-3 rounded-2xl border border-[#B8DCE7]/40">
              <div className="flex justify-between text-xs">
                <span className="text-[#315A6E]">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="text-[#063B5C] font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#315A6E]">Shipping</span>
                <span className="font-bold" style={{ color: '#008FB8' }}>FREE</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#315A6E]">Tax (5%)</span>
                <span className="text-[#063B5C] font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#B8DCE7]/60 mt-1">
                <span className="text-[#063B5C]">Total Amount</span>
                <span className="text-[#063B5C]">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl font-bold text-xs transition-all duration-200 shadow-md text-white cursor-pointer hover:shadow-lg"
                style={{ backgroundColor: '#064B6A' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#008FB8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#064B6A';
                }}
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-[#315A6E] hover:text-[#063B5C] hover:bg-[#EAF8FC] rounded-xl font-medium transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}