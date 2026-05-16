// lib/settings-api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000

export const settingsAPI = {
  // Get public settings (no authentication required)
  getPublicSettings: async () => {
    try {
      // ✅ Add /api/ to the URL
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
  getAllSettings: async () => {
    try {
      const token = localStorage.getItem('otp_auth_token');
      
      // ✅ Add /api/ to the URL
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
  
  // Update settings (admin only)
  updateSettings: async (settingsData: any) => {
    try {
      const token = localStorage.getItem('otp_auth_token');
      
      // ✅ Add /api/ to the URL
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