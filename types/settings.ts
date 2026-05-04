// types/settings.ts

export interface ReturnProcessStep {
  title: string;
  description: string;
}

export interface TermsSection {
  number: number;
  title: string;
  content: string;
}

export interface PublicSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  cashOnDeliveryEnabled: boolean;
  
  // BUSINESS INFORMATION - ADDED
  gstinNumber: string;
  
  // BANK ACCOUNT DETAILS
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: string;
  bankBranch: string;
  ifscCode: string;
  swiftCode: string;
  bankAddress: string;
  micrCode: string;
  upiId: string;
  
  // NEW DIGITAL PAYMENT FIELDS
  phonePeNumber: string;
  googlePayNumber: string;
  phonePeQrImage: string;
  googlePayQrImage: string;
  
  contactNumber: string;
  whatsappNumber: string;
  callNumber: string;
  contactEmail: string;
  companyAddress: string;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  footerText: string;
  footerLinks: Array<{
    name: string;
    url: string;
  }>;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  maintenanceMode: boolean;
  metaKeywords: string[];
  googleAnalyticsId: string;
  
  // Shipping Settings
  shippingInfo: string;
  orderProcessingTime: string;
  standardShippingDelivery: string;
  standardShippingCost: string;
  standardFreeShippingThreshold: string;
  expressShippingDelivery: string;
  expressShippingCost: string;
  expressFreeShippingThreshold: string;
  overnightShippingDelivery: string;
  overnightShippingCost: string;
  internationalShippingDelivery: string;
  internationalShippingNote: string;
  
  // Returns & Refunds Policy Settings
  returnsPolicyTitle: string;
  returnsPolicyDescription: string;
  returnProcessSteps: ReturnProcessStep[];
  returnTimeframe: string;
  returnConditions: string[];
  customerShippingResponsibility: string;
  nonReturnableItems: string[];
  defectiveItemsNote: string;
  refundProcessingTime: string;
  refundNote: string;
  refundAmountFormula: string;
  refundAmountDescription: string;
  exchangePolicy: string;
  
  // Privacy Policy Settings
  privacyPolicyTitle: string;
  privacyPolicyLastUpdated: string;
  privacyPolicyEffectiveImmediately: boolean;
  privacyPolicyIntroduction: string;
  dataWeCollect: string[];
  howWeUseInformation: string[];
  privacyIntroductionSection: string;
  informationWeCollectSection: string;
  howWeUseInformationSection: string;
  dataSecuritySection: string;
  dataProtectionRightsSection: string;
  contactUsSection: string;
  dataProtectionRightsList: string[];
  securityMeasuresSection: string;
  
  // Terms of Service Settings
  termsOfServiceTitle: string;
  termsOfServiceLastUpdated: string;
  termsImportantNotice: string;
  termsUserRequirements: string[];
  termsSections: TermsSection[];
  termsIntellectualProperty: string;
  termsLimitationLiability: string;
  termsChangesNotice: string;
  termsContactInfo: string;
  
  // SCRIPT TAGS SETTINGS
  headerScripts: string;
  bodyScripts: string;
  footerScripts: string;
}

export interface AdminSettings extends PublicSettings {
  razorpayKeySecret: string;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface SettingsAPIResponse {
  success: boolean;
  message?: string;
  data: PublicSettings | AdminSettings;
}

export interface RazorpayValidationResponse {
  success: boolean;
  message: string;
  valid: boolean;
}

export interface SettingsFormData {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  cashOnDeliveryEnabled: boolean;
  
  // BUSINESS INFORMATION - ADDED
  gstinNumber: string;
  
  // BANK ACCOUNT DETAILS
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: string;
  bankBranch: string;
  ifscCode: string;
  swiftCode: string;
  bankAddress: string;
  micrCode: string;
  upiId: string;
  
  // NEW DIGITAL PAYMENT FIELDS
  phonePeNumber: string;
  googlePayNumber: string;
  phonePeQrImage: string;
  googlePayQrImage: string;
  
  contactNumber: string;
  whatsappNumber: string;
  callNumber: string;
  contactEmail: string;
  companyAddress: string;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  footerText: string;
  footerLinks: Array<{
    name: string;
    url: string;
  }>;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  maintenanceMode: boolean;
  metaKeywords: string[];
  googleAnalyticsId: string;
  
  // Shipping Settings
  shippingInfo: string;
  orderProcessingTime: string;
  standardShippingDelivery: string;
  standardShippingCost: string;
  standardFreeShippingThreshold: string;
  expressShippingDelivery: string;
  expressShippingCost: string;
  expressFreeShippingThreshold: string;
  overnightShippingDelivery: string;
  overnightShippingCost: string;
  internationalShippingDelivery: string;
  internationalShippingNote: string;
  
