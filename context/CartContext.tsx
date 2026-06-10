// CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, ProductVariant } from '@/types/product';
import { Cart, CartItem } from '@/types/cart';
import * as cartAPI from '@/lib/cart';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addingProductId: string | null;
  isGuest: boolean;
  addToCart: (product: Product, quantity: number, selectedVariant?: ProductVariant) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const initialCart: Cart = {
  _id: '',
  user: '',
  items: [],
  totalPrice: 0,
  totalItems: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface CartProviderProps {
  children: ReactNode;
}

// Helper to get or create guest ID (sync with cart.ts)
const getOrCreateGuestId = (): string => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const isGuest = !user;

  // Save guest cart to localStorage (sync with guestId)
  const saveGuestCart = useCallback((guestCart: Cart) => {
    try {
      // Ensure guestId exists (sync with cart.ts)
      getOrCreateGuestId();
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      console.log('🛒 Saved guest cart to localStorage');
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }, []);

  // Refresh cart from backend or localStorage
  const refreshCart = useCallback(async () => {
    console.log('🔄 refreshCart called, isGuest:', isGuest);
    
    if (authLoading) {
      console.log('🔄 Waiting for auth to finish loading');
      return;
    }

    try {
      if (!isGuest && user) {
        // Check if there's a guest cart to merge
        const guestId = localStorage.getItem('guestId');
        const guestCartRaw = localStorage.getItem('guestCart');
        const hasGuestItems = guestCartRaw && JSON.parse(guestCartRaw).items?.length > 0;
        
        if (hasGuestItems && guestId) {
          console.log('🔄 Merging guest cart with user account...', { guestId });
          try {
            const mergedCart = await cartAPI.mergeCart();
            console.log('🔄 Guest cart merged successfully', mergedCart);
            // Clear guest data after successful merge
            localStorage.removeItem('guestCart');
            localStorage.removeItem('guestId');
            setCart(mergedCart);
            return; // Exit early since mergeCart already returns the merged cart
          } catch (mergeError) {
            console.error('Error merging guest cart:', mergeError);
          }
        }
        
        // Fetch user cart
        console.log('🔄 Fetching user cart from API');
        const cartData = await cartAPI.getCart();
        console.log('🔄 Cart data received:', cartData);
        setCart(cartData);
      } else {
        // Guest user - load from localStorage
        console.log('🔄 Loading guest cart from localStorage');
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        } else {
          setCart(initialCart);
        }
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
      if (isGuest) {
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        }
      }
    }
  }, [isGuest, authLoading, user]);

  // Load guest cart on mount
  useEffect(() => {
    if (isGuest && !authLoading) {
      refreshCart();
    }
  }, [isGuest, authLoading, refreshCart]);

  // Refresh cart when auth state changes
  useEffect(() => {
    refreshCart();
  }, [user, authLoading, refreshCart]);

  // Add to cart
  const addToCart = async (product: Product, quantity: number, selectedVariant?: ProductVariant) => {
    console.log('🛒 addToCart called, isGuest:', isGuest);
    console.log('🛒 Product:', product.name, 'Quantity:', quantity, 'Variant:', selectedVariant?.variantName || selectedVariant?.name);
    
    try {
      setAddingProductId(product._id);
      setLoading(true);
      
      if (isGuest) {
        // Ensure guestId exists before adding
        const guestId = getOrCreateGuestId();
        
        // Guest cart logic - also sync with backend via API
        const guestCart = { ...cart };
        
        const existingItemIndex = guestCart.items.findIndex(item => {
          const productId = typeof item.product === 'string' ? item.product : (item.product as any)?._id;
          const variantMatch = !selectedVariant?._id || 
            item.variantId === selectedVariant._id || 
            item.selectedVariant?._id === selectedVariant._id;
          return productId === product._id && (!selectedVariant || variantMatch);
        });
        
        if (existingItemIndex > -1) {
          guestCart.items[existingItemIndex].quantity += quantity;
        } else {
          let variantImage = '';
          if (selectedVariant?.images && selectedVariant.images.length > 0) {
            variantImage = selectedVariant.images[0].image;
          } else if ((product as any).images && (product as any).images.length > 0) {
            variantImage = (product as any).images[0]?.image || '';
          }
          
          const newItem: CartItem = {
            _id: `guest-${Date.now()}-${Math.random()}`,
            product: product._id as any,
            quantity,
            price: selectedVariant?.price || product.basePrice,
            originalPrice: selectedVariant?.originalPrice || product.originalPrice,
            variantId: selectedVariant?._id,
            variantName: selectedVariant?.variantName || selectedVariant?.name,
            productName: product.name,
            productImage: variantImage,
            weight: selectedVariant?.weight || 0,
            weightUnit: selectedVariant?.weightUnit || 'gram',
            selectedVariant: selectedVariant,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          guestCart.items.push(newItem);
        }
        
        guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
        guestCart.totalPrice = guestCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        guestCart.updatedAt = new Date().toISOString();
        
        setCart(guestCart);
        saveGuestCart(guestCart);
        
        // Also try to sync with backend (optional - creates backend guest cart)
        try {
          await cartAPI.addToCart({
            productId: product._id,
            quantity,
            variantId: selectedVariant?._id,
            guestId // Pass guestId to backend
          });
          console.log('🛒 Synced guest cart with backend');
        } catch (backendError) {
          console.log('🛒 Backend sync failed, keeping local guest cart only');
        }
      } else {
        // For authenticated user
        console.log('🛒 Adding to cart for authenticated user');
        
        await cartAPI.addToCart({
          productId: product._id,
          quantity,
          variantId: selectedVariant?._id
        });
        
        const updatedCart = await cartAPI.getCart();
        console.log('🛒 Updated cart after adding:', updatedCart);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
      setAddingProductId(null);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      
      if (isGuest) {
        const guestCart = { ...cart };
        const itemIndex = guestCart.items.findIndex(item => item._id === itemId);
        
        if (itemIndex > -1) {
          if (quantity <= 0) {
            guestCart.items.splice(itemIndex, 1);
          } else {
            guestCart.items[itemIndex].quantity = quantity;
            guestCart.items[itemIndex].updatedAt = new Date().toISOString();
          }
          
          guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
          guestCart.totalPrice = guestCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          guestCart.updatedAt = new Date().toISOString();
          
          setCart(guestCart);
          saveGuestCart(guestCart);
        }
      } else {
        await cartAPI.updateCartItem(itemId, { quantity });
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      
      if (isGuest) {
        const guestCart = { ...cart };
        guestCart.items = guestCart.items.filter(item => item._id !== itemId);
        
        guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
        guestCart.totalPrice = guestCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        guestCart.updatedAt = new Date().toISOString();
        
        setCart(guestCart);
        saveGuestCart(guestCart);
      } else {
        await cartAPI.removeFromCart(itemId);
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      
      if (isGuest) {
        const emptyCart = { ...initialCart };
        emptyCart.updatedAt = new Date().toISOString();
        setCart(emptyCart);
        saveGuestCart(emptyCart);
      } else {
        await cartAPI.clearCart();
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    loading,
    addingProductId,
    isGuest,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};