// Address Validation Configuration
// This file helps manage the transition from USPS Web Tools to the new USPS API Platform

import type { AddressValidationConfig, AddressValidationProvider } from '../types/usps';

// Available address validation providers
export const ADDRESS_VALIDATION_PROVIDERS: Record<string, AddressValidationProvider> = {
  basic: {
    name: 'Basic Validation',
    description: 'Client-side validation with basic format checking',
    pricing: 'Free',
    features: ['ZIP code format validation', 'Required field validation', 'No external API calls'],
    setupUrl: '',
    apiDocs: ''
  },
  usps: {
    name: 'USPS Addresses 3.0 API',
    description: 'Official USPS address validation and standardization service',
    pricing: 'Free (with usage limits)',
    features: ['Address standardization', 'ZIP+4 lookup', 'City/State validation', 'Delivery point validation', 'USPS addressing standards'],
    setupUrl: 'https://developers.usps.com/',
    apiDocs: 'https://developers.usps.com/'
  },
  google: {
    name: 'Google Maps Geocoding API',
    description: 'Comprehensive address validation and geocoding',
    pricing: 'Pay per use ($5 per 1000 requests)',
    features: ['International addresses', 'Geocoding', 'Address components', 'High accuracy'],
    setupUrl: 'https://developers.google.com/maps/documentation/geocoding',
    apiDocs: 'https://developers.google.com/maps/documentation/geocoding/overview'
  },
  smarty: {
    name: 'SmartyStreets',
    description: 'Specialized address validation service',
    pricing: 'Starting at $0.03 per lookup',
    features: ['High accuracy', 'International support', 'Bulk processing', 'Address suggestions'],
    setupUrl: 'https://smartystreets.com/',
    apiDocs: 'https://smartystreets.com/docs/cloud/us-street-api'
  },
  melissa: {
    name: 'Melissa Data',
    description: 'Address validation and geocoding service',
    pricing: 'Starting at $0.02 per lookup',
    features: ['Address correction', 'Geocoding', 'Phone/email validation', 'Real-time processing'],
    setupUrl: 'https://www.melissa.com/',
    apiDocs: 'https://www.melissa.com/developers/address-verification-api'
  }
};

// Current configuration - update this based on your chosen provider
export const CURRENT_ADDRESS_VALIDATION_CONFIG: AddressValidationConfig = {
  provider: 'usps', // Changed from 'basic' to 'usps' - now using new API!
  apiKey: process.env.USPS_OAUTH_TOKEN || process.env.USPS_CONSUMER_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.SMARTY_API_KEY,
  enabled: true
};

// Migration guide for USPS API transition
export const USPS_MIGRATION_GUIDE = {
  steps: [
    {
      step: 1,
      title: 'Sign up for new USPS API Platform',
      description: 'Visit https://developers.usps.com/ and create an account',
      action: 'Go to USPS Developer Portal'
    },
    {
      step: 2,
      title: 'Get API credentials',
      description: 'Request access to the Address Validation API and get your API key',
      action: 'Request API access'
    },
    {
      step: 3,
      title: 'Update environment variables',
      description: 'Replace USPS_USER_ID with your new API credentials (USPS_API_KEY)',
      action: 'Update .env file'
    },
    {
      step: 4,
      title: 'Test the new API',
      description: 'Verify that address validation works with the new API',
      action: 'Test validation endpoint'
    },
    {
      step: 5,
      title: 'Update configuration',
      description: 'Change provider from "basic" to "usps" in addressValidation.ts',
      action: 'Update config'
    }
  ],
  notes: [
    'The new USPS API Platform is separate from Web Tools',
    'Web Tools credentials (like USPS_USER_ID=6PROJX124Z397) will not work with the new APIs',
    'Address Validation APIs can only be used with USPS shipping/mailing services',
    'Batch processing is not allowed - only individual transactional use',
    'Web Tools will be retired in 2026',
    'Basic validation is currently working as a fallback'
  ]
};

// Helper function to get provider info
export function getProviderInfo(provider: string): AddressValidationProvider | null {
  return ADDRESS_VALIDATION_PROVIDERS[provider] || null;
}

// Helper function to check if provider is configured
export function isProviderConfigured(provider: string): boolean {
  const config = CURRENT_ADDRESS_VALIDATION_CONFIG;
  return config.provider === provider && config.enabled;
}

// Helper function to get current provider info
export function getCurrentProviderInfo(): AddressValidationProvider | null {
  return getProviderInfo(CURRENT_ADDRESS_VALIDATION_CONFIG.provider);
} 