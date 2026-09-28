// types/shipping.ts

export interface DeliveryPromise {
  title: string;
  description: string;
}

export interface DeliveryArea {
  _id?: string;
  areaName: string;
  timing: string;
}

export interface ChargeTier {
  _id?: string;
  label: string;
  amount: string;
}

export interface ShippingCharges {
  isFree: boolean;
  freeShippingMessage: string;
  freeShippingDescription: string;
  chargeTiers?: ChargeTier[];
}

export interface Packaging {
  title: string;
  items: string[];
}

export interface OrderTracking {
  title: string;
  description: string;
  highlight: string;
}

export interface Shipping {
  _id: string;
  title: string;
  headerBadge: string;
  headerSubtitle: string;
  deliveryPromise: DeliveryPromise;
  deliveryAreas: DeliveryArea[];
  shippingCharges: ShippingCharges;
  packaging: Packaging;
  orderTracking: OrderTracking;
  isActive: boolean;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Payload sent when creating/updating
export interface ShippingPayload {
  title: string;
  headerBadge: string;
  headerSubtitle: string;
  deliveryPromise: DeliveryPromise;
  deliveryAreas: DeliveryArea[];
  shippingCharges: ShippingCharges;
  packaging: Packaging;
  orderTracking: OrderTracking;
}

// API Response types
export interface ShippingResponse {
  success: boolean;
  data: Shipping;
  message?: string;
}

export interface ShippingListResponse {
  success: boolean;
  data: Shipping[];
  message?: string;
}

export interface DeleteShippingResponse {
  success: boolean;
  message: string;
}