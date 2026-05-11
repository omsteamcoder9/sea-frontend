// lib/privacy.ts
import { PrivacyFormData, PrivacyResponse, PrivacyListResponse } from '@/types/privacy';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const privacyApi = {
  // Get latest privacy policy (public)
  async getPrivacy(): Promise<PrivacyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/privacy`, {
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
          : data.message || 'Failed to fetch privacy policy';
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get privacy error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred - please check your connection');
    }
  },

  // Get specific version of privacy policy (public)
  async getPrivacyByVersion(version: number): Promise<PrivacyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/privacy/version/${version}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Failed to fetch privacy policy version ${version}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get privacy by version error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Get all versions of privacy policy (admin only)
  async getAllVersions(): Promise<PrivacyListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/privacy/admin/versions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch privacy policy versions');
      }

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

  // Create or update privacy policy (creates new version) (admin only)
  async createOrUpdatePrivacy(formData: PrivacyFormData): Promise<PrivacyResponse> {
    try {
      if (!formData.privacyPolicyTitle) {
        throw new Error('Privacy Policy Title is required');
      }

      const payload = {
        privacyPolicyTitle: formData.privacyPolicyTitle || 'Privacy Policy',
        privacyPolicyLastUpdated: formData.privacyPolicyLastUpdated || new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        privacyIntroduction: formData.privacyIntroduction || 'This Privacy Policy describes how we collect, use, and handle your personal information when you use our website and services.',
        privacyDataCollection: formData.privacyDataCollection || [
          'Name and contact information (email, phone number, address)',
          'Account credentials (username, password)',
          'Payment information (processed securely by third-party providers)',
          'Order history and preferences',
          'Device information (IP address, browser type, operating system)',
          'Usage data (pages visited, time spent, interactions)'
        ],
        privacyDataUsage: formData.privacyDataUsage || [
          'Process and fulfill your orders',
          'Communicate with you about your account or orders',
          'Send you marketing communications (with your consent)',
          'Improve and optimize our website and services',
          'Detect and prevent fraud or security issues',
          'Comply with legal obligations'
        ],
        privacyDataSharing: formData.privacyDataSharing || [
          'Service providers (payment processors, shipping carriers, email services)',
          'Legal authorities (when required by law or to protect our rights)',
          'Business transfers (in case of merger, acquisition, or sale)',
          'Third-party analytics providers (Google Analytics, etc.)'
        ],
        privacyDataSecurity: formData.privacyDataSecurity || 'We implement appropriate technical and organizational measures to protect your personal information, including encryption, secure servers, access controls, and regular security assessments.',
        privacyUserRights: formData.privacyUserRights || [
          'Access your personal data',
          'Correct inaccurate or incomplete data',
          'Request deletion of your data',
          'Object to or restrict data processing',
          'Data portability',
          'Withdraw consent at any time'
        ],
        privacyCookies: formData.privacyCookies || 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content.',
        privacyThirdPartyLinks: formData.privacyThirdPartyLinks || 'Our website may contain links to third-party websites. We are not responsible for their privacy practices.',
        privacyPolicyChanges: formData.privacyPolicyChanges || 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page.',
        privacyContactInfo: formData.privacyContactInfo || 'If you have any questions about this Privacy Policy, please contact us through the information provided in our website footer.',
        privacySections: formData.privacySections || []
      };

      const response = await fetch(`${API_BASE_URL}/api/privacy`, {
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
          : data.message || 'Failed to create/update privacy policy';
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Create/update privacy error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred - please check your connection');
    }
  },

  // Update specific section (admin only)
  async updateSection(sectionNumber: number, title?: string, content?: string): Promise<PrivacyResponse> {
    try {
      const payload: { title?: string; content?: string } = {};
      if (title) payload.title = title;
      if (content) payload.content = content;

      const response = await fetch(`${API_BASE_URL}/api/privacy/section/${sectionNumber}`, {
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

  // Update data collection (admin only)
  async updateDataCollection(privacyDataCollection: string[]): Promise<PrivacyResponse> {
    try {
      if (!Array.isArray(privacyDataCollection)) {
        throw new Error('Data collection must be an array');
      }

      const response = await fetch(`${API_BASE_URL}/api/privacy/data-collection`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privacyDataCollection }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update data collection');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update data collection error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Delete privacy policy (admin only)
  async deletePrivacy(privacyId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/privacy/${privacyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete privacy policy');
      }

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Delete privacy error:', error.message);
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },
};