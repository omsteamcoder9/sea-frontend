'use client';

import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductCard from '@/components/ui/ProductCard';
import { Product, ProductVariant } from '@/types/product';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';

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

// Helper function to get correct image URL
const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/placeholder-image.jpg';

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_URL || '';

  let cleanPath = imagePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }

  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.replace('uploads/', '');
  }

  const imageUrl = `${imgBaseUrl}/${cleanPath}`;

  return imageUrl;
};

const MobileFloatingButton = ({
  product,
  selectedVariant,
  isVisible,
  onAddToCart
}: MobileFloatingButtonProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToBuy, setAddingToBuy] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      const buyNowData = {
        product: product,
        quantity: quantity,
        selectedVariant: selectedVariant,
        price: selectedVariant ? selectedVariant.price : product.basePrice,
        productName: product.name,
        variantName: selectedVariant?.variantName || selectedVariant?.name || null
      };
      sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowData));

      if (!user) {
        sessionStorage.setItem('redirectAfterLogin', '/checkout?buyNow=true');
        router.push('/signup?returnTo=/checkout&buyNow=true');
      } else {
        router.push('/checkout?buyNow=true');
      }
    } catch (error) {
      console.error('Error:', error);
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
      <div className="border-t border-[#176B8C]" style={{ backgroundColor: '#064B6A', color: '#EAF8FC' }}>
        {/* QUANTITY ROW - COMPACT */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#176B8C]" style={{ backgroundColor: '#064B6A', color: '#EAF8FC' }}>
          <span className="text-xs font-medium" style={{ color: '#EAF8FC' }}>Quantity:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-6 h-6 flex items-center justify-center border rounded-md disabled:opacity-40 hover:bg-opacity-20 cursor-pointer"
              style={{ backgroundColor: '#064B6A', borderColor: '#00A9E0', color: '#EAF8FC' }}
            >
              -
            </button>
            <span className="text-sm font-medium w-6 text-center" style={{ color: '#EAF8FC' }}>{quantity}</span>
            <button
              onClick={() => {
                const maxStock = currentStock || 99;
                setQuantity(prev => Math.min(maxStock, prev + 1))
              }}
              disabled={isOutOfStock || quantity >= (currentStock || 99)}
              className="w-6 h-6 flex items-center justify-center border rounded-md disabled:opacity-40 hover:bg-opacity-20 cursor-pointer"
              style={{ backgroundColor: '#064B6A', borderColor: '#00A9E0', color: '#EAF8FC' }}
            >
              +
            </button>
          </div>
        </div>

        {/* ACTION BUTTONS ROW */}
        <div className="flex items-stretch h-10">
          <button
            onClick={handleCartClick}
            disabled={isOutOfStock || addingToCart}
            className={`
              flex-1 flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer active:scale-95
              ${isOutOfStock || addingToCart
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'hover:shadow-md'
              }
            `}
            style={!isOutOfStock && !addingToCart ? { backgroundColor: '#008FB8', color: 'white' } : {}}
            onMouseEnter={(e) => {
              if (!isOutOfStock && !addingToCart) {
                e.currentTarget.style.backgroundColor = '#00A9E0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock && !addingToCart) {
                e.currentTarget.style.backgroundColor = '#008FB8';
              }
            }}
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

          <button
            onClick={handleBuyClick}
            disabled={isOutOfStock || addingToBuy}
            className={`
              flex-1 flex items-center justify-center gap-1 transition-colors duration-200 cursor-pointer active:scale-95
              ${isOutOfStock || addingToBuy
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : ''
              }
            `}
            style={!isOutOfStock && !addingToBuy ? { backgroundColor: '#063B5C', color: 'white' } : {}}
            onMouseEnter={(e) => {
              if (!isOutOfStock && !addingToBuy) {
                e.currentTarget.style.backgroundColor = '#064B6A';
              }
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock && !addingToBuy) {
                e.currentTarget.style.backgroundColor = '#063B5C';
              }
            }}
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

  const displayPrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);

  let displayImageUrl = '';
  if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 && selectedVariant.images[0]?.image) {
    displayImageUrl = getImageUrl(selectedVariant.images[0].image);
  } else if (product?.images && product.images.length > 0 && product.images[0]?.image) {
    displayImageUrl = getImageUrl(product.images[0].image);
  } else {
    displayImageUrl = `${siteUrl}/og-image.png`;
  }

  const displayStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": (product?.name || '') + (selectedVariant ? ` - ${selectedVariant.variantName || selectedVariant.name}` : ''),
    "description": selectedVariant?.description || product?.description || '',
    "image": displayImageUrl,
    "brand": {
      "@type": "Brand",
      "name": (product as any)?.seller || storeName,
    },
    "sku": selectedVariant?.sku || product?._id || '',
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
        "name": (product as any)?.seller || storeName
      }
    },
    "category": product?.category && typeof product.category === 'object' ? product.category.name : "Farm Tools",
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
        "name": (product?.name || '') + (selectedVariant ? ` - ${selectedVariant.variantName || selectedVariant.name}` : ''),
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

  let displayWeight = weight;
  let displayUnit = unit;

  if (unit === 'gram' && weight >= 1000) {
    displayWeight = weight / 1000;
    displayUnit = 'kg';
  } else if (unit === 'ml' && weight >= 1000) {
    displayWeight = weight / 1000;
    displayUnit = 'liter';
  }

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
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      setSelectedVariant(defaultVariant);

      if (defaultVariant.images && defaultVariant.images.length > 0) {
        setCurrentImages(defaultVariant.images);
      }
    }
  }, [product]);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);

    if (variant.images && variant.images.length > 0) {
      setCurrentImages(variant.images);
    } else {
      setCurrentImages(product?.images || []);
    }
  };

  const handleImageThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

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
      await addToCart(product, quantity, variant || undefined);
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
      const buyNowData = {
        product: product,
        quantity: quantity,
        selectedVariant: selectedVariant,
        price: selectedVariant ? selectedVariant.price : product.basePrice,
        productName: product.name,
        variantName: selectedVariant?.variantName || selectedVariant?.name || null
      };
      sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowData));

      if (!user) {
        sessionStorage.setItem('redirectAfterLogin', '/checkout?buyNow=true');
        router.push('/signup?returnTo=/checkout&buyNow=true');
      } else {
        router.push('/checkout?buyNow=true');
      }
    } catch (error) {
      console.error('❌ Error in Buy Now:', error);
      alert('Failed to process Buy Now. Please try again.');
    }
  };

  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  const displayPrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);

  const getSpecifications = () => {
    const specs = (product as any)?.specifications;
    if (!specs || !Array.isArray(specs)) return [];

    if (specs.length > 0 && typeof specs[0] === 'object' && 'key' in specs[0]) {
      return specs;
    }

    return [];
  };

  const specifications = getSpecifications();
  const keyFeatures = (product as any)?.keyFeatures || [];

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FCFD] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#063B5C]">Product not found</h1>
          <p className="text-[#315A6E] mt-2">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductStructuredData product={product} selectedVariant={selectedVariant} />

      <div className="min-h-screen bg-white pb-9 lg:pb-0">
        <div className="mx-auto">
          <div className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
              {/* Product Images Section */}
              <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg mt-5">
                  <div className="relative w-full h-auto min-h-[400px] lg:min-h-[500px] mb-3">
                    {currentImages && currentImages.length > selectedImageIndex && currentImages[selectedImageIndex]?.image ? (
                      <>
                        {currentImages.length > 1 && (
                          <button
                            onClick={() => handleImageThumbnailClick(Math.max(0, selectedImageIndex - 1))}
                            disabled={selectedImageIndex === 0}
                            className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg border border-[#B8DCE7] disabled:opacity-30 disabled:cursor-not-allowed transition-all left-4"
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6 text-[#063B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}

                        <Image
                          src={getImageUrl(currentImages[selectedImageIndex].image)}
                          alt={`${product.name}${selectedVariant ? ` - ${selectedVariant.variantName || selectedVariant.name}` : ''}`}
                          fill
                          className="object-contain"
                          priority
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />

                        {currentImages.length > 1 && (
                          <button
                            onClick={() => handleImageThumbnailClick(Math.min(currentImages.length - 1, selectedImageIndex + 1))}
                            disabled={selectedImageIndex === currentImages.length - 1}
                            className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg border border-[#B8DCE7] disabled:opacity-30 disabled:cursor-not-allowed transition-all right-4"
                          >
                            <svg className="w-6 h-6 text-[#063B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-[#EAF8FC] flex items-center justify-center">
                        <span className="text-[#315A6E]/60 text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Image Thumbnail Gallery */}
 {currentImages && currentImages.length > 1 && (
  <div className="mt-3 sm:mt-4">
    <div className="flex justify-center items-center gap-1.5 sm:gap-2">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto px-1 sm:px-2 py-1 max-w-full scrollbar-hide">
        {(() => {
          // Calculate visible thumbnails based on screen size
          let visibleCount = 5;
          if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 400) visibleCount = 3;
            else if (width < 640) visibleCount = 4;
            else if (width < 768) visibleCount = 5;
            else visibleCount = 5;
          }

          let startIndex = selectedImageIndex - Math.floor(visibleCount / 2);
          if (startIndex < 0) startIndex = 0;
          if (startIndex > currentImages.length - visibleCount) {
            startIndex = Math.max(0, currentImages.length - visibleCount);
          }

          const visibleThumbnails = currentImages.slice(startIndex, startIndex + visibleCount);

          return visibleThumbnails.map((img, localIndex) => {
            const actualIndex = startIndex + localIndex;

            return (
              <button
                key={actualIndex}
                onClick={() => handleImageThumbnailClick(actualIndex)}
                className={`
                  flex-shrink-0 relative rounded-md overflow-hidden transition-all cursor-pointer
                  w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
                  ${selectedImageIndex === actualIndex 
                    ? 'border-2 border-[#008FB8] ring-2 ring-[#008FB8]/20 scale-105 shadow-lg' 
                    : 'border border-[#B8DCE7] hover:border-[#008FB8]/60 hover:scale-102'
                  }
                `}
              >
                {img.image ? (
                  <Image
                    src={getImageUrl(img.image)}
                    alt={`${product.name} - View ${actualIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 480px) 48px, (max-width: 640px) 56px, (max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#EAF8FC] flex items-center justify-center">
                    <span className="text-[#315A6E]/60 text-[6px] xs:text-[8px] sm:text-xs">Image {actualIndex + 1}</span>
                  </div>
                )}

                {selectedImageIndex === actualIndex && (
                  <div className="absolute inset-0 bg-[#008FB8]/10 flex items-center justify-center">
                    <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full bg-[#008FB8] flex items-center justify-center">
                      <svg className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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

              {/* Product Details Section */}
              <div className="space-y-3 p-3 sm:p-4">
                {/* Product Name */}
                <h1 className="text-lg sm:text-xl font-bold text-[#063B5C]">
                  {product.name}
                  {selectedVariant && (
                    <span className="text-base font-normal text-[#315A6E] ml-2">
                      - {selectedVariant.variantName || selectedVariant.name}
                    </span>
                  )}
                </h1>

                {/* Variant Selection - Optimized */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-[#063B5C]">Select Weight:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => {
                        let weightDisplay = '';
                        if (variant.weight && variant.weightUnit) {
                          let displayWeight = variant.weight;
                          let displayUnit = variant.weightUnit;

                          if (variant.weightUnit === 'gram' && variant.weight >= 1000) {
                            displayWeight = variant.weight / 1000;
                            displayUnit = 'kg';
                          } else if (variant.weightUnit === 'ml' && variant.weight >= 1000) {
                            displayWeight = variant.weight / 1000;
                            displayUnit = 'liter';
                          }

                          const formattedWeight = Number.isInteger(displayWeight) 
                            ? displayWeight.toString()
                            : parseFloat(displayWeight.toFixed(2)).toString();

                          weightDisplay = `${formattedWeight} ${displayUnit}`;
                        } else {
                          weightDisplay = (variant.variantName || variant.name || '').replace(/^pack\s*/i, '');
                        }

                        return (
                          <button
                            key={variant._id || variant.variantName || variant.name}
                            onClick={() => handleVariantSelect(variant)}
                            className={`
                              px-4 py-2 rounded-lg text-sm font-medium transition-all relative cursor-pointer
                              ${selectedVariant?.variantName === variant.variantName || selectedVariant?.name === variant.name
                                ? 'text-white border-2 shadow-sm'
                                : 'border hover:bg-opacity-80'
                              }
                            `}
                            style={
                              selectedVariant?.variantName === variant.variantName || selectedVariant?.name === variant.name
                                ? { backgroundColor: '#008FB8', borderColor: '#008FB8' }
                                : { backgroundColor: '#064B6A', color: '#EAF8FC', borderColor: '#008FB8' }
                            }
                          >
                            <span className="font-medium">
                              {weightDisplay}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price Section */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl sm:text-2xl font-bold text-[#063B5C]">
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(0, 143, 184, 0.1)', color: '#008FB8' }}>
                      Tax included. Shipping calculated at checkout.
                    </span>
                  </div>
                </div>

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
                : 'bg-[#063B5C] text-white '
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

    {/* Mobile Add to Cart & Buy Now - Single Row - Same Size */}
    <div className="lg:hidden">
      <div className="flex gap-2">
        {/* Add to Cart Button - 50% width */}
        <div className="flex-1">
          <AddToCartButton 
            product={product} 
            selectedVariant={selectedVariant || undefined}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </div>

        {/* Buy Now Button - 50% width - Same size as AddToCart */}
        <div className="flex-1">
          <button
            onClick={handleBuyNow}
            disabled={currentStock <= 0}
            className={`
              w-full min-h-[38px] py-2 px-3 rounded-lg font-semibold text-sm
              transition-colors duration-200 flex items-center justify-center gap-1.5 mt-10.5
              ${currentStock <= 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#063B5C] text-white hover:bg-[#064B6A] active:bg-[#008FB8]'
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
</div>

                {/* Product Details */}
                <div className="space-y-3 pt-2">
                  {/* Specifications */}
                  {specifications.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-[#063B5C]">Specifications</h3>
                      <div className="space-y-1">
                        {specifications.map((spec: any, index: number) => (
                          <div key={index} className="flex text-sm">
                            <span className="font-medium text-[#315A6E] w-2/5">{spec.key}:</span>
                            <span className="text-[#315A6E] w-3/5">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features */}
                  {(selectedVariant?.features && selectedVariant.features.length > 0) || keyFeatures.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-[#063B5C]">Key Features</h3>
                      <ul className="space-y-1">
                        {selectedVariant?.features && selectedVariant.features.length > 0 && (
                          selectedVariant.features.map((feature, index) => (
                            <li key={`variant-${index}`} className="flex items-start text-sm">
                              <span className="mr-2 mt-0.5" style={{ color: '#008FB8' }}>✓</span>
                              <span className="text-[#315A6E]">{feature}</span>
                            </li>
                          ))
                        )}
                        {keyFeatures.length > 0 && (
                          keyFeatures.map((feature: string, index: number) => (
                            <li key={`product-${index}`} className="flex items-start text-sm">
                              <span className="mr-2 mt-0.5" style={{ color: '#008FB8' }}>✓</span>
                              <span className="text-[#315A6E]">{feature}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ) : null}

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-[#063B5C] mb-1">Description</h3>
                    <p className="text-[#315A6E] text-sm leading-relaxed">
                      {selectedVariant?.description || product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {randomProducts && randomProducts.length > 0 && (
            <div className="p-3 sm:p-8 mt-5 border-t border-[#B8DCE7] bg-white">
              <h2 className="text-base font-bold text-[#063B5C] mb-2 text-center">You may also like</h2>
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

        {/* Mobile Floating Button */}
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