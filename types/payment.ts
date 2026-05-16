// types/payment.ts

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  key?: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  order?: {
    _id: string;
    orderId: string;
    finalAmount: number;
    paymentStatus: string;
    orderStatus: string;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: {
    _id: string;
    orderId: string;
    finalAmount: number;
    paymentMethod: string;
    requiresPayment: boolean;
    products?: any[];
  };
  requiresPayment: boolean;
}