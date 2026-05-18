// types/settings.ts

export interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
}

export interface FooterLink {
  name: string;
  url: string;
}

export interface PublicSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  cashOnDeliveryEnabled: boolean;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  contactNumber: string;
  companyAddress: string;
  socialMedia: SocialMedia;
  footerText: string;
  footerLinks: FooterLink[];
  metaKeywords: string[];
  googleAnalyticsId: string;
  maintenanceMode: boolean;
  // Frontend compatible fields
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

export interface AdminSettings extends PublicSettings {
  razorpayKeySecret: string;
  headerScripts: string;
  bodyScripts: string;
  footerScripts: string;
  updatedAt: string;
  createdAt: string;
}

export interface SettingsAPIResponse {
  success: boolean;
  message?: string;
  data: PublicSettings | AdminSettings;
}

export interface SettingsFormData {
  // General settings
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  maintenanceMode: boolean;
  
  // Payment settings
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  cashOnDeliveryEnabled: boolean;
  
  // Contact info
  contactNumber: string;
  contactEmail: string;
  companyAddress: string;
  
  // Social media (frontend format)
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  
  // Footer
  footerText: string;
  footerLinks: FooterLink[];
  
  // SEO
  metaKeywords: string[];
  googleAnalyticsId: string;
  
  // Scripts
  headerScripts: string;
  bodyScripts: string;
  footerScripts: string;
}

// Helper function to transform backend data to frontend format
export const transformBackendToFrontend = (data: any): SettingsFormData => {
  return {
    // General settings
    siteName: data.siteName || '',
    siteTitle: data.siteTitle || '',
    siteDescription: data.siteDescription || '',
    maintenanceMode: data.maintenanceMode || false,
    
    // Payment settings
    razorpayEnabled: data.razorpayEnabled || false,
    razorpayKeyId: data.razorpayKeyId || '',
    razorpayKeySecret: data.razorpayKeySecret || '',
    cashOnDeliveryEnabled: data.cashOnDeliveryEnabled || true,
    
    // Contact info
    contactNumber: data.contactNumber || '',
    contactEmail: data.contactEmail || '',
    companyAddress: data.companyAddress || '',
    
    // Social media
    facebookUrl: data.facebookUrl || data.socialMedia?.facebook || '',
    twitterUrl: data.twitterUrl || data.socialMedia?.twitter || '',
    instagramUrl: data.instagramUrl || data.socialMedia?.instagram || '',
    youtubeUrl: data.youtubeUrl || data.socialMedia?.youtube || '',
    linkedinUrl: data.linkedinUrl || data.socialMedia?.linkedin || '',
    
    // Footer
    footerText: data.footerText || '',
    footerLinks: data.footerLinks || [],
    
    // SEO
    metaKeywords: data.metaKeywords || [],
    googleAnalyticsId: data.googleAnalyticsId || '',
    
    // Scripts
    headerScripts: data.headerScripts || '',
    bodyScripts: data.bodyScripts || '',
    footerScripts: data.footerScripts || '',
  };
};

// Helper function to transform frontend data to backend format
export const transformFrontendToBackend = (data: SettingsFormData) => {
  return {
    // General settings
    siteName: data.siteName,
    siteTitle: data.siteTitle,
    siteDescription: data.siteDescription,
    maintenanceMode: data.maintenanceMode,
    
    // Payment settings
    razorpayEnabled: data.razorpayEnabled,
    razorpayKeyId: data.razorpayKeyId,
    razorpayKeySecret: data.razorpayKeySecret,
    cashOnDeliveryEnabled: data.cashOnDeliveryEnabled,
    
    // Contact info
    contactNumber: data.contactNumber,
    contactEmail: data.contactEmail,
    companyAddress: data.companyAddress,
    
    // Social media (individual fields - backend will map to socialMedia object)
    facebookUrl: data.facebookUrl,
    twitterUrl: data.twitterUrl,
    instagramUrl: data.instagramUrl,
    youtubeUrl: data.youtubeUrl,
    linkedinUrl: data.linkedinUrl,
    
    // Footer
    footerText: data.footerText,
    footerLinks: data.footerLinks,
    
    // SEO
    metaKeywords: data.metaKeywords,
    googleAnalyticsId: data.googleAnalyticsId,
    
    // Scripts
    headerScripts: data.headerScripts,
    bodyScripts: data.bodyScripts,
    footerScripts: data.footerScripts,
  };
};