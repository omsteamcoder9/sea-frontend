// src/components/ProductCard.tsx
import { Product } from '@/types/product';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
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

// ============= WEIGHT LOGIC =============
const getProductWeight = (product: Product): { weight: number; weightUnit: string } | null => {
  // Check if product has variants
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    
    if (defaultVariant?.weight && defaultVariant?.weightUnit) {
      return {
        weight: defaultVariant.weight,
        weightUnit: defaultVariant.weightUnit
      };
    }
  }
  
  // Check if product has direct weight fields (if added to Product interface in future)
  if ((product as any)?.weight && (product as any)?.weightUnit) {
    return {
      weight: (product as any).weight,
      weightUnit: (product as any).weightUnit
    };
  }
  
  return null;
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
  
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const offerInfo = getProductOfferInfo(product);
  const hasValidOffer = offerInfo.hasOffer && offerInfo.originalPrice > offerInfo.discountedPrice;
  const weightInfo = getProductWeight(product);
  
  // Check if product is in cart (for "In Cart" badge)
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
    
    // Get the image URL that is currently DISPLAYED on screen
    const displayedImageUrl = imageUrl;
    
    // Extract just the filename from the displayed URL
    let imageFilename = '';
    if (displayedImageUrl && displayedImageUrl !== '/placeholder-image.jpg') {
      // Get everything after last slash
      imageFilename = displayedImageUrl.split('/').pop() || '';
    }
    
    const productWithImage = {
      ...product,
      images: [{ image: imageFilename }]
    };
    
    const defaultVariant = product.variants?.[0];
await addToCart(productWithImage, 1, defaultVariant);
  } catch (error) {
    console.error('Failed to add product to cart:', error);
  } finally {
    setIsAddingToCart(false);
  }
};

  return (
    <div
      onClick={handleCardClick}
      className="group w-full max-w-[300px] bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] cursor-pointer"
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/3] bg-[#F3F3F3] overflow-hidden m-2 rounded-2xl">
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority
            className="w-full h-full "
            onError={() => setImageError(true)}
          />
        </div>

        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* IN CART BADGE */}
        {isInCart && (
          <div className="absolute top-3 right-3 z-20 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg" style={{ backgroundColor: "#5E0006", color: "#D53E0F" }}>
            ✓
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="px-5 py-4">
        {/* Category/Weight */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
          {weightInfo ? `Net Weight • ${weightInfo.weight} ${weightInfo.weightUnit}` : 'Essentials'}
        </p>

        {/* PRODUCT NAME */}
        <h3 className="text-[#1A1A1A] text-[19px] font-semibold tracking-tight leading-tight mb-4 group-hover:text-[#5E0006] transition-colors truncate">
          {product.name}
        </h3>

        {/* Stock Status */}
        <div className="mb-3">
          {!isOutOfStock ? (
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#D53E0F' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#D53E0F' }}></span>
              <span className="text-[12px]">In Stock</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              <span className="text-[12px]">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex flex-col">
            <p className="text-[11px] text-gray-400 font-medium">Price</p>
            <div className="flex items-center gap-2 flex-wrap">
              {hasValidOffer && (
                <span className="text-gray-400 line-through text-[11px] font-medium">
                  ₹{formatPrice(offerInfo.originalPrice)}
                </span>
              )}
              <span className="text-xl font-bold text-[#1A1A1A]">
                ₹{formatPrice(offerInfo.discountedPrice)}
              </span>
            </div>
          </div>

<button
  onClick={handleAddToCart}
  disabled={isOutOfStock || isAddingToCart}
  className="flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-300 active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer min-w-[90px] sm:min-w-0 -mr-3"
  style={{ 
    backgroundColor: '#9B0F06',
    color: 'white'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#6B0A04';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#9B0F06';
  }}
>
  <ShoppingBag size={12} className="sm:w-4 sm:h-4" />
  <span className="text-[9px] sm:text-xs font-bold tracking-wide whitespace-nowrap">
    {isOutOfStock ? 'OUT' : 'Add To Cart'}
  </span>
</button>
        </div>
      </div>
    </div>
  );
}