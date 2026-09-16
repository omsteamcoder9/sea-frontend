'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart, isGuest } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const itemCount = cart.totalItems || 0;
  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // Helper function to get variant display name
  const getVariantName = (item: any): string | null => {
    if (item.variantName) return item.variantName;
    if (item.selectedVariant?.variantName) return item.selectedVariant.variantName;
    if (item.selectedVariant?.name) return item.selectedVariant.name;
    return null;
  };

  // Helper function to get weight display
  const getWeightDisplay = (item: any): string | null => {
    const weight = item.weight || item.selectedVariant?.weight;
    const weightUnit = item.weightUnit || item.selectedVariant?.weightUnit || 'gram';
    
    if (weight && weight > 0) {
      return `${weight} ${weightUnit}`;
    }
    return null;
  };

  // Helper function to get product name
  const getProductName = (item: any): string => {
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.name || 'Unnamed Product';
    }
    return item.productName || 'Product';
  };

  // Helper function to get product stock
  const getProductStock = (item: any): number => {
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.stock || 0;
    }
    return 999;
  };

  // Helper function to get product image URL
  const getProductImageUrl = (item: any): string | null => {
    const baseUrl = process.env.NEXT_PUBLIC_IMG_URL || '';
    
    const formatImageUrl = (imagePath: string): string => {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) return imagePath;
      
      let cleanPath = imagePath;
      if (cleanPath.startsWith('/uploads/')) {
        cleanPath = cleanPath.replace('/uploads/', '');
      }
      cleanPath = cleanPath.replace(/^\//, '');
      
      return `${baseUrl}/${cleanPath}`;
    };
    
    if (item.productImage) {
      return formatImageUrl(item.productImage);
    }
    
    if (typeof item.product === 'object' && item.product?.images?.[0]?.image) {
      return formatImageUrl(item.product.images[0].image);
    }
    
    if (typeof item.product === 'object' && item.product?.ogImage) {
      return formatImageUrl(item.product.ogImage);
    }
    
    return null;
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-sm border border-[#B8DCE7] p-6 sm:p-8">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[#315A6E]/40 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-[#063B5C] mb-3 sm:mb-4">Your Cart is Empty</h1>
            <p className="text-[#315A6E] mb-4 sm:mb-6 text-sm sm:text-base">Add some fresh catch to your cart to see them here.</p>
            <Link 
              href="/products"
              className="inline-block text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base shadow-lg"
              style={{ backgroundColor: '#064B6A' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#063B5C]">Shopping Cart</h1>
          {isGuest && (
            <div className="border px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm" style={{ backgroundColor: '#008FB8/10', borderColor: '#008FB8/20', color: '#008FB8' }}>
              <p>
                🛒 Shopping as Guest •{' '}
                <Link href="/signup" className="font-semibold underline hover:opacity-80 transition-colors duration-200" style={{ color: '#008FB8' }}>
                  Sign up to save your cart
                </Link>
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-[#B8DCE7] p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#063B5C]">
                  Cart Items ({itemCount})
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {cart.items.map((item) => {
                  const productName = getProductName(item);
                  const variantName = getVariantName(item);
                  const weightDisplay = getWeightDisplay(item);
                  const productStock = getProductStock(item);
                  const imageUrl = getProductImageUrl(item);
                  
                  return (
                    <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b border-[#B8DCE7] pb-4 sm:pb-6">
                      {/* Product Image and Info - Mobile Layout */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={productName}
                            width={80}
                            height={80}
                            className="object-cover rounded-lg w-16 h-16 sm:w-20 sm:h-20"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#EAF8FC] rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-[#315A6E]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Product Info - Mobile Layout */}
                        <div className="sm:hidden flex-grow">
                          <h3 className="font-semibold text-[#063B5C] text-sm line-clamp-2">
                            {productName}
                          </h3>
                          {variantName && (
                            <p className="text-xs font-medium" style={{ color: '#008FB8' }}>📦 {variantName}</p>
                          )}
                          {/* ✅ ADD WEIGHT DISPLAY */}
                          {weightDisplay && (
                            <p className="text-xs text-[#315A6E]">⚖️ {weightDisplay}</p>
                          )}
                          <p className="text-[#315A6E] text-xs">₹{item.price || 0}</p>
                          {productStock && productStock < 10 && (
                            <p className="text-orange-600 text-xs mt-1">
                              Only {productStock} left
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Info - Desktop Layout */}
                      <div className="hidden sm:block flex-grow">
                        <h3 className="font-semibold text-[#063B5C]">
                          {productName}
                        </h3>
                        {variantName && (
                          <p className="text-sm font-medium" style={{ color: '#008FB8' }}>📦 {variantName}</p>
                        )}
                        {/* ✅ ADD WEIGHT DISPLAY */}
                        {weightDisplay && (
                          <p className="text-sm text-[#315A6E]">⚖️ Weight: {weightDisplay}</p>
                        )}
                        <p className="text-[#315A6E] text-sm">₹{item.price || 0}</p>
                        {productStock && productStock < 10 && (
                          <p className="text-orange-600 text-xs mt-1">
                            Only {productStock} left in stock
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity Controls and Price - Mobile Layout */}
                      <div className="flex items-center justify-between sm:justify-center sm:space-x-2">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateCartItem(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200 cursor-pointer"
                            style={{ color: '#008FB8', borderColor: '#008FB8' }}
                          >
                            -
                          </button>
                          <span className="w-8 sm:w-12 text-center text-sm sm:text-base text-[#063B5C]">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItem(item._id, item.quantity + 1)}
                            disabled={item.quantity >= productStock}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200 cursor-pointer"
                            style={{ color: '#008FB8', borderColor: '#008FB8' }}
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Price and Remove - Mobile Layout */}
                        <div className="sm:hidden text-right">
                          <p className="font-semibold text-[#063B5C] text-sm">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-600 hover:text-red-800 text-xs transition-colors duration-200 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price and Remove - Desktop Layout */}
                      <div className="hidden sm:block text-right min-w-[100px]">
                        <p className="font-semibold text-[#063B5C]">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-800 text-sm transition-colors duration-200 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#B8DCE7] p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-semibold text-[#063B5C] mb-3 sm:mb-4">Order Summary</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-[#315A6E]">
                  <span>Subtotal ({itemCount} items)</span>
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
                <div className="border-t border-[#B8DCE7] pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-semibold text-[#063B5C]">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full text-white py-3 rounded-lg transition-all duration-200 font-medium mb-3 sm:mb-4 text-sm sm:text-base shadow-lg hover:shadow-md active:scale-95 cursor-pointer"
                style={{ backgroundColor: '#064B6A' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#008FB8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#064B6A';
                }}
              >
                Buy Now
              </button>

              {isGuest && (
                <div className="text-center mb-3 sm:mb-4 space-y-2">
                  <p className="text-xs sm:text-sm text-[#315A6E]">Want faster checkout?</p>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <Link 
                      href="/login"
                      className="text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium text-center text-xs sm:text-sm shadow-lg hover:shadow-md"
                      style={{ backgroundColor: '#064B6A' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#008FB8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#064B6A';
                      }}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup"
                      className="py-2 px-4 rounded-lg transition-all duration-200 font-medium text-center text-xs sm:text-sm"
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
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
              
              <Link 
                href="/products"
                className="w-full py-3 rounded-lg transition-all duration-200 font-medium text-center block text-sm sm:text-base"
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
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}