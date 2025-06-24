// Address Validation Configuration
// Simplified for USPS Addresses 3.0 API with automatic token refresh

import type { AddressValidationConfig, AddressValidationProvider } from '../types/usps';

// Available address validation providers (simplified)
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
  }
};

// Current configuration
export const CURRENT_ADDRESS_VALIDATION_CONFIG: AddressValidationConfig = {
  provider: 'usps', // Using USPS Addresses 3.0 API with automatic token refresh
  apiKey: process.env.USPS_CONSUMER_KEY,
  enabled: true
};

// USPS API setup guide
export const USPS_SETUP_GUIDE = {
  steps: [
    {
      step: 1,
      title: 'Sign up for USPS API Platform',
      description: 'Visit https://developers.usps.com/ and create an account',
      action: 'Go to USPS Developer Portal'
    },
    {
      step: 2,
      title: 'Get API credentials',
      description: 'Request access to the Address Validation API and get your Consumer Key/Secret',
      action: 'Request API access'
    },
    {
      step: 3,
      title: 'Update environment variables',
      description: 'Add USPS_CONSUMER_KEY and USPS_CONSUMER_SECRET to your .env file',
      action: 'Update .env file'
    },
    {
      step: 4,
      title: 'Test the API',
      description: 'Verify that address validation works with automatic token refresh',
      action: 'Test validation endpoint'
    }
  ],
  notes: [
    'The system automatically refreshes OAuth tokens using your Consumer Key/Secret',
    'No manual token management required',
    'Falls back to basic validation if USPS API is unavailable',
    'Uses test environment (apis-tem.usps.com) for development'
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