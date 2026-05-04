// order-api.ts - FULLY CORRECTED AND ENHANCED
import { 
  Order, 
  OrdersResponse, 
  OrderResponse, 
  CreateOrderRequest,
  GuestOrderRequest,
  UpdateOrderStatusRequest 
} from '@/types/order';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUserOrders(token: string): Promise<Order[]> {
  try {
    console.log('🔄 Fetching orders from:', `${API_BASE_URL}/orders/my-orders`);
    
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
    }

    const data: OrdersResponse = await response.json();
    console.log('✅ Backend response:', { success: data.success, count: data.orders?.length || 0 });
    
    // ✅ FIXED: Use 'orders' instead of 'data'
    return data.orders || [];
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string, token: string): Promise<Order> {
  try {
    console.log('🔄 Fetching order details for:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch order: ${response.status} - ${errorText}`);
    }

    const data: OrderResponse = await response.json();
    console.log('✅ Order details fetched successfully');
    
    // ✅ FIXED: Use 'order' instead of 'data'
    return data.order;
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    throw error;
  }
}

export async function createOrder(
  orderData: CreateOrderRequest, 
  token: string
): Promise<{ success: boolean; order: Order; message: string; requiresPayment?: boolean }> {
  try {
    console.log('🔄 Creating new order');
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
      credentials: 'include'
    });

    console.log('📡 Create order response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Order created successfully:', { 
      orderId: data.order?.orderId,
      requiresPayment: data.requiresPayment 
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
}

export async function createGuestOrder(
  orderData: GuestOrderRequest
): Promise<{ success: boolean; order: Order; message: string; requiresPayment?: boolean }> {
  try {
    console.log('🔄 Creating guest order');
    
    const response = await fetch(`${API_BASE_URL}/payments/guest-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
      credentials: 'include'
    });

    console.log('📡 Create guest order response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create guest order: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Guest order created successfully:', { 
      orderId: data.order?.orderId,
      requiresPayment: data.requiresPayment 
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error creating guest order:', error);
    throw error;
  }
}

export async function cancelOrder(
  orderId: string, 
  token: string, 
  cancellationReason?: string
): Promise<Order> {
  try {
    console.log('🔄 Cancelling order:', orderId);
    
    // ✅ FIXED: Using Partial to make all properties optional
    const requestBody: { cancellationReason?: string } = {};
    if (cancellationReason) {
      requestBody.cancellationReason = cancellationReason;
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include'
    });

    console.log('📡 Cancel response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to cancel order: ${response.status} - ${errorText}`);
    }

    const data: OrderResponse = await response.json();
    console.log('✅ Order cancelled successfully:', { orderId: data.order.orderId });
    
    return data.order;
  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string, 
  statusData: UpdateOrderStatusRequest, 
  token: string
): Promise<Order> {
  try {
    console.log('🔄 Updating order status for:', orderId, statusData);
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
      credentials: 'include'
    });

    console.log('📡 Update status response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update order status: ${response.status} - ${errorText}`);
    }

    const data: OrderResponse = await response.json();
    console.log('✅ Order status updated successfully');
    
    return data.order;
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    throw error;
  }
}

export async function getOrderReceipt(
  orderId: string, 
  token: string, 
  format: 'json' | 'pdf' = 'json'
): Promise<Blob | any> {
  try {
    console.log('🔄 Getting order receipt for:', orderId, 'format:', format);
    
    const url = `${API_BASE_URL}/orders/${orderId}/receipt${format === 'pdf' ? '/pdf' : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': format === 'pdf' ? 'application/pdf' : 'application/json',
      },
      credentials: 'include'
    });

    console.log('📡 Receipt response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get receipt: ${response.status} - ${errorText}`);
    }

    if (format === 'pdf') {
      const pdfBlob = await response.blob();
      console.log('✅ PDF receipt received:', pdfBlob.size, 'bytes');
      return pdfBlob;
    } else {
      const data = await response.json();
      console.log('✅ JSON receipt received');
      return data;
    }
  } catch (error) {
    console.error('❌ Error getting order receipt:', error);
    throw error;
  }
}

export async function getOrderByOrderId(orderId: string): Promise<Order> {
  try {
    console.log('🔄 Getting order by orderId:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/orders/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch order by orderId: ${response.status} - ${errorText}`);
    }

    const data: OrderResponse = await response.json();
    console.log('✅ Order fetched successfully by orderId');
    
    return data.order;
  } catch (error) {
    console.error('❌ Error fetching order by orderId:', error);
    throw error;
  }
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: 'success' | 'failed',
  paymentId?: string
): Promise<Order> {
  try {
    console.log('🔄 Updating payment status for order:', orderId, paymentStatus);
    
    const endpoint = paymentStatus === 'success' 
      ? `${API_BASE_URL}/orders/payment-success`
      : `${API_BASE_URL}/orders/payment-failed`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        orderId, 
        ...(paymentId && { paymentId }) 
      }),
      credentials: 'include'
    });

    console.log('📡 Payment status update response:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update payment status: ${response.status} - ${errorText}`);
    }

    const data: OrderResponse = await response.json();
    console.log('✅ Payment status updated successfully');
    
    return data.order;
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    throw error;
  }
}