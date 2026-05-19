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
      router.push('/login');
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

  const itemCount = cart.totalItems || 0;
  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-[#5E0006]">
              Cart ({itemCount})
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Guest Warning */}
          {isGuest && (
            <div className="border-b px-4 py-1 text-xs" style={{ backgroundColor: '#9B0F06/10', borderColor: '#9B0F06/20', color: '#9B0F06' }}>
              <p>
                🛒 Guest •{' '}
                <Link href="/signup" className="font-semibold underline hover:opacity-80" style={{ color: '#9B0F06' }}>
                  Sign up to save
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3">
            {!cart.items || cart.items.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="font-medium transition-colors cursor-pointer" style={{ color: '#9B0F06' }}
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
                    <div key={item._id} className="border-b border-gray-100 pb-3">
                      <div className="flex gap-2.5">
                        {/* Product Image */}
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={productName}
                              fill
                              sizes="56px"
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-medium text-xs text-gray-900 line-clamp-2 flex-1">
                              {productName}
                            </h3>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={isRemoving}
                              className="text-gray-400 hover:text-red-600 disabled:opacity-50 -mt-1 -mr-1 p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Variant info */}
                          {variantName && (
                            <p className="text-[#D53E0F] text-[10px] font-medium mt-0.5">
                              {variantName}
                            </p>
                          )}
                          
                          {/* ✅ ADD WEIGHT DISPLAY */}
                          {weightDisplay && (
                            <p className="text-gray-500 text-[10px] mt-0.5">
                              ⚖️ {weightDisplay}
                            </p>
                          )}
                          
                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-gray-900 text-xs font-medium">₹{item.price || 0}</p>
                            
                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button 
                                onClick={() => updateCartItem(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isRemoving}
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#9B0F06] hover:bg-gray-50 disabled:opacity-30 text-sm cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartItem(item._id, item.quantity + 1)}
                                disabled={item.quantity >= maxStock || isRemoving}
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#9B0F06] hover:bg-gray-50 disabled:opacity-30 text-sm cursor-pointer"
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
                  <div className="text-center py-1">
                    <p className="text-xs text-gray-500">
                      +{cart.items.length - 4} more item{cart.items.length - 4 > 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {/* Clear Cart Link */}
                {cart.items.length > 0 && (
                  <div className="text-right pt-1">
                    <button
                      onClick={clearCart}
                      className="text-[10px] text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer with totals and actions */}
        {cart.items && cart.items.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3 shadow-md">
            {/* Order Summary */}
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium" style={{ color: '#D53E0F' }}>FREE</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="text-gray-900">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-gray-200 mt-1">
                <span>Total</span>
                <span className="text-gray-900">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-1.5">
              <button
                onClick={handleCheckout}
                className="w-full py-2.5 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm text-white cursor-pointer"
                style={{ backgroundColor: '#9B0F06' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5E0006';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#9B0F06';
                }}
              >
                Buy Now
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
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