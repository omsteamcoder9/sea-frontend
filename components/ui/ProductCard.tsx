// src/components/ProductCard.tsx
import { Product } from '@/types/product';
import { useState } from 'react';
import { useCart } from '@/context/CartContext'; // ✅ UNCOMMENT THIS
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

// Format price with commas
const formatPrice = (price: number): string => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
};

// ============= OFFER LOGIC =============
const getProductOfferInfo = (product: Product) => {
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    
    if (defaultVariant?.originalPrice && 
        defaultVariant?.price && 
        parseFloat(defaultVariant.originalPrice.toString()) > parseFloat(defaultVariant.price.toString())) {
      
      const original = parseFloat(defaultVariant.originalPrice.toString());
      const discounted = parseFloat(defaultVariant.price.toString());
      const discountPercentage = defaultVariant.discountPercentage || 
        ((original - discounted) / original) * 100;
      
      return {
        hasOffer: true,
        originalPrice: original,
        discountedPrice: discounted,
        discountPercentage: Math.round(discountPercentage * 100) / 100
      };
    }
    
    return {
      hasOffer: false,
      originalPrice: parseFloat(defaultVariant?.price?.toString() || '0'),
      discountedPrice: parseFloat(defaultVariant?.price?.toString() || '0'),
      discountPercentage: 0
    };
  }
  
  if (product.hasOffer && 
      product.originalPrice && 
      product.basePrice &&
      parseFloat(product.originalPrice.toString()) > parseFloat(product.basePrice.toString())) {
    
    const original = parseFloat(product.originalPrice.toString());
    const discounted = parseFloat(product.basePrice.toString());
    const discountPercentage = product.discountPercentage || 
      ((original - discounted) / original) * 100;
    
    return {
      hasOffer: true,
      originalPrice: original,
      discountedPrice: discounted,
      discountPercentage: Math.round(discountPercentage * 100) / 100
    };
  }
  
  return {
    hasOffer: false,
    originalPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountedPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountPercentage: 0
  };
};

// Get product image
const getProductImage = (product: Product) => {
  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_URL;
  
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    
    if (defaultVariant?.images?.[0]?.image) {
      const imagePath = defaultVariant.images[0].image;
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      if (cleanPath.startsWith('uploads/')) {
        cleanPath = cleanPath.replace('uploads/', '');
      }
      return `${imgBaseUrl}/${cleanPath}`;
    }
  }
  
  if (product.images?.[0]?.image) {
    const imagePath = product.images[0].image;
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    if (cleanPath.startsWith('uploads/')) {
      cleanPath = cleanPath.replace('uploads/', '');
    }
    return `${imgBaseUrl}/${cleanPath}`;
  }
  
  return '/placeholder-image.jpg';
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart, cart } = useCart(); // ✅ UNCOMMENT THIS
  const router = useRouter();

  const offerInfo = getProductOfferInfo(product);
  const hasValidOffer = offerInfo.hasOffer && offerInfo.originalPrice > offerInfo.discountedPrice;
  
  // ✅ Check if product is in cart (for "In Cart" badge)
  const isInCart = cart?.items?.some(item => {
    const productId = typeof item.product === 'string' ? item.product : item.product?._id;
    return productId === product._id;
  }) || false;
  
  const isOutOfStock = product.stock <= 0;
  const imageUrl = getProductImage(product);

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAddingToCart) return;
    
    try {
      setIsAddingToCart(true);
      await addToCart(product, 1); // ✅ UNCOMMENT THIS - Add to cart without variant
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer font-sans transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* In Cart Badge */}
      {isInCart && (
        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
          ✓
        </div>
      )}

      {/* Image Section */}
      <div className="relative p-3 sm:p-4 pb-0 overflow-hidden">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-contain transition-transform duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                onError={() => setImageError(true)}
                priority={false}
                loading="lazy"
                unoptimized={imageUrl.startsWith('http') && !imageUrl.includes('localhost')}
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-2 min-h-[2.5rem]">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-[10px] sm:text-[14px] flex-1 pr-2 text-left">
            {product.name}
          </h3>
          
          {hasValidOffer && (
            <div className="bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white px-1.5 py-0.5 rounded-md text-[10px] xs:text-xs font-bold whitespace-nowrap flex-shrink-0 sm:px-2 sm:text-xs">
              {Math.round(offerInfo.discountPercentage)}% OFF
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <span className="text-sm xs:text-base sm:text-lg font-bold text-gray-900">
              ₹{formatPrice(offerInfo.discountedPrice)}
            </span>
            
            {hasValidOffer && (
              <span 
                className="text-[10px] xs:text-xs sm:text-sm text-gray-500 font-medium"
                style={{ 
                  textDecoration: 'line-through',
                  textDecorationColor: '#6b7280',
                  textDecorationThickness: '0.5px'
                }}
              >
                ₹{formatPrice(offerInfo.originalPrice)}
              </span>
            )}
          </div>
          
          <span className={`px-1.5 py-0.5 xs:px-2 xs:py-1 text-[10px] xs:text-xs rounded-full font-medium whitespace-nowrap ${
            !isOutOfStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {!isOutOfStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="w-full py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-[#D97A22]/25 text-xs xs:text-sm sm:text-sm transform hover:scale-105 cursor-pointer mb-2"
        >
          <ShoppingBag size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
          <span className="text-xs xs:text-sm sm:text-sm">
            {isAddingToCart ? 'Adding...' : (!isOutOfStock ? 'Add to Cart' : 'Out of Stock')}
          </span>
        </button>
      </div>
    </div>
  );
}