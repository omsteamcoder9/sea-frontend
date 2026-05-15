// lib/order-api.ts - CORRECTED FOR YOUR BACKEND

import { 
  Order, 
  OrdersResponse, 
  OrderResponse, 
  CreateOrderRequest 
} from '@/types/order';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to get token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('otp_auth_token');
  }
  return null;
};

// Create Order (Registered User)
export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required to create order');
    }
    
    console.log('🔄 Creating order:', orderData);
    
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('📡 Create order response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    const data: OrderResponse = await response.json();
    console.log('✅ Order created:', data.order.orderId);
    
    return data;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
}

// Get User's Orders
export async function getUserOrders(): Promise<Order[]> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('🔄 Fetching user orders');
    
    const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch orders');
    }

    const data: OrdersResponse = await response.json();
    console.log('✅ Orders fetched:', data.orders?.length || 0);
    
    return data.orders || [];
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
}

// Get Order by ID
export async function getOrderById(orderId: string): Promise<Order> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('🔄 Fetching order:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch order');
    }

    const data: OrderResponse = await response.json();
    return data.order;
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    throw error;
  }
}

// Cancel Order
export async function cancelOrder(orderId: string, cancellationReason?: string): Promise<Order> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('🔄 Cancelling order:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancellationReason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel order');
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    throw error;
  }
}