import { RazorpayOrder, PaymentVerification } from '@/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PaymentVerificationResponse {
  success: boolean;
  order: Record<string, unknown>; // Changed from any
  message: string;
  shipment?: {
    success: boolean;
    message: string;
    data?: {
      shipmentId: string;
      awbNumber: string;
      courierName: string;
      status: string;
      labelUrl: string;
      manifestUrl: string;
    };
    error?: string;
    note?: string;
  };
}

/* -------------------------------------------------------------------------- */
/* 🧩 1. Create Guest Order (returns orderId for Razorpay)                   */
/* -------------------------------------------------------------------------- */
export async function createGuestOrder(orderData: Record<string, unknown>): Promise<{ orderId: string; finalAmount: number }> {
  try {
    console.log('Creating guest order:', orderData);
    
    const response = await fetch(`${API_BASE_URL}/payments/guest-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Guest order creation response error:', errorText);
      throw new Error('Failed to create guest order');
    }

    const data = await response.json();
    console.log('Guest order creation response:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create guest order');
    }

    // FIXED: Use the correct response structure from backend
    const orderId = data.order?.orderId || data.data?.orderId || data.orderId;
    const finalAmount = data.order?.finalAmount || data.data?.finalAmount || data.finalAmount;

    if (!orderId) {
      console.error('Missing orderId in response:', data);
      throw new Error('Invalid order response: missing orderId');
    }

    if (!finalAmount && finalAmount !== 0) {
      console.error('Missing finalAmount in response:', data);
      throw new Error('Invalid order response: missing finalAmount');
    }

    return {
      orderId: orderId,
      finalAmount: finalAmount
    };
  } catch (error) {
    console.error('Error creating guest order:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 🧩 2. Create User Order (for registered users)                            */
/* -------------------------------------------------------------------------- */
export async function createUserOrder(orderData: Record<string, unknown>, token: string): Promise<{ orderId: string; finalAmount: number }> {
  try {
    console.log('Creating user order:', orderData);
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('User order creation response error:', errorText);
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    console.log('User order creation response:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create order');
    }

    // FIXED: Use the correct response structure from backend
    const orderId = data.order?.orderId || data.data?.orderId || data.orderId;
    const finalAmount = data.order?.finalAmount || data.data?.finalAmount || data.finalAmount;

    if (!orderId) {
      console.error('Missing orderId in response:', data);
      throw new Error('Invalid order response: missing orderId');
    }

    if (!finalAmount && finalAmount !== 0) {
      console.error('Missing finalAmount in response:', data);
      throw new Error('Invalid order response: missing finalAmount');
    }

    return {
      orderId: orderId,
      finalAmount: finalAmount
    };
  } catch (error) {
    console.error('Error creating user order:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 🧩 3. Create Razorpay Order (with orderId from database)                  */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 🧩 3. Create Razorpay Order (with orderId from database)                  */
/* -------------------------------------------------------------------------- */
export async function createRazorpayOrder(orderId: string): Promise<RazorpayOrder> {
  try {
    console.log('Creating Razorpay order with orderId:', orderId);
    
    // ✅ FIRST: Fetch payment settings to get Razorpay key
    const settingsResponse = await fetch(`${API_BASE_URL}/settings/public`);
    if (!settingsResponse.ok) {
      throw new Error('Failed to fetch payment settings');
    }
    
    const settingsData = await settingsResponse.json();
    console.log('Payment settings:', settingsData);
    
    if (!settingsData.success || !settingsData.data) {
      throw new Error('Invalid settings response');
    }
    
    const paymentSettings = settingsData.data;
    
    // ✅ Check if Razorpay is enabled
    if (!paymentSettings.razorpayEnabled) {
      throw new Error('Razorpay payments are currently disabled');
    }
    
    // ✅ Check if Razorpay key ID is available
    if (!paymentSettings.razorpayKeyId) {
      throw new Error('Razorpay configuration is incomplete');
    }
    
    console.log('Razorpay Key ID from settings:', paymentSettings.razorpayKeyId);
    
    // ✅ NOW create Razorpay order with orderId
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        orderId,
        // ✅ Optionally pass the key ID if backend needs it
        razorpayKeyId: paymentSettings.razorpayKeyId 
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response error:', errorText);
      throw new Error(`Failed to create Razorpay order: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Razorpay order response:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create Razorpay order');
    }

    // FIXED: Return the correct structure that Razorpay expects
    return {
      ...data.order,
      // ✅ Make sure the response includes the key for frontend
      key: paymentSettings.razorpayKeyId
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 🧩 4. Verify Payment                                                      */
/* -------------------------------------------------------------------------- */
export async function verifyPayment(paymentData: PaymentVerification): Promise<PaymentVerificationResponse> {
  try {
    console.log('Verifying payment:', paymentData);
    
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Verification response error:', errorText);
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    console.log('Verification response:', data);
    
    // Return the full response including shipment data
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 🧩 6. Payment Failed Handler                                              */
/* -------------------------------------------------------------------------- */
export async function paymentFailed(razorpay_order_id: string): Promise<boolean> {
  try {
    console.log('Marking payment as failed:', razorpay_order_id);
    
    const response = await fetch(`${API_BASE_URL}/payments/failed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ razorpay_order_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Payment failed response error:', errorText);
      throw new Error('Failed to mark payment as failed');
    }

    const data = await response.json();
    console.log('Payment failed response:', data);
    
    return data.success === true;
  } catch (error) {
    console.error('Error marking payment as failed:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 🧩 7. Track Shipment                                                      */
/* -------------------------------------------------------------------------- */
export async function trackShipment(shipmentId: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(`${API_BASE_URL}/shipping/track/${shipmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tracking response error:', errorText);
      throw new Error('Failed to track shipment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw error;
  }
}