  // Returns & Refunds Policy Settings
  returnsPolicyTitle: string;
  returnsPolicyDescription: string;
  returnProcessSteps: ReturnProcessStep[];
  returnTimeframe: string;
  returnConditions: string[];
  customerShippingResponsibility: string;
  nonReturnableItems: string[];
  defectiveItemsNote: string;
  refundProcessingTime: string;
  refundNote: string;
  refundAmountFormula: string;
  refundAmountDescription: string;
  exchangePolicy: string;
  
  // Privacy Policy Settings
  privacyPolicyTitle: string;
  privacyPolicyLastUpdated: string;
  privacyPolicyEffectiveImmediately: boolean;
  privacyPolicyIntroduction: string;
  dataWeCollect: string[];
  howWeUseInformation: string[];
  privacyIntroductionSection: string;
  informationWeCollectSection: string;
  howWeUseInformationSection: string;
  dataSecuritySection: string;
  dataProtectionRightsSection: string;
  contactUsSection: string;
  dataProtectionRightsList: string[];
  securityMeasuresSection: string;
  
  // Terms of Service Settings
  termsOfServiceTitle: string;
  termsOfServiceLastUpdated: string;
  termsImportantNotice: string;
  termsUserRequirements: string[];
  termsSections: TermsSection[];
  termsIntellectualProperty: string;
  termsLimitationLiability: string;
  termsChangesNotice: string;
  termsContactInfo: string;
  
  // SCRIPT TAGS SETTINGS
  headerScripts: string;
  bodyScripts: string;
  footerScripts: string;
}

export interface SettingsState extends PublicSettings {
  loading: boolean;
  saving: boolean;
  error: string | null;
}

// Individual settings interfaces for API methods
export interface ShippingSettings {
  shippingInfo: string;
  orderProcessingTime: string;
  standardShippingDelivery: string;
  standardShippingCost: string;
  standardFreeShippingThreshold: string;
  expressShippingDelivery: string;
  expressShippingCost: string;
  expressFreeShippingThreshold: string;
  overnightShippingDelivery: string;
  overnightShippingCost: string;
  internationalShippingDelivery: string;
  internationalShippingNote: string;
}

export interface ReturnsPolicySettings {
  returnsPolicyTitle: string;
  returnsPolicyDescription: string;
  returnProcessSteps: ReturnProcessStep[];
  returnTimeframe: string;
  returnConditions: string[];
  customerShippingResponsibility: string;
  nonReturnableItems: string[];
  defectiveItemsNote: string;
  refundProcessingTime: string;
  refundNote: string;
  refundAmountFormula: string;
  refundAmountDescription: string;
  exchangePolicy: string;
}

export interface PrivacyPolicySettings {
  privacyPolicyTitle: string;
  privacyPolicyLastUpdated: string;
  privacyPolicyEffectiveImmediately: boolean;
  privacyPolicyIntroduction: string;
  dataWeCollect: string[];
  howWeUseInformation: string[];
  privacyIntroductionSection: string;
  informationWeCollectSection: string;
  howWeUseInformationSection: string;
  dataSecuritySection: string;
  dataProtectionRightsSection: string;
  contactUsSection: string;
  dataProtectionRightsList: string[];
  securityMeasuresSection: string;
}

export interface TermsOfServiceSettings {
  termsOfServiceTitle: string;
  termsOfServiceLastUpdated: string;
  termsImportantNotice: string;
  termsUserRequirements: string[];
  termsSections: TermsSection[];
  termsIntellectualProperty: string;
  termsLimitationLiability: string;
  termsChangesNotice: string;
  termsContactInfo: string;
}

// Business Information Settings interface - ADDED
export interface BusinessInfoSettings {
  gstinNumber: string;
}

// Bank Account Settings interface
export interface BankAccountSettings {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: string;
  bankBranch: string;
  ifscCode: string;
  swiftCode: string;
  bankAddress: string;
  micrCode: string;
  upiId: string;
}

// Digital Payment Settings interface
export interface DigitalPaymentSettings {
  phonePeNumber: string;
  googlePayNumber: string;
  phonePeQrImage: string;
  googlePayQrImage: string;
}

// Script Tags Settings interface
export interface ScriptTagsSettings {
  headerScripts: string;
  bodyScripts: string;
  footerScripts: string;
}

// Payment Settings interface
export interface PaymentSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  cashOnDeliveryEnabled: boolean;
}

// General Settings interface
export interface GeneralSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  maintenanceMode: boolean;
  metaKeywords: string[];
  googleAnalyticsId: string;
}

// Contact Settings interface
export interface ContactSettings {
  contactNumber: string;
  whatsappNumber: string;
  callNumber: string;
  contactEmail: string;
  companyAddress: string;
}

// Social Media Settings interface
export interface SocialMediaSettings {
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
}

// Footer Settings interface
export interface FooterSettings {
  footerText: string;
  footerLinks: Array<{
    name: string;
    url: string;
  }>;
}