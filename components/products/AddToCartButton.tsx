'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant } from '@/types/product';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  compact?: boolean; // New prop for compact mode
}

export default function AddToCartButton({ 
  product, 
  selectedVariant,
  quantity: externalQuantity,
  onQuantityChange,
  compact = false // Default to false for backward compatibility
}: AddToCartButtonProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);
  const quantity = externalQuantity !== undefined ? externalQuantity : internalQuantity;
  const setQuantity = onQuantityChange || setInternalQuantity;  
  const { addToCart, loading, addingProductId, cart } = useCart();

  const isAdding = loading && addingProductId === product._id;

  // Check for same variant in cart
  const isInCart = cart?.items?.some(item => {
    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    const sameProduct = productId === product._id;
    
    const itemVariantId = item.selectedVariant?._id || item.variantId;
    const selectedVariantId = selectedVariant?._id || selectedVariant?.variantName;
    const sameVariant = !selectedVariantId || itemVariantId === selectedVariantId;
    
    return sameProduct && sameVariant;
  }) || false;

  const getMaxQuantity = () => {
    if (selectedVariant) {
      return Math.max(0, selectedVariant.stock);
    }
    return Math.max(0, product.stock);
  };

  const handleAddToCart = async () => {
    console.log('🛒 Adding to cart:', {
      productId: product._id,
      productName: product.name,
      selectedVariant: selectedVariant?.variantName || selectedVariant?.name,
      quantity,
    });

    try {
      await addToCart(product, quantity, selectedVariant);
      console.log('✅ Add to cart successful');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const maxQuantity = getMaxQuantity();
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0;

  // Compact mode styles
  if (compact) {
    return (
      <div className="space-y-1.5">
        {/* Quantity Selector - Compact */}
        {!isOutOfStock && (
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-xs text-gray-700">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-1.5 py-0.5 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-xs"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-1.5 py-0.5 min-w-6 text-center text-xs">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                className="px-1.5 py-0.5 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-xs"
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart Button - Compact */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="w-full py-1.5 px-2 rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{
            backgroundColor: isOutOfStock || isAdding ? '#ccc' : '#9B0F06',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            if (!isOutOfStock && !isAdding) {
              e.currentTarget.style.backgroundColor = '#6B0A04';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOutOfStock && !isAdding) {
              e.currentTarget.style.backgroundColor = '#9B0F06';
            }
          }}
        >
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
          ) : isInCart ? (
            <>
              <Check size={12} />
              <span>In Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag size={12} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Original mode (for backward compatibility)
  return (
    <div className="space-y-3">
      {!isOutOfStock && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-700">Qty:</span>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-sm"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-2 py-1 min-w-8 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="px-2 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-sm"
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          {maxQuantity > 0 && (
            <span className="text-xs text-gray-600">
              Max: {maxQuantity}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding}
        className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
        style={{
          backgroundColor: isOutOfStock || isAdding ? '#ccc' : '#9B0F06',
          color: 'white'
        }}
        onMouseEnter={(e) => {
          if (!isOutOfStock && !isAdding) {
            e.currentTarget.style.backgroundColor = '#6B0A04';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOutOfStock && !isAdding) {
            e.currentTarget.style.backgroundColor = '#9B0F06';
          }
        }}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Adding...</span>
          </>
        ) : isOutOfStock ? (
          <span>Out of Stock</span>
        ) : isInCart ? (
          <>
            <Check size={16} />
            <span>In Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}