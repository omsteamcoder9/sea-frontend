// types/settings.ts

export interface PublicSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  cashOnDeliveryEnabled: boolean;
  siteName: string;
  contactEmail: string;
  contactNumber: string;
}

export interface AdminSettings extends PublicSettings {
  razorpayKeySecret: string;
  updatedAt: string;
  createdAt: string;
}

export interface SettingsAPIResponse {
  success: boolean;
  message?: string;
  data: PublicSettings | AdminSettings;
}

export interface SettingsFormData {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  cashOnDeliveryEnabled: boolean;
  siteName: string;
  contactEmail: string;
  contactNumber: string;
}