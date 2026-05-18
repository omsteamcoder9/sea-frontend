// lib/settings-api.ts
import { 
  SettingsFormData, 
  SettingsAPIResponse, 
  transformFrontendToBackend,
  transformBackendToFrontend 
} from '@/types/settings';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000

export const settingsAPI = {
  // Get public settings (no authentication required)
  getPublicSettings: async (): Promise<SettingsAPIResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching public settings:', error);
      throw error;
    }
  },
  
  // Get all settings (admin only)
  getAllSettings: async (): Promise<SettingsAPIResponse> => {
    try {
      const token = localStorage.getItem('otp_auth_token');
      
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all settings:', error);
      throw error;
    }
  },
  
  // Get all settings and transform to frontend format (admin only)
  getAllSettingsFormatted: async (): Promise<SettingsFormData> => {
    try {
      const response = await settingsAPI.getAllSettings();
      if (response.success && response.data) {
        return transformBackendToFrontend(response.data);
      }
      throw new Error('Failed to fetch settings');
    } catch (error) {
      console.error('Error fetching formatted settings:', error);
      throw error;
    }
  },
  
  // Update settings (admin only)
  updateSettings: async (settingsData: SettingsFormData): Promise<SettingsAPIResponse> => {
    try {
      const token = localStorage.getItem('otp_auth_token');
      const backendData = transformFrontendToBackend(settingsData);
      
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform response data to frontend format if needed
      if (data.success && data.data) {
        data.data = transformBackendToFrontend(data.data);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
  
  // Update settings with raw data (if you already have backend format)
  updateSettingsRaw: async (settingsData: any): Promise<SettingsAPIResponse> => {
    try {
      const token = localStorage.getItem('otp_auth_token');
      
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
};