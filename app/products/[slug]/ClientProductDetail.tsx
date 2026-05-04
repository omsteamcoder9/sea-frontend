'use client';

import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductCard from '@/components/ui/ProductCard';
import { Product, ProductVariant } from '@/types/product';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';

interface ClientProductDetailProps {
  product: Product;
  randomProducts: Product[];
}

// Mobile Floating Button Component
interface MobileFloatingButtonProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  isVisible: boolean;
  onAddToCart: (quantity: number, variant: ProductVariant | null) => Promise<void>;
}

const MobileFloatingButton = ({ 
  product, 
  selectedVariant,
  isVisible, 
  onAddToCart 
}: MobileFloatingButtonProps) => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToBuy, setAddingToBuy] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Use selected variant stock, otherwise use product stock
  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  const isOutOfStock = currentStock <= 0;
  
  const handleCartClick = async () => {
    if (isOutOfStock || !product) return;
    
    try {
      setAddingToCart(true);
      await onAddToCart(quantity, selectedVariant);
      
      setShowAddedMessage(true);
      setTimeout(() => {
        setShowAddedMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };
  
const handleBuyClick = async () => {
  if (isOutOfStock || !product) return;
  
  try {
    setAddingToBuy(true);
    router.push('/checkout');
  } catch (error) {
    console.error('Error adding to cart:', error);
  } finally {
    setAddingToBuy(false);
  }
};

  return (
    <div className={`
      lg:hidden fixed bottom-0 left-0 right-0 z-50 
      transform transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="bg-white border-t border-gray-300">
        {/* QUANTITY ROW - COMPACT */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-300">
          <span className="text-xs font-medium text-gray-800">Quantity:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-400 rounded-md text-gray-800 disabled:opacity-40 hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-sm font-medium w-6 text-center text-gray-900">{quantity}</span>
            <button
              onClick={() => {
                const maxStock = currentStock || 99;
                setQuantity(prev => Math.min(maxStock, prev + 1))
              }}
              disabled={isOutOfStock || quantity >= (currentStock || 99)}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-400 rounded-md text-gray-800 disabled:opacity-40 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
        
        {/* ACTION BUTTONS ROW */}
        <div className="flex items-stretch h-10">
          {/* LEFT HALF - CART BUTTON */}
          <button
            onClick={handleCartClick}
            disabled={isOutOfStock || addingToCart}
            className={`
              flex-1
              flex items-center justify-center gap-1
              transition-all duration-300
              relative
              ${isOutOfStock || addingToCart
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] hover:shadow-md shadow cursor-pointer'
              }
            `}
          >
            {addingToCart ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
            ) : showAddedMessage ? (
              <span className="text-xs font-medium animate-pulse">Added! ✓</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs font-medium">Cart</span>
              </>
            )}
          </button>
          
          {/* RIGHT HALF - BUY BUTTON */}
          <button
            onClick={handleBuyClick}
            disabled={isOutOfStock || addingToBuy}
            className={`
              flex-1
              flex items-center justify-center gap-1
              transition-colors duration-200
              ${isOutOfStock || addingToBuy
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
              }
            `}
          >
            {addingToBuy ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-medium">Buy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Structured Data Component (JSON-LD)
const ProductStructuredData = ({ product, selectedVariant }: { product: Product, selectedVariant: ProductVariant | null }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || '';
  
  // Use selected variant price or base price
  const displayPrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);
  // Use selected variant images or
  const displayImage = selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 && selectedVariant.images[0]?.image 
    ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${selectedVariant.images[0].image}`
    : product?.images && product.images.length > 0 && product.images[0]?.image 
      ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${product.images[0].image}`
      : `${siteUrl}/og-image.png`;
  
  // Use selected variant stock or product stock
  const displayStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": (product?.name || '') + (selectedVariant ? ` - ${selectedVariant.variantName}` : ''),
    "description": selectedVariant?.description || product?.description || '',
    "image": displayImage,
    "brand": {
      "@type": "Brand",
      "name": product?.seller || storeName,
      "logo": `${siteUrl}/logo.png`
    },
    "sku": selectedVariant?.sku || product?._id || '',
    "gtin": product?.sNo?.toString() || `SNO${product?.sNo}` || '',
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/products/${product?.slug || ''}`,
      "priceCurrency": "INR",
      "price": displayPrice,
      "availability": displayStock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": product?.seller || storeName
      }
    },
    "category": product?.category && typeof product.category === 'object' ? product.category.name : "Farm Tools",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "quality",
        "value": "premium"
      },
      {
        "@type": "PropertyValue",
        "name": "handforged",
        "value": "yes"
      },
      {
        "@type": "PropertyValue",
        "name": "durable",
        "value": "yes"
      }
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Farm Tools",
        "item": `${siteUrl}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": (product?.name || '') + (selectedVariant ? ` - ${selectedVariant.variantName}` : ''),
        "item": `${siteUrl}/products/${product?.slug || ''}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
    </>
  );
};

