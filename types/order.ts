// types/order.ts - CORRECTED FOR YOUR BACKEND

export interface OrderItem {
  product: string | {
    _id: string;
    name: string;
    price?: number;
    image?: string;
  };
  variantId?: string | null;
  variantName?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  name?: string;
  image?: string;
  _id?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  sNo: number;
  
  // User
  user: string | {
    _id: string;
    name: string;
    email: string;
  };
  
  // Products
  products: OrderItem[];
  
  // Shipping
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  
  // Ward Info
  wardId?: number | null;
  wardName?: string | null;
  deliveryZone?: string;
  
  // Payment
  paymentMethod: 'cod' | 'razorpay' | 'card';
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paidAt?: string;
  
  // Amounts
  totalAmount: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  
  // Status
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cancelledAt?: string;
  cancellationReason?: string;
  deliveredAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'cod' | 'razorpay' | 'card';
  paymentId?: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
  requiresPayment?: boolean;
}