// types/order.ts - COMPLETE UPDATED VERSION WITH WEIGHT

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
  // ✅ ADD WEIGHT FIELDS
  weight?: number;
  weightUnit?: string;
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
    phone?: string;
  };
  
  // Products
  products: OrderItem[];
  
  // Shipping - WITH EMAIL
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
  };
  
  // Ward Info
  wardId?: number | null;
  wardName?: string | null;
  deliveryZone?: string;
  
  // Payment
  paymentMethod: 'cod' | 'razorpay' | 'card';
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;
  
  // Refund Info
  refundStatus?: 'pending' | 'completed' | 'failed' | 'not_applicable';
  refundMessage?: string;
  refundedAt?: string | null;
  
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
    email: string;
  };
  paymentMethod: 'cod' | 'razorpay' | 'card';
  paymentId?: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
  requiresPayment?: boolean;
}

// Admin Types
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Array<{ _id: string; count: number }>;
  ordersByPaymentStatus: Array<{ _id: string; count: number }>;
  recentOrders: Order[];
}

export interface UpdateOrderStatusRequest {
  orderStatus?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  cancellationReason?: string;
}