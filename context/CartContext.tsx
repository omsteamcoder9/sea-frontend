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

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
const { user, isLoading: authLoading } = useAuth();
  const isGuest = !user;

  // Refresh cart from backend or localStorage
  const refreshCart = useCallback(async () => {
    console.log('🔄 refreshCart called, isGuest:', isGuest);
    
    if (authLoading) {
      console.log('🔄 Waiting for auth to finish loading');
      return;
    }

    try {
      if (!isGuest && user) {
        // Authenticated user - fetch from API
        console.log('🔄 Fetching user cart from API');
        const cartData = await cartAPI.getCart();
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

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((guestCart: Cart) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      console.log('🛒 Saved guest cart to localStorage');
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }, []);

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
    
    try {
      setAddingProductId(product._id);
      setLoading(true);
      
      if (isGuest) {
        // Guest cart logic
        const guestCart = { ...cart };
        
        const existingItemIndex = guestCart.items.findIndex(
          item => item.product === product._id || (item.product as any)?._id === product._id
        );
        
        if (existingItemIndex > -1) {
          guestCart.items[existingItemIndex].quantity += quantity;
        } else {
          const newItem: CartItem = {
            _id: `guest-${Date.now()}-${Math.random()}`,
            product: product._id as any,
            quantity,
            price: selectedVariant?.price || product.basePrice,
            originalPrice: selectedVariant?.originalPrice || product.originalPrice,
            variantId: selectedVariant?._id,
            variantName: selectedVariant?.variantName,
            productName: product.name,
            productImage: product.images?.[0]?.image,
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
      } else {
        // Authenticated user - call API
        const updatedCart = await cartAPI.addToCart({
          productId: product._id,
          quantity,
          variantId: selectedVariant?._id
        });
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