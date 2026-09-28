// types/order.ts - COMPLETE UPDATED VERSION WITH WARD TYPES

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
  weight?: number;
  weightUnit?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  sNo: number;

  name: string;              // ✅ customer name (top-level)

  user: string | {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };

  products: OrderItem[];

  shippingAddress: {
    name: string;            // ✅ NEW
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
        alternatePhone?: string;   // ✅ NEW — optional

    email: string;
  };

  wardId?: number | null;
  wardName?: string | null;
  deliveryZone?: string;

  paymentMethod: 'cod' | 'razorpay' | 'card';
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;

  refundStatus?: 'pending' | 'completed' | 'failed' | 'not_applicable';
  refundMessage?: string;
  refundedAt?: string | null;

  totalAmount: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;

  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cancelledAt?: string;
  cancellationReason?: string;
  deliveredAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: {
    name: string;            // ✅ NEW
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
        alternatePhone?: string;   // ✅ NEW — optional

    email: string;
  };
  paymentMethod: 'cod' | 'razorpay' | 'card';
  paymentId?: string;
  skipCartClear?: boolean;
  products?: any[];
  deliveryMode?: 'karaikudi' | 'other';
  typedArea?: string;        // ✅ used by backend for ward matching
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

// ✅ Ward Types
export interface Ward {
  wardId: number;
  wardName: string;
  streets: string[];
  centroid?: {
    lat: number;
    lon: number;
  };
}

export interface WardData {
  municipality: string;
  state: string;
  country: string;
  totalWards: number;
  wards: Ward[];
}

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