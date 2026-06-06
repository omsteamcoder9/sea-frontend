import { Cart, AddToCartData, UpdateCartItemData, AddToCartResponse, CartResponse } from '@/types/cart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('otp_auth_token');
  }
  return null;
};

// Helper function to get or create guest ID
const getGuestId = (): string => {
  if (typeof window !== 'undefined') {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  }
  return '';
};

// Helper function to handle API errors
const handleApiError = async (response: Response, defaultMessage: string) => {
  if (!response.ok) {
    let errorMessage = defaultMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

// Get Cart (supports both authenticated and guest)
export async function getCart(): Promise<Cart> {
  const token = getToken();
  const guestId = getGuestId();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = token 
    ? `${API_BASE_URL}/api/cart`
    : `${API_BASE_URL}/api/cart?guestId=${guestId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
    // credentials: 'include',
  });

  await handleApiError(response, 'Failed to fetch cart');
  const result: CartResponse = await response.json();
  return result.data;
}

// Add to Cart (supports both authenticated and guest)
export async function addToCart(cartData: AddToCartData): Promise<Cart> {
  const token = getToken();
  const guestId = getGuestId();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add guestId to request body if not authenticated
  const requestBody = token 
    ? cartData 
    : { ...cartData, guestId };

  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
    // credentials: 'include',
  });

  await handleApiError(response, 'Failed to add item to cart');
  const result: AddToCartResponse = await response.json();
  
  // Save guestId if returned from server (for new guests)
  if (result.guestId && !token) {
    localStorage.setItem('guestId', result.guestId);
  }
  
  return result.data;
}

// Update Cart Item Quantity
export async function updateCartItem(itemId: string, updateData: UpdateCartItemData): Promise<Cart> {
  const token = getToken();
  const guestId = getGuestId();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add guestId to request body if not authenticated
  const requestBody = token 
    ? updateData 
    : { ...updateData, guestId };

  const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(requestBody),
    // credentials: 'include',
  });

  await handleApiError(response, 'Failed to update cart item');
  const result: CartResponse = await response.json();
  return result.data;
}

// Remove Item from Cart
export async function removeFromCart(itemId: string): Promise<Cart> {
  const token = getToken();
  const guestId = getGuestId();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add guestId to request body if not authenticated
  const requestBody = token ? {} : { guestId };

  const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(requestBody),
    // credentials: 'include',
  });

  await handleApiError(response, 'Failed to remove item from cart');
  const result: CartResponse = await response.json();
  return result.data;
}

// Clear Cart
// Clear Cart
export async function clearCart(): Promise<Cart> {
  const token = getToken();
  const guestId = getGuestId();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Use different endpoint for guests
  const url = token 
    ? `${API_BASE_URL}/api/cart`
    : `${API_BASE_URL}/api/cart/guest`;

  const requestBody = token ? {} : { guestId };

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(requestBody),
  });

  await handleApiError(response, 'Failed to clear cart');
  const result: CartResponse = await response.json();
  return result.data;
}
// Merge guest cart with user cart after login
export async function mergeCart(): Promise<Cart> {
  const token = getToken();
  const guestId = getGuestId();
  
  if (!token) {
    throw new Error('Authentication required to merge cart');
  }

  if (!guestId) {
    // No guest cart to merge
    return await getCart();
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}/api/cart/merge`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ guestId }),
    // credentials: 'include',
  });

  await handleApiError(response, 'Failed to merge cart');
  const result: CartResponse = await response.json();
  
  // Clear guest ID after successful merge
  localStorage.removeItem('guestId');
  
  return result.data;
}