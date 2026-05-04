import { ContactFormData, ContactResponse, ContactsResponse } from '@/types/contact';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const contactApi = {
  // Submit contact form
  async submitContact(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.join(', ') || 'Failed to submit contact form');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Get all contacts (for admin panel)
  async getContacts(page: number = 1, limit: number = 10): Promise<ContactsResponse> {
    const response = await fetch(`${API_BASE_URL}/contacts?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }

    return response.json();
  },

  // Get single contact
  async getContact(id: string): Promise<ContactResponse> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }

    return response.json();
  },

  // Update contact status
  async updateContactStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<ContactResponse> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update contact');
    }

    return response.json();
  },

  // Delete contact
  async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete contact');
    }

    return response.json();
  },
};