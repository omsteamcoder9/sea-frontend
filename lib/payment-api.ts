// lib/payment-api.ts
import { RazorpayOrder, PaymentVerification, PaymentVerificationResponse } from '@/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000

// Create Razorpay Order
export async function createRazorpayOrder(orderId: string): Promise<RazorpayOrder> {
  try {
    console.log('Creating Razorpay order with orderId:', orderId);
    
    // ✅ Add /api/ to the URL
    const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Razorpay order: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create Razorpay order');
    }

    return {
      id: data.order.id,
      amount: data.order.amount,
      currency: data.order.currency,
      receipt: data.order.receipt,
      status: data.order.status,
      key: data.key
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

// Verify Payment
export async function verifyPayment(paymentData: PaymentVerification): Promise<PaymentVerificationResponse> {
  try {
    console.log('Verifying payment:', paymentData);
    
    // ✅ Add /api/ to the URL
    const response = await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    console.log('Verification response:', data);
    
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

// Payment Failed Handler
export async function paymentFailed(razorpay_order_id: string): Promise<boolean> {
  try {
    console.log('Marking payment as failed:', razorpay_order_id);
    
    // ✅ Add /api/ to the URL
    const response = await fetch(`${API_BASE_URL}/api/payments/payment-failed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ razorpay_order_id }),
    });

    if (!response.ok) {
      throw new Error('Failed to mark payment as failed');
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error marking payment as failed:', error);
    throw error;
  }
}

// Get Payment Status
export async function getPaymentStatus(orderId: string, token: string): Promise<any> {
  try {
    // ✅ Add /api/ to the URL
    const response = await fetch(`${API_BASE_URL}/api/payments/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
}