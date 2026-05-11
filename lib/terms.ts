// lib/terms.ts
import { TermsFormData, TermsResponse, TermsListResponse } from '@/types/terms';

// Base URL without /api since routes will add /api prefix
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const termsApi = {
  // Get latest terms of service (public)
  async getTerms(): Promise<TermsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/terms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors 
          ? data.errors.join(', ')
          : data.error 
          ? data.error
          : data.message || 'Failed to fetch terms of service';
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get terms error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred - please check your connection');
    }
  },

  // Get specific version of terms (public)
  async getTermsByVersion(version: number): Promise<TermsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/terms/version/${version}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Failed to fetch terms version ${version}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get terms by version error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Get all versions of terms (admin only)
  async getAllVersions(): Promise<TermsListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/terms/admin/versions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch terms versions');
      }

      // Ensure consistent response structure
      if (data.success && data.data) {
        return {
          success: true,
          message: data.message,
          data: Array.isArray(data.data) ? data.data : [],
          count: data.count
        };
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get all versions error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Create or update terms (creates new version) (admin only)
  async createOrUpdateTerms(formData: TermsFormData): Promise<TermsResponse> {
    try {
      // Validate required fields
      if (!formData.termsOfServiceTitle) {
        throw new Error('Terms of Service Title is required');
      }

      // Prepare payload with defaults
      const payload = {
        termsOfServiceTitle: formData.termsOfServiceTitle || 'Terms of Service',
        termsOfServiceLastUpdated: formData.termsOfServiceLastUpdated || new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        termsImportantNotice: formData.termsImportantNotice || 'These Terms of Service govern your use of our website and services. By using our website, you acknowledge that you have read, understood, and agree to be bound by these terms.',
        termsUserRequirements: formData.termsUserRequirements || [
          'You must be at least 18 years old to place an order',
          'Payment processing is handled by secure third-party providers',
          'All product images are for illustrative purposes only',
          'Shipping times are estimates and not guarantees',
          'We reserve the right to refuse service to anyone'
        ],
        termsSections: formData.termsSections || [],
        termsIntellectualProperty: formData.termsIntellectualProperty || 'All content on this Website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by copyright and other intellectual property laws.',
        termsLimitationLiability: formData.termsLimitationLiability || 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.',
        termsChangesNotice: formData.termsChangesNotice || 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.',
        termsContactInfo: formData.termsContactInfo || 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'
      };

      const response = await fetch(`${API_BASE_URL}/api/terms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors 
          ? data.errors.join(', ')
          : data.error 
          ? data.error
          : data.message || 'Failed to create/update terms of service';
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Create/update terms error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred - please check your connection');
    }
  },

  // Update specific section (admin only)
  async updateSection(sectionNumber: number, title?: string, content?: string): Promise<TermsResponse> {
    try {
      const payload: { title?: string; content?: string } = {};
      if (title) payload.title = title;
      if (content) payload.content = content;

      const response = await fetch(`${API_BASE_URL}/api/terms/section/${sectionNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Failed to update section ${sectionNumber}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update section error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Update user requirements (admin only)
  async updateRequirements(termsUserRequirements: string[]): Promise<TermsResponse> {
    try {
      if (!Array.isArray(termsUserRequirements)) {
        throw new Error('Requirements must be an array');
      }

      const response = await fetch(`${API_BASE_URL}/api/terms/requirements`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ termsUserRequirements }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update requirements');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update requirements error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Delete terms (admin only)
  async deleteTerms(termsId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/terms/${termsId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete terms');
      }

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Delete terms error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },
};