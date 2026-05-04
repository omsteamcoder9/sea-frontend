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
}

export default function AddToCartButton({ 
  product, 
  selectedVariant,
  quantity: externalQuantity,
  onQuantityChange
}: AddToCartButtonProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);
  const quantity = externalQuantity !== undefined ? externalQuantity : internalQuantity;
  const setQuantity = onQuantityChange || setInternalQuantity;  
  const { addToCart, loading, addingProductId, cart } = useCart();

  const isAdding = loading && addingProductId === product._id;

  // ✅ FIXED: Properly check for same variant in cart
  const isInCart = cart?.items?.some(item => {
    // Handle product that could be string or object
    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    const sameProduct = productId === product._id;
    
    // Check variant using available fields
    const itemVariantId = item.selectedVariant?._id || item.variantId;
    const selectedVariantId = selectedVariant?._id || selectedVariant?.variantName;
    const sameVariant = !selectedVariantId || itemVariantId === selectedVariantId;
    
    return sameProduct && sameVariant;
  }) || false;

  // Get max quantity based on variant or product stock
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

  return (
    <div className="space-y-3">
      {/* Quantity Selector - Only show if product is in stock */}
      {!isOutOfStock && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Qty:</span>
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

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding}
        className="w-full py-2 px-4 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed shadow cursor-pointer text-sm"
      >
        <div className="min-w-[120px] flex items-center justify-center gap-2">
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
        </div>
      </button>
    </div>
  );
}