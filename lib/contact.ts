import { ContactFormData, ContactResponse, ContactsResponse } from '@/types/contact';

// Base URL without /api since routes will add /api prefix
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const contactApi = {
  // Submit contact form
  async submitContact(formData: ContactFormData): Promise<ContactResponse> {
    try {
      // Validate required fields
      if (!formData.subject || !formData.message) {
        throw new Error('Subject and message are required');
      }

      // Prepare data with defaults for optional fields
      const payload = {
        name: formData.name || 'Anonymous',
        email: formData.email || 'No email provided',
        phone: formData.phone || 'No phone provided',
        subject: formData.subject,
        message: formData.message,
      };

      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error formats from backend
        const errorMessage = data.errors 
          ? data.errors.join(', ')
          : data.error 
          ? data.error
          : data.message || 'Failed to submit contact form';
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Submit contact error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred - please check your connection');
    }
  },

  // Get all contacts (for admin panel)
  async getContacts(page: number = 1, limit: number = 10): Promise<ContactsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch contacts');
      }

      // Ensure consistent response structure
      if (data.success && data.data) {
        return {
          success: true,
          message: data.message,
          data: {
            data: Array.isArray(data.data) ? data.data : [],
            pagination: data.pagination || {
              page,
              limit,
              total: 0,
              pages: 0
            }
          }
        };
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get contacts error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Get single contact
  async getContact(id: string): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch contact');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get contact error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Update contact status
  async updateContactStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update contact');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update contact error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Delete contact
  async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete contact');
      }

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Delete contact error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },
};