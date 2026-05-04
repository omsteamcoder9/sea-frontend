// lib/settings-api.ts
import { AdminSettings, SettingsAPIResponse, RazorpayValidationResponse, SettingsFormData } from '@/types/settings';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const settingsAPI = {
  // Get public settings (no authentication required)
  getPublicSettings: async (): Promise<SettingsAPIResponse> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Public settings response:', data); // Debug
      return data; // Direct response
    } catch (error) {
      console.error('Error fetching public settings:', error);
      throw error;
    }
  },
  
  // Get all settings (admin only)
  getAllSettings: async (): Promise<SettingsAPIResponse> => {
    try {
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${API_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('All settings response:', data); // Debug
      return data; // Direct response
    } catch (error) {
      console.error('Error fetching all settings:', error);
      throw error;
    }
  },
  
  // Update settings (admin only)
  updateSettings: async (settingsData: Partial<SettingsFormData>): Promise<SettingsAPIResponse> => {
    try {
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${API_URL}/settings`, {
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
      return data; // Direct response
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
  
  // Delete QR code (admin only)
  deleteQrCode: async (type: 'phonePeQrImage' | 'googlePayQrImage'): Promise<SettingsAPIResponse> => {
    try {
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${API_URL}/settings/qr-code/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data; // Direct response
    } catch (error) {
      console.error('Error deleting QR code:', error);
      throw error;
    }
  },
  
  // Upload QR code (admin only)
  uploadQrCode: async (type: 'phonePeQrImage' | 'googlePayQrImage', file: File): Promise<SettingsAPIResponse> => {
    try {
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token') || '';
      
      const formData = new FormData();
      formData.append(type, file);
      
      const response = await fetch(`${API_URL}/settings/qr-code/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header for FormData, browser will set it automatically
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data; // Direct response
    } catch (error) {
      console.error('Error uploading QR code:', error);
      throw error;
    }
  },
  
  // Validate Razorpay Key ID (admin only)
  validateRazorpayKey: async (razorpayKeyId: string): Promise<RazorpayValidationResponse> => {
    try {
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${API_URL}/settings/validate-razorpay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ razorpayKeyId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data; // Direct response
    } catch (error) {
      console.error('Error validating razorpay key:', error);
      throw error;
    }
  },
  
  // Get contact information settings only (public)
  getContactInfo: async (): Promise<{
    contactNumber: string;
    whatsappNumber: string;
    callNumber: string;
    contactEmail: string;
    companyAddress: string;
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    youtubeUrl: string; // ADDED
    linkedinUrl: string;
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract contact info from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          contactNumber: settings.contactNumber || '+91 1234567890',
          whatsappNumber: settings.whatsappNumber || '+91 1234567890',
          callNumber: settings.callNumber || '+91 1234567890',
          contactEmail: settings.contactEmail || 'contact@example.com',
          companyAddress: settings.companyAddress || '123 Street, City, Country',
          facebookUrl: settings.facebookUrl || '',
          twitterUrl: settings.twitterUrl || '',
          instagramUrl: settings.instagramUrl || '',
          youtubeUrl: settings.youtubeUrl || '', // ADDED
          linkedinUrl: settings.linkedinUrl || ''
        };
      }
      throw new Error('Failed to fetch contact information');
    } catch (error) {
      console.error('Error fetching contact information:', error);
      // Return default contact info if API fails
      return {
        contactNumber: '+91 1234567890',
        whatsappNumber: '+91 1234567890',
        callNumber: '+91 1234567890',
        contactEmail: 'contact@example.com',
        companyAddress: '123 Street, City, Country',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youtubeUrl: '', // ADDED
        linkedinUrl: ''
      };
    }
  },

  // Get GSTIN information (public) - ADDED
  getGstinInfo: async (): Promise<{
    gstinNumber: string;
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract GSTIN info from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          gstinNumber: settings.gstinNumber || ''
        };
      }
      throw new Error('Failed to fetch GSTIN information');
    } catch (error) {
      console.error('Error fetching GSTIN information:', error);
      // Return empty GSTIN info if API fails
      return {
        gstinNumber: ''
      };
    }
  },

  // Get bank account details (public)
  getBankAccountDetails: async (): Promise<{
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
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract bank account details from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          bankName: settings.bankName || '',
          accountHolderName: settings.accountHolderName || '',
          accountNumber: settings.accountNumber || '',
          accountType: settings.accountType || 'Savings',
          bankBranch: settings.bankBranch || '',
          ifscCode: settings.ifscCode || '',
          swiftCode: settings.swiftCode || '',
          bankAddress: settings.bankAddress || '',
          micrCode: settings.micrCode || '',
          upiId: settings.upiId || ''
        };
      }
      throw new Error('Failed to fetch bank account details');
    } catch (error) {
      console.error('Error fetching bank account details:', error);
      // Return empty bank account details if API fails
      return {
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        accountType: 'Savings',
        bankBranch: '',
        ifscCode: '',
        swiftCode: '',
        bankAddress: '',
        micrCode: '',
        upiId: ''
      };
    }
  },
  
  // Get shipping settings only (public)
  getShippingSettings: async (): Promise<{
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
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract shipping settings from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          shippingInfo: settings.shippingInfo || '',
          orderProcessingTime: settings.orderProcessingTime || '',
          standardShippingDelivery: settings.standardShippingDelivery || '',
          standardShippingCost: settings.standardShippingCost || '',
          standardFreeShippingThreshold: settings.standardFreeShippingThreshold || '',
          expressShippingDelivery: settings.expressShippingDelivery || '',
          expressShippingCost: settings.expressShippingCost || '',
          expressFreeShippingThreshold: settings.expressFreeShippingThreshold || '',
          overnightShippingDelivery: settings.overnightShippingDelivery || '',
          overnightShippingCost: settings.overnightShippingCost || '',
          internationalShippingDelivery: settings.internationalShippingDelivery || '',
          internationalShippingNote: settings.internationalShippingNote || ''
        };
      }
      throw new Error('Failed to fetch shipping settings');
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
      // Return default shipping settings if API fails
      return {
        shippingInfo: 'Learn about our shipping policies, delivery times, and tracking information',
        orderProcessingTime: 'All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.',
        standardShippingDelivery: '5-7 business days',
        standardShippingCost: '$4.99',
        standardFreeShippingThreshold: '$50',
        expressShippingDelivery: '2-3 business days',
        expressShippingCost: '$9.99',
        expressFreeShippingThreshold: '$100',
        overnightShippingDelivery: '1 business day',
        overnightShippingCost: '$19.99',
        internationalShippingDelivery: '10-15 business days',
        internationalShippingNote: 'International shipping costs vary by destination. You\'ll see the exact shipping cost at checkout.'
      };
    }
  },
  
  // Get returns policy settings only (public)
  getReturnsPolicySettings: async (): Promise<{
    returnsPolicyTitle: string;
    returnsPolicyDescription: string;
    returnProcessSteps: Array<{ title: string; description: string }>;
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
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract returns policy settings from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          returnsPolicyTitle: settings.returnsPolicyTitle || 'Returns & Refunds Policy',
          returnsPolicyDescription: settings.returnsPolicyDescription || 'We want you to be completely satisfied with your purchase. Here\'s everything you need to know about returns and refunds.',
          returnProcessSteps: settings.returnProcessSteps || [],
          returnTimeframe: settings.returnTimeframe || '30 days from the delivery date',
          returnConditions: settings.returnConditions || [],
          customerShippingResponsibility: settings.customerShippingResponsibility || 'Return shipping costs are the responsibility of the customer, unless the return is due to our error (wrong item shipped, defective item, etc.).',
          nonReturnableItems: settings.nonReturnableItems || [],
          defectiveItemsNote: settings.defectiveItemsNote || 'If you receive a defective or damaged item, please contact us immediately. We will arrange for a replacement or refund, and cover all return shipping costs.',
          refundProcessingTime: settings.refundProcessingTime || '5-10 business days',
          refundNote: settings.refundNote || 'It may take additional time for the refund to appear on your credit card statement, depending on your bank\'s processing time.',
          refundAmountFormula: settings.refundAmountFormula || 'Refund Amount = Item Price - Shipping Costs',
          refundAmountDescription: settings.refundAmountDescription || 'You will receive a full refund for the item price, minus any shipping costs. Original shipping fees are non-refundable.',
          exchangePolicy: settings.exchangePolicy || 'We currently do not offer direct exchanges. To exchange an item, please return the original item for a refund and place a new order for the desired item.'
        };
      }
      throw new Error('Failed to fetch returns policy settings');
    } catch (error) {
      console.error('Error fetching returns policy settings:', error);
      // Return default returns policy settings if API fails
      return {
        returnsPolicyTitle: 'Returns & Refunds Policy',
        returnsPolicyDescription: 'We want you to be completely satisfied with your purchase. Here\'s everything you need to know about returns and refunds.',
        returnProcessSteps: [
          {
            title: 'Initiate Return',
            description: 'Contact our customer service within 30 days of delivery to request a return authorization.'
          },
          {
            title: 'Package Item',
            description: 'Package the item securely in its original packaging with all accessories and documentation.'
          },
          {
            title: 'Ship Return',
            description: 'Ship the item back to us using a trackable shipping method. Return shipping is customer\'s responsibility.'
          },
          {
            title: 'Receive Refund',
            description: 'Once we receive and inspect the item, we\'ll process your refund within 5-10 business days.'
          }
        ],
        returnTimeframe: '30 days from the delivery date',
        returnConditions: [
          'Items must be unworn, unused, and unwashed',
          'Original packaging must be intact',
          'All tags and labels must be attached',
          'Accessories and documentation must be included'
        ],
        customerShippingResponsibility: 'Return shipping costs are the responsibility of the customer, unless the return is due to our error (wrong item shipped, defective item, etc.).',
        nonReturnableItems: [
          'Personalized or customized items',
          'Downloadable software products',
          'Gift cards',
          'Intimate apparel (for hygiene reasons)',
          'Items damaged due to misuse or improper care',
          'Final sale items (clearly marked as such)'
        ],
        defectiveItemsNote: 'If you receive a defective or damaged item, please contact us immediately. We will arrange for a replacement or refund, and cover all return shipping costs.',
        refundProcessingTime: '5-10 business days',
        refundNote: 'It may take additional time for the refund to appear on your credit card statement, depending on your bank\'s processing time.',
        refundAmountFormula: 'Refund Amount = Item Price - Shipping Costs',
        refundAmountDescription: 'You will receive a full refund for the item price, minus any shipping costs. Original shipping fees are non-refundable.',
        exchangePolicy: 'We currently do not offer direct exchanges. To exchange an item, please return the original item for a refund and place a new order for the desired item.'
      };
    }
  },

  // Get privacy policy settings only (public)
  getPrivacyPolicySettings: async (): Promise<{
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
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract privacy policy settings from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          privacyPolicyTitle: settings.privacyPolicyTitle || 'Privacy Policy',
          privacyPolicyLastUpdated: settings.privacyPolicyLastUpdated || '2026',
          privacyPolicyEffectiveImmediately: settings.privacyPolicyEffectiveImmediately !== undefined ? settings.privacyPolicyEffectiveImmediately : true,
          privacyPolicyIntroduction: settings.privacyPolicyIntroduction || 'We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.',
          dataWeCollect: settings.dataWeCollect || [],
          howWeUseInformation: settings.howWeUseInformation || [],
          privacyIntroductionSection: settings.privacyIntroductionSection || 'Welcome to our website. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at the email provided in our contact information.',
          informationWeCollectSection: settings.informationWeCollectSection || 'We collect personal information that you voluntarily provide to us when you register on our website, place an order, subscribe to our newsletter, contact us with inquiries, or participate in promotions or surveys. The personal information we collect may include your name, email address, phone number, shipping address, and payment information.',
          howWeUseInformationSection: settings.howWeUseInformationSection || 'We use the information we collect for various purposes, including to process and fulfill your orders, send you order confirmations and updates, respond to your inquiries and provide customer support, send you marketing communications (with your consent), improve our website and services, and prevent fraud and enhance security.',
          dataSecuritySection: settings.dataSecuritySection || 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.',
          dataProtectionRightsSection: settings.dataProtectionRightsSection || 'Depending on your location, you may have rights regarding your personal data including: the right to access your personal data, the right to rectification of inaccurate data, the right to erasure of your data, the right to restrict processing, the right to data portability, and the right to object to processing.',
          contactUsSection: settings.contactUsSection || 'If you have questions or comments about this policy, you may contact us at the email or phone number provided in our website footer.',
          dataProtectionRightsList: settings.dataProtectionRightsList || [],
          securityMeasuresSection: settings.securityMeasuresSection || 'We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. While we strive to protect your personal information, no method of transmission over the Internet is 100% secure.'
        };
      }
      throw new Error('Failed to fetch privacy policy settings');
    } catch (error) {
      console.error('Error fetching privacy policy settings:', error);
      // Return default privacy policy settings if API fails
      return {
        privacyPolicyTitle: 'Privacy Policy',
        privacyPolicyLastUpdated: '2026',
        privacyPolicyEffectiveImmediately: true,
        privacyPolicyIntroduction: 'We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.',
        dataWeCollect: [
          'Name and contact details',
          'Shipping and billing addresses',
          'Payment information',
          'Order history',
          'Communication preferences',
          'Device and usage information'
        ],
        howWeUseInformation: [
          'Order processing and fulfillment',
          'Customer support',
          'Marketing communications',
          'Website improvement',
          'Fraud prevention',
          'Legal compliance'
        ],
        privacyIntroductionSection: 'Welcome to our website. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at the email provided in our contact information.',
        informationWeCollectSection: 'We collect personal information that you voluntarily provide to us when you register on our website, place an order, subscribe to our newsletter, contact us with inquiries, or participate in promotions or surveys. The personal information we collect may include your name, email address, phone number, shipping address, and payment information.',
        howWeUseInformationSection: 'We use the information we collect for various purposes, including to process and fulfill your orders, send you order confirmations and updates, respond to your inquiries and provide customer support, send you marketing communications (with your consent), improve our website and services, and prevent fraud and enhance security.',
        dataSecuritySection: 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.',
        dataProtectionRightsSection: 'Depending on your location, you may have rights regarding your personal data including: the right to access your personal data, the right to rectification of inaccurate data, the right to erasure of your data, the right to restrict processing, the right to data portability, and the right to object to processing.',
        contactUsSection: 'If you have questions or comments about this policy, you may contact us at the email or phone number provided in our website footer.',
        dataProtectionRightsList: [
          'Right to access',
          'Right to rectification',
          'Right to erasure',
          'Right to restrict processing',
          'Right to data portability',
          'Right to object'
        ],
        securityMeasuresSection: 'We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. While we strive to protect your personal information, no method of transmission over the Internet is 100% secure.'
      };
    }
  },

  // Get terms of service settings only (public)
  getTermsOfServiceSettings: async (): Promise<{
    termsOfServiceTitle: string;
    termsOfServiceLastUpdated: string;
    termsImportantNotice: string;
    termsUserRequirements: string[];
    termsSections: Array<{ number: number; title: string; content: string }>;
    termsIntellectualProperty: string;
    termsLimitationLiability: string;
    termsChangesNotice: string;
    termsContactInfo: string;
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract terms of service settings from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          termsOfServiceTitle: settings.termsOfServiceTitle || 'Terms of Service',
          termsOfServiceLastUpdated: settings.termsOfServiceLastUpdated || '2026',
          termsImportantNotice: settings.termsImportantNotice || 'These Terms of Service govern your use of our website and services. By using our website, you acknowledge that you have read, understood, and agree to be bound by these terms.',
          termsUserRequirements: settings.termsUserRequirements || [],
          termsSections: settings.termsSections || [],
          termsIntellectualProperty: settings.termsIntellectualProperty || 'All content on this Website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by copyright and other intellectual property laws.',
          termsLimitationLiability: settings.termsLimitationLiability || 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.',
          termsChangesNotice: settings.termsChangesNotice || 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.',
          termsContactInfo: settings.termsContactInfo || 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'
        };
      }
      throw new Error('Failed to fetch terms of service settings');
    } catch (error) {
      console.error('Error fetching terms of service settings:', error);
      // Return default terms of service settings if API fails
      return {
        termsOfServiceTitle: 'Terms of Service',
        termsOfServiceLastUpdated: '2026',
        termsImportantNotice: 'These Terms of Service govern your use of our website and services. By using our website, you acknowledge that you have read, understood, and agree to be bound by these terms.',
        termsUserRequirements: [
          'You must be at least 18 years old to place an order',
          'Payment processing is handled by secure third-party providers',
          'All product images are for illustrative purposes only',
          'Shipping times are estimates and not guarantees',
          'We reserve the right to refuse service to anyone'
        ],
        termsSections: [
          {
            number: 1,
            title: 'Agreement to Terms',
            content: 'By accessing and using our website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Website.'
          },
          {
            number: 2,
            title: 'User Accounts',
            content: 'When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.'
          },
          {
            number: 3,
            title: 'Product Information',
            content: 'We make every effort to display as accurately as possible the colors, features, specifications, and details of products available on the Website. However, we do not guarantee that the colors, features, specifications, and details will be completely accurate. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time.'
          },
          {
            number: 4,
            title: 'Orders and Payment',
            content: 'By placing an order through our Website, you warrant that you are legally capable of entering into binding contracts and are at least 18 years old. We accept various payment methods as indicated on the Website. All payments are processed through secure third-party payment processors. We do not store your credit card information.'
          },
          {
            number: 5,
            title: 'Shipping and Delivery',
            content: 'Shipping times and costs will vary depending on your location and the shipping method selected. Estimated delivery times are provided at checkout and are estimates only. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.'
          },
          {
            number: 6,
            title: 'Returns and Refunds',
            content: 'Please review our Returns Policy for detailed information about returning products. Returns must be initiated within the specified return period and meet all return requirements.'
          },
          {
            number: 7,
            title: 'Intellectual Property',
            content: 'All content on this Website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by copyright and other intellectual property laws.'
          },
          {
            number: 8,
            title: 'Limitation of Liability',
            content: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.'
          },
          {
            number: 9,
            title: 'Changes to Terms',
            content: 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.'
          },
          {
            number: 10,
            title: 'Contact Information',
            content: 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'
          }
        ],
        termsIntellectualProperty: 'All content on this Website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by copyright and other intellectual property laws.',
        termsLimitationLiability: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.',
        termsChangesNotice: 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.',
        termsContactInfo: 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'
      };
    }
  },

  // Get combined business information (GSTIN + Bank Details) - ADDED
  getBusinessInfo: async (): Promise<{
    gstinNumber: string;
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
  }> => {
    try {
      const response = await fetch(`${API_URL}/settings/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extract business info from the response
      if (data.success && data.data) {
        const settings = data.data;
        return {
          gstinNumber: settings.gstinNumber || '',
          bankName: settings.bankName || '',
          accountHolderName: settings.accountHolderName || '',
          accountNumber: settings.accountNumber || '',
          accountType: settings.accountType || 'Savings',
          bankBranch: settings.bankBranch || '',
          ifscCode: settings.ifscCode || '',
          swiftCode: settings.swiftCode || '',
          bankAddress: settings.bankAddress || '',
          micrCode: settings.micrCode || '',
          upiId: settings.upiId || ''
        };
      }
      throw new Error('Failed to fetch business information');
    } catch (error) {
      console.error('Error fetching business information:', error);
      // Return empty business info if API fails
      return {
        gstinNumber: '',
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        accountType: 'Savings',
        bankBranch: '',
        ifscCode: '',
        swiftCode: '',
        bankAddress: '',
        micrCode: '',
        upiId: ''
      };
    }
  }
};