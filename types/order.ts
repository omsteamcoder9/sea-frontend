// types/order.ts - UPDATED TO MATCH BACKEND MODELS
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string; // ✅ CORRECT: Backend uses single 'image' string
    // Backend Product model has 'images' array but we get 'image' from transform
  };
  quantity: number;
  price: number; // ✅ Actual price paid
  originalPrice?: number; // ✅ ADDED: For discount display
  discountPercentage?: number; // ✅ ADDED: Discount info
  name?: string; // ✅ Backend includes name for display
  
  // ✅ VARIANT SUPPORT - Check if backend includes these
  variantId?: string; // Check if order model has this
  variantName?: string; // Check if order model has this
  
  // ✅ COLOR AND SIZE - Check if backend includes these
  selectedColor?: string; // Backend cart has 'selectedColor' as string
  selectedSize?: string;
  
  // ✅ ADDED: Product image from variant or main product
  image?: string;
  
  // ✅ ADDED: SKU for inventory tracking
  sku?: string;
}

export interface Order {
  _id: string;
  orderId: string; // ✅ Backend uses 'orderId'
  sNo?: number; // ✅ ADDED: Serial number field
  
  // ✅ USER REFERENCES - Backend has multiple user references
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  guestUser?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  
  // ✅ GUEST ORDER FLAG
  isGuestOrder?: boolean;
  
  // ✅ PRODUCTS ARRAY - Backend uses 'products' not 'items'
  products: OrderItem[];
  
  // ✅ AMOUNT FIELDS - Backend has multiple amount fields
  totalAmount: number; // ✅ Subtotal before tax/shipping
  subtotal?: number; // ✅ ADDED: Price before discounts
  discountAmount?: number; // ✅ ADDED: Total discount
  shippingFee?: number;
  taxAmount?: number;
  finalAmount?: number; // ✅ Total after all adjustments
  
  // ✅ PAYMENT FIELDS - Backend uses these
  razorpayOrderId?: string;
  paymentId?: string;
  paymentSignature?: string;
  
  // ✅ SHIPPING ADDRESS - Backend structure
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    fullName?: string; // ✅ Backend has fullName
    email?: string; // ✅ ADDED: For guest orders
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode?: string; // ✅ Some orders use pincode
    postalCode?: string; // ✅ Some orders use postalCode
    country: string;
  };
  
  // ✅ PAYMENT INFO - Backend enums
  paymentMethod: 'razorpay' | 'stripe' | 'cod' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'partially_refunded';
  
  // ✅ SHIPPING FIELDS - For ShipRocket integration
  shipmentId?: string;
  shippingStatus?: string;
  awbNumber?: string;
  courierName?: string;
  
  // ✅ TIMESTAMPS
  paidAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // ✅ CANCELLATION INFO
  cancelledBy?: string;
  cancellationReason?: string;
  
  // ✅ REFUND HISTORY
  refunds?: Array<{
    refundId: string;
    amount: number;
    razorpayPaymentId: string;
    type: 'full' | 'partial';
    createdAt: string;
    notes?: any;
  }>;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  message?: string;
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

export interface CreateOrderRequest {
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    fullName: string;
    email?: string; // ✅ ADDED: For guest orders
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'razorpay' | 'stripe' | 'cod' | 'paypal';
  paymentId?: string; // For Razorpay/Stripe
  products?: Array<{ // For direct order creation (guest orders)
    product: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
    price?: number; // Optional, will use product/variant price
  }>;
}

export interface GuestOrderRequest extends CreateOrderRequest {
  guestUser: {
    name: string;
    email: string;
    phone: string;
  };
  products: Array<{
    product: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusRequest {
  orderStatus: Order['orderStatus'];
  cancellationReason?: string;
}

export interface CancelOrderRequest {
  cancellationReason?: string;
}