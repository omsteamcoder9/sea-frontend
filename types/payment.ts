export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Add new interface for shipment data
export interface ShipmentData {
  shipmentId: string;
  awbNumber: string;
  courierName: string;
  status: string;
  labelUrl: string;
  manifestUrl: string;
}

// Define an interface for the order object in the response
export interface OrderInResponse {
  _id: string;
  orderId: string;
  userId?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product: string | {
      _id: string;
      name: string;
      slug: string;
    };
    quantity: number;
    selectedSize?: string;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone: string;
  };
  totalAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  order: OrderInResponse;
  message: string;
  shipment?: {
    success: boolean;
    message: string;
    data?: ShipmentData;
    error?: string;
    note?: string;
  };
}