// Helper function to format weight display
const formatWeightDisplay = (weight: number, unit: string): string => {
  if (!weight || weight <= 0) return '';
  
  // Convert to appropriate unit for display
  let displayWeight = weight;
  let displayUnit = unit;
  
  if (unit === 'gram' && weight >= 1000) {
    displayWeight = weight / 1000;
    displayUnit = 'kg';
  } else if (unit === 'ml' && weight >= 1000) {
    displayWeight = weight / 1000;
    displayUnit = 'liter';
  }
  
  // Format weight (remove trailing zeros)
  const formattedWeight = Number.isInteger(displayWeight) 
    ? displayWeight.toString()
    : parseFloat(displayWeight.toFixed(2)).toString();
  
  return `${formattedWeight} ${displayUnit}`;
};

export default function ClientProductDetail({ product, randomProducts }: ClientProductDetailProps) {
    const [quantity, setQuantity] = useState(1);

  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [currentImages, setCurrentImages] = useState(product?.images || []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart,cart } = useCart();
  const router = useRouter();

  // Set default variant on component mount
  useEffect(() => {
    console.log('Product loaded:', product);
    console.log('Product variants:', product?.variants);
    
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      console.log('Default variant selected:', defaultVariant);
      console.log('Default variant images:', defaultVariant.images);
      
      setSelectedVariant(defaultVariant);
      
      // Set initial images based on default variant
      if (defaultVariant.images && defaultVariant.images.length > 0) {
        setCurrentImages(defaultVariant.images);
      }
    }
  }, [product]);

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    console.log('📦 Variant clicked:', variant.variantName);
    console.log('🖼️ Variant images:', variant.images);
    console.log('🖼️ First image path:', variant.images?.[0]?.image);
    
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
    
    // Update images based on selected variant
    if (variant.images && variant.images.length > 0) {
      console.log('✅ Setting variant images:', variant.images);
      setCurrentImages(variant.images);
    } else {
      console.log('⚠️ No variant images, using product images');
      // Fallback to main product images if variant has no images
      setCurrentImages(product?.images || []);
    }
  };

  // Handle image thumbnail click
  const handleImageThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Handle scroll to show/hide floating button
  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const isScrollingUp = currentScrollY < lastScrollY;
      const isPastThreshold = currentScrollY > 100;
      const isNotAtBottom = currentScrollY < documentHeight - windowHeight - 100;
      
      setShowFloatingButton(isScrollingUp && isPastThreshold && isNotAtBottom);
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleMobileAddToCart = async (quantity: number, variant: ProductVariant | null) => {
    if (!product) {
      alert('Product not found');
      return;
    }
    
    try {
      // Pass the selected variant to addToCart function
      await addToCart(product, quantity, variant || undefined);
      return;
    } catch (error) {
      console.error('❌ Mobile - Error adding to cart:', error);
      throw error;
    }
  };

const handleBuyNow = async () => {
  if (!product) {
    alert('Product not found');
    return;
  }
  
  try {
    // Check if same product+variant already in cart
    const existingCartItem = cart.items.find(item => {
      if (item.product._id !== product._id) return false;
      
      if (selectedVariant) {
        return item.selectedVariant?.variantName === selectedVariant.variantName;
      } else {
        return !item.selectedVariant;
      }
    });
    
    // ✅ ONLY add to cart if NOT already there
    if (!existingCartItem) {
      await addToCart(product, quantity, selectedVariant || undefined);
    }
    
    // Always go to checkout
    router.push('/checkout');
  } catch (error) {
    console.error('❌ Error in Buy Now:', error);
    alert('Failed to process Buy Now. Please try again.');
  }
};

  // Use selected variant stock or product stock
  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  // Use selected variant price or base price
  const displayPrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);
  // Calculate discount percentage if original price exists
  const originalPrice = selectedVariant?.originalPrice || product?.originalPrice;
  const discountPercentage = originalPrice && displayPrice < originalPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : selectedVariant?.discountPercentage || 0;

  const groupedSpecifications = () => {
    if (!product?.specifications || !Array.isArray(product.specifications)) {
      return [];
    }

    const groups: { [key: string]: Array<{ key: string; value: string }> } = {};
    
    product.specifications.forEach(spec => {
      const category = 'Details';
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(spec);
    });
    
    return Object.entries(groups);
  };

  const specGroups = groupedSpecifications();

  // Return early if no product
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Structured Data - JSON-LD (for SEO) */}
      <ProductStructuredData product={product} selectedVariant={selectedVariant} />
      
      <div className="min-h-screen bg-white pb-9 lg:pb-0">
        <div className="mx-auto">
          
          {/* Product Section - ULTRA COMPACT */}
          <div className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
              {/* Product Images - FULL HEIGHT */}
              <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg mt-5">
                  {/* MAIN IMAGE */}
                    <div className="relative w-full h-auto min-h-[400px] lg:min-h-[500px] mb-3">
  {currentImages && currentImages.length > selectedImageIndex && currentImages[selectedImageIndex]?.image ? (
    <>
      {/* Left Arrow for Main Image */}
      {currentImages.length > 1 && (
        <button
          onClick={() => handleImageThumbnailClick(Math.max(0, selectedImageIndex - 1))}
          disabled={selectedImageIndex === 0}
          className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          style={{ top: '50%',left:"10%" }}
          aria-label="Previous image"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_URL || ''}${currentImages[selectedImageIndex].image}`}
        alt={`${product.name}${selectedVariant ? ` - ${selectedVariant.variantName}` : ''} - Farm Tools | ${process.env.NEXT_PUBLIC_SITE_NAME || ''}`}
        fill
        className="object-contain" 
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={(e) => {
          console.error('Image failed to load:', e);
        }}
      />
      
       {/* Right Arrow for Main Image */}
      {currentImages.length > 1 && (
        <button
          onClick={() => handleImageThumbnailClick(Math.min(currentImages.length - 1, selectedImageIndex + 1))}
          disabled={selectedImageIndex === currentImages.length - 1}
          className="absolute right-2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
style={{ top: '50%',right:"10%" }}
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

 
    </>
  ) : (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-gray-400 text-sm">No image</span>
    </div>
  )}
</div>

          {/* IMAGE THUMBNAIL GALLERY BELOW MAIN IMAGE */}
{currentImages && currentImages.length > 1 && (
  <div className="mt-4">
    <div className="flex justify-center items-center gap-2">


      {/* Show 5 thumbnails at a time */}
      <div className="flex items-center gap-2">
        {(() => {
          // Calculate which 5 thumbnails to show based on selected image
          let startIndex = selectedImageIndex - 2;
          if (startIndex < 0) startIndex = 0;
          if (startIndex > currentImages.length - 5) startIndex = Math.max(0, currentImages.length - 5);
          
          // Take 5 thumbnails
          const visibleThumbnails = currentImages.slice(startIndex, startIndex + 5);
          
          return visibleThumbnails.map((img, localIndex) => {
            const actualIndex = startIndex + localIndex;
            
            return (
              <button
                key={actualIndex}
                onClick={() => handleImageThumbnailClick(actualIndex)}
                className={`
                  flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative rounded-md overflow-hidden  transition-all
                  ${selectedImageIndex === actualIndex 
                    ? 'border-[#D97A22] ring-2 ring-[#D97A22]/10 scale-105' 
                    : 'border-gray-200 hover:border-[#D97A22]/60'
                  }
                `}
              >
                {img.image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL || ''}${img.image}`}
                    alt={`${product.name} - View ${actualIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image {actualIndex + 1}</span>
                  </div>
                )}
                
                {/* Selected indicator */}
                {selectedImageIndex === actualIndex && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                
             
              </button>
            );
          });
        })()}
      </div>

    </div>
  </div>
)}
                </div>
              </div>

              {/* Product Details - ULTRA TIGHT */}
              <div className="space-y-3 p-3 sm:p-4">
                {/* Product Name */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {product.name}
                  {selectedVariant && (
                    <span className="text-base font-normal text-gray-600 ml2">
                      - {selectedVariant.variantName}
                    </span>
                  )}
                </h1>

                {/* Variant Selection (if variants exist) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">Select Pack:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => {
                        // Get weight display text
                        const weightDisplay = variant.weight && variant.weightUnit 
                          ? formatWeightDisplay(variant.weight, variant.weightUnit)
                          : '';
                        
                        return (
                          <button
                            key={variant._id || variant.variantName}
                            onClick={() => handleVariantSelect(variant)}
                            className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all relative
                              ${selectedVariant?.variantName === variant.variantName
                                ? 'bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white border-2 border-[#D97A22]'
                                : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gradient-to-r hover:from-[#D97A22]/10 hover:via-[#D97A22]/10 hover:to-[#D97A22]/10 hover:border-[#D97A22]/30'
                              }
                            `}
                          >
                            <div className="text-center">
                              {/* Variant Name */}
                              <div className="font-medium">
                                {variant.variantName}
                                {variant.isDefault && (
                                  <span className="text-xs ml-1 text-[#D97A22]"></span>
                                )}
                                {/* Show image indicator */}
                                {variant.images && variant.images.length > 0 && (
                                  <span className="text-xs ml-1 text-[#D97A22]"></span>
                                )}
                              </div>
                              
                              {/* Weight Display - below the variant name */}
                              {weightDisplay && (
                                <div className="text-xs mt-1 opacity-75">
                                  {weightDisplay}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price and Stock - BELOW THE NAME */}
                <div className="space-y-1">
                  {/* Display selected variant price or base price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-800">
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                   {originalPrice && originalPrice > displayPrice && (
  <>
    <span 
      className="text-lg text-gray-500"
      style={{ 
        textDecoration: 'line-through',
        textDecorationColor: '#6b7280',
        textDecorationThickness: '2px'
      }}
    >
      ₹{originalPrice.toLocaleString('en-IN')}
    </span>
    <span className="text-sm font-bold text-[#D97A22]">
      {discountPercentage}% OFF
    </span>
  </>
)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22]">
                      Tax included. Shipping calculated at checkout.
                    </span>
                  </div>
                </div>

          

              {/* Add to Cart - COMPACT */}
<div className="pt-2">
  <div className="max-w-sm">
    {/* Desktop Add to Cart Button - Two buttons side by side */}
<div className="hidden lg:block">
  <div className="flex gap-3">
    {/* Add to Cart Button */}
    <div className="flex-1">
     <AddToCartButton 
  product={product} 
  selectedVariant={selectedVariant || undefined}
  quantity={quantity}
  onQuantityChange={setQuantity}
/>
    </div>
    
    {/* Buy Now Button - Exact same size as AddToCart */}
    <div className="flex-1">
      <button
        onClick={handleBuyNow}
        disabled={currentStock <= 0}
        className={`
          w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mt-10
          transition-all duration-300 shadow cursor-pointer text-sm
          ${currentStock <= 0 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-black text-white'
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Buy Now
      </button>
    </div>
  </div>
</div>
    
    {/* Mobile Add to Cart Button - Kept as before */}
    <div className="lg:hidden">
      <div className="space-y-2">
        {/* Pass selected variant to AddToCartButton */}
        <AddToCartButton 
          product={product} 
          selectedVariant={selectedVariant || undefined}
        />
        
        {/* Mobile Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={currentStock <= 0}
          className={`
            w-full py-3 rounded-lg font-semibold text-sm
            transition-colors duration-200 flex items-center justify-center gap-1.5
            ${currentStock <= 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-black text-white'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Buy Now
        </button>
      </div>
    </div>
  </div>
</div>

                {/* Product Details - COMPACT */}
                <div className="space-y-3 pt-2">

                  {/* Specifications - Grouped by category */}
                  {specGroups.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                      {specGroups.map(([category, specs], groupIndex) => (
                        <div key={groupIndex} className="space-y-1">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{category}</h4>
                          <div className="space-y-1">
                            {specs.map((spec, index) => (
                              <div key={index} className="flex text-sm">
                                <span className="font-medium text-gray-700 w-2/5">{spec.key}:</span>
                                <span className="text-gray-600 w-3/5">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Features - ADDED THIS SECTION */}
                  {(selectedVariant?.features && selectedVariant.features.length > 0) || 
                   (product.keyFeatures && product.keyFeatures.length > 0) ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900">Key Features</h3>
                      <ul className="space-y-1">
                        {/* Show variant features first, then product key features */}
                        {selectedVariant?.features && selectedVariant.features.length > 0 && (
                          <>
                            {selectedVariant.features.map((feature, index) => (
                              <li key={`variant-${index}`} className="flex items-start text-sm">
                                <span className="text-[#D97A22] mr-2 mt-0.5">✓</span>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </>
                        )}
                        {product.keyFeatures && product.keyFeatures.length > 0 && (
                          <>
                            {product.keyFeatures.map((feature, index) => (
                              <li key={`product-${index}`} className="flex items-start text-sm">
                                <span className="text-[#D97A22] mr-2 mt-0.5">✓</span>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>
                  ) : null}

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Description</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedVariant?.description || product.description}
                    </p>
                  </div>

         
                </div>
              </div>
            </div>
          </div>

          {/* Related Products - TIGHT */}
          {randomProducts && randomProducts.length > 0 && (
            <div className="p-3 sm:p-8 mt-5 border-t border-gray-300 bg-white">
              <h2 className="text-base font-bold text-gray-800 mb-2 text-center">You may also like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {randomProducts.slice(0, 4).map((relatedProduct) => (
                  <div key={relatedProduct._id} className="scale-95">
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Floating Button - Appears when scrolling up */}
        {product && (
          <MobileFloatingButton 
            product={product} 
            selectedVariant={selectedVariant}
            isVisible={showFloatingButton}
            onAddToCart={handleMobileAddToCart}
          />
        )}
      </div>
    </>
  );
}