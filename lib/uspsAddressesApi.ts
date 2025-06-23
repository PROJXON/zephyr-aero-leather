// USPS Addresses 3.0 API Implementation
// This replaces the old Web Tools API

import type {
  USPSAddressesApiConfig,
  USPSAddressRequest,
  USPSAddressResponse,
  USPSZipCodeRequest,
  USPSZipCodeResponse,
  USPSCityStateRequest,
  USPSCityStateResponse
} from '../types/usps';

export class USPSAddressesApi {
  private config: USPSAddressesApiConfig;

  constructor(config: USPSAddressesApiConfig) {
    this.config = {
      baseUrl: 'https://apis-tem.usps.com', // Testing environment - change to apis.usps.com for production
      ...config
    };
  }

  /**
   * Standardize and validate a US address
   */
  async standardizeAddress(address: USPSAddressRequest): Promise<USPSAddressResponse> {
    try {
      // Build query string with correct parameter names
      const params = new URLSearchParams({
        streetAddress: address.addressLine1,
        city: address.city,
        state: address.state,
      });
      if (address.addressLine2) params.append('secondaryAddress', address.addressLine2);
      if (address.zipCode) params.append('ZIPCode', address.zipCode);

      const url = `${this.config.baseUrl}/addresses/v3/address?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`USPS API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Determine validity: if address is returned and has ZIPCode, it's valid
      const valid = !!(data.address && data.address.ZIPCode);
      return {
        valid,
        standardizedAddress: data.address ? {
          addressLine1: data.address.streetAddress,
          addressLine2: data.address.secondaryAddress,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.ZIPCode,
          zipPlus4: data.address.ZIPPlus4,
          deliveryPoint: data.additionalInfo?.deliveryPoint,
          carrierRoute: data.additionalInfo?.carrierRoute
        } : undefined,
        error: valid ? undefined : (data.error?.message || 'Address not valid'),
        suggestions: [] // USPS API may provide suggestions in future
      };
    } catch (error) {
      console.error('USPS Addresses API error:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error),
        suggestions: []
      };
    }
  }

  /**
   * Get ZIP codes for a city and state
   */
  async getZipCodes(request: USPSZipCodeRequest): Promise<USPSZipCodeResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/addresses/v3/zipcode?city=${encodeURIComponent(request.city)}&state=${encodeURIComponent(request.state)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`USPS API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        zipCodes: data.zipCodes || [],
        error: data.error
      };

    } catch (error) {
      console.error('USPS ZIP Code API error:', error);
      throw error;
    }
  }

  /**
   * Get city and state for a ZIP code
   */
  async getCityState(request: USPSCityStateRequest): Promise<USPSCityStateResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/addresses/v3/city-state?ZIPCode=${encodeURIComponent(request.zipCode)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`USPS API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        city: data.city,
        state: data.state,
        error: data.error
      };

    } catch (error) {
      console.error('USPS City/State API error:', error);
      throw error;
    }
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Use a simple test endpoint or the city/state lookup with a known ZIP
      const response = await this.getCityState({ zipCode: '90210' });
      return !response.error;
    } catch (error) {
      console.error('USPS API connection test failed:', error);
      return false;
    }
  }
}

// Helper function to create USPS API instance
export function createUSPSAddressesApi(apiKey: string): USPSAddressesApi {
  return new USPSAddressesApi({ apiKey });
}

// Helper function to validate address using USPS Addresses 3.0 API
export async function validateAddressWithUSPS(
  address: USPSAddressRequest,
  apiKey: string
): Promise<USPSAddressResponse> {
  const uspsApi = createUSPSAddressesApi(apiKey);
  return await uspsApi.standardizeAddress(address);
} 