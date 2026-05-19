// lib/order-api.ts - UPDATED WITH ADMIN FUNCTIONS

import { 
  Order, 
  OrdersResponse, 
  OrderResponse, 
  CreateOrderRequest,
  OrderStats,
  UpdateOrderStatusRequest
} from '@/types/order';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to get token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('otp_auth_token');
  }
  return null;
};
  
// Helper for headers
const getHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ========== USER ROUTES ==========

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
      headers: getHeaders(),
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
      headers: getHeaders(),
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
      headers: getHeaders(),
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
      headers: getHeaders(),
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

// Get Order Receipt (JSON)
export async function getOrderReceipt(orderId: string): Promise<any> {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/receipt`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch receipt');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching receipt:', error);
    throw error;
  }
}

// Download Order Receipt PDF
export async function downloadOrderReceiptPDF(orderId: string): Promise<Blob> {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/receipt/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('❌ Error downloading PDF:', error);
    throw error;
  }
}

// ========== ADMIN ROUTES ==========

// Get All Orders (Admin only)
export async function getAllOrders(params?: {
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<OrdersResponse> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const url = `${API_BASE_URL}/api/admin/orders${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    console.log('🔄 Fetching all orders (admin)');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch orders');
    }

    const data: OrdersResponse = await response.json();
    console.log('✅ Orders fetched:', data.orders?.length || 0);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
}

// Get Order Stats (Admin only)
export async function getOrderStats(): Promise<OrderStats> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('🔄 Fetching order stats');
    
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch stats');
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    throw error;
  }
}

// Update Order Status (Admin only)
export async function updateOrderStatus(orderId: string, updateData: UpdateOrderStatusRequest): Promise<Order> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('🔄 Updating order status:', orderId, updateData);
    
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update order status');
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    throw error;
  }
}

// Delete Order (Admin only)
export async function deleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('🔄 Deleting order:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete order');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    throw error;
  }
}

// Process Refund (Admin only)
export async function processRefund(orderId: string, amount?: number, reason?: string): Promise<any> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('🔄 Processing refund for order:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/refund`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process refund');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error processing refund:', error);
    throw error;
  }
}

// Get Admin Order by ID (Admin only - full details)
export async function getAdminOrderById(orderId: string): Promise<Order> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch order');
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('❌ Error fetching admin order:', error);
    throw error;
  }
}