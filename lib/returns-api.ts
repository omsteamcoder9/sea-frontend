// lib/returns-api.ts
import {
  Return,
  ReturnPayload,
  ReturnResponse,
  ReturnListResponse,
  DeleteReturnResponse,
} from '@/types/returns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000

// ============================================
// 🌐 PUBLIC — for frontend /returns page
// ============================================
export async function getReturnPolicy(): Promise<ReturnResponse> {
  try {
    console.log('Fetching return policy...');

    const response = await fetch(`${API_BASE_URL}/api/returns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch return policy: ${response.status}`);
    }

    const data: ReturnResponse = await response.json();
    console.log('Returns fetch response:', data);

    return data;
  } catch (error) {
    console.error('Error fetching return policy:', error);
    throw error;
  }
}

// ============================================
// 🔐 ADMIN — CRUD
// ============================================

// Get return policy by ID
export async function getReturnPolicyById(id: string, token: string): Promise<ReturnResponse> {
  try {
    console.log('Fetching return policy by ID:', id);

    const response = await fetch(`${API_BASE_URL}/api/admin/returns/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch return policy: ${response.status}`);
    }

    const data: ReturnResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching return policy by ID:', error);
    throw error;
  }
}

// Create return policy
export async function createReturnPolicy(
  payload: ReturnPayload,
  token: string
): Promise<ReturnResponse> {
  try {
    console.log('Creating return policy:', payload);

    const response = await fetch(`${API_BASE_URL}/api/admin/returns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create return policy: ${response.status}`);
    }

    const data: ReturnResponse = await response.json();
    console.log('Create return response:', data);

    return data;
  } catch (error) {
    console.error('Error creating return policy:', error);
    throw error;
  }
}

// Update return policy
export async function updateReturnPolicy(
  id: string,
  payload: ReturnPayload,
  token: string
): Promise<ReturnResponse> {
  try {
    console.log('Updating return policy:', id, payload);

    const response = await fetch(`${API_BASE_URL}/api/admin/returns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update return policy: ${response.status}`);
    }

    const data: ReturnResponse = await response.json();
    console.log('Update return response:', data);

    return data;
  } catch (error) {
    console.error('Error updating return policy:', error);
    throw error;
  }
}

// Delete return policy
export async function deleteReturnPolicy(
  id: string,
  token: string
): Promise<DeleteReturnResponse> {
  try {
    console.log('Deleting return policy:', id);

    const response = await fetch(`${API_BASE_URL}/api/admin/returns/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete return policy: ${response.status}`);
    }

    const data: DeleteReturnResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting return policy:', error);
    throw error;
  }
}

// ============================================
// 📦 Grouped export (matches your pattern)
// ============================================
export const returnsAPI = {
  // Public
  getReturnPolicy,

  // Admin
  getReturnPolicyById,
  createReturnPolicy,
  updateReturnPolicy,
  deleteReturnPolicy,
};