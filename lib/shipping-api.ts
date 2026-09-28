// lib/shipping-api.ts
import {
  Shipping,
  ShippingPayload,
  ShippingResponse,
  ShippingListResponse,
  DeleteShippingResponse,
} from '@/types/shipping';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000

// ============================================
// 🌐 PUBLIC — for frontend /shipping page
// ============================================
export async function getShipping(): Promise<ShippingResponse> {
  try {
    console.log('Fetching shipping info...');

    const response = await fetch(`${API_BASE_URL}/api/shipping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shipping info: ${response.status}`);
    }

    const data: ShippingResponse = await response.json();
    console.log('Shipping fetch response:', data);

    return data;
  } catch (error) {
    console.error('Error fetching shipping info:', error);
    throw error;
  }
}

// ============================================
// 🔐 ADMIN — CRUD
// ============================================

// Get shipping by ID
export async function getShippingById(id: string, token: string): Promise<ShippingResponse> {
  try {
    console.log('Fetching shipping info by ID:', id);

    const response = await fetch(`${API_BASE_URL}/api/admin/shipping/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shipping info: ${response.status}`);
    }

    const data: ShippingResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shipping info by ID:', error);
    throw error;
  }
}

// Create shipping info
export async function createShipping(
  payload: ShippingPayload,
  token: string
): Promise<ShippingResponse> {
  try {
    console.log('Creating shipping info:', payload);

    const response = await fetch(`${API_BASE_URL}/api/admin/shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create shipping info: ${response.status}`);
    }

    const data: ShippingResponse = await response.json();
    console.log('Create shipping response:', data);

    return data;
  } catch (error) {
    console.error('Error creating shipping info:', error);
    throw error;
  }
}

// Update shipping info
export async function updateShipping(
  id: string,
  payload: ShippingPayload,
  token: string
): Promise<ShippingResponse> {
  try {
    console.log('Updating shipping info:', id, payload);

    const response = await fetch(`${API_BASE_URL}/api/admin/shipping/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update shipping info: ${response.status}`);
    }

    const data: ShippingResponse = await response.json();
    console.log('Update shipping response:', data);

    return data;
  } catch (error) {
    console.error('Error updating shipping info:', error);
    throw error;
  }
}

// Delete shipping info
export async function deleteShipping(id: string, token: string): Promise<DeleteShippingResponse> {
  try {
    console.log('Deleting shipping info:', id);

    const response = await fetch(`${API_BASE_URL}/api/admin/shipping/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete shipping info: ${response.status}`);
    }

    const data: DeleteShippingResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting shipping info:', error);
    throw error;
  }
}

// ============================================
// 📦 Grouped export (matches your pattern)
// ============================================
export const shippingAPI = {
  // Public
  getShipping,

  // Admin
  getShippingById,
  createShipping,
  updateShipping,
  deleteShipping,
};