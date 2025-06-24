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
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: USPSAddressesApiConfig) {
    this.config = {
      baseUrl: 'https://apis-tem.usps.com', // Test environment for development
      ...config
    };
  }

  /**
   * Get or refresh OAuth access token
   */
  private async getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    
    // If we have a valid token, return it
    if (this.accessToken && now < this.tokenExpiry) {
      return this.accessToken;
    }

    // Token expired or doesn't exist, get a new one
    try {
      const consumerKey = process.env.USPS_CONSUMER_KEY;
      const consumerSecret = process.env.USPS_CONSUMER_SECRET;
      
      if (!consumerKey || !consumerSecret) {
        throw new Error('USPS_CONSUMER_KEY and USPS_CONSUMER_SECRET must be set');
      }

      const response = await fetch(`${this.config.baseUrl}/oauth2/v3/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: consumerKey,
          client_secret: consumerSecret,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get OAuth token: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const tokenData = await response.json();
      
      this.accessToken = tokenData.access_token;
      // Set expiry to 1 hour from now (or use expires_in if provided)
      this.tokenExpiry = now + (tokenData.expires_in || 3600);
      
      return this.accessToken!;
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * Standardize and validate a US address
   */
  async standardizeAddress(address: USPSAddressRequest): Promise<USPSAddressResponse> {
    try {
      // Extract only the 5-digit ZIP code (remove ZIP+4 if present)
      const zip5 = address.zipCode ? address.zipCode.split('-')[0] : '';
      
      // Build query string with correct parameter names
      const params = new URLSearchParams({
        streetAddress: address.addressLine1,
        city: address.city,
        state: address.state,
      });
      if (address.addressLine2) params.append('secondaryAddress', address.addressLine2);
      if (zip5) params.append('ZIPCode', zip5);

      const url = `${this.config.baseUrl}/addresses/v3/address?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
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
          'Authorization': `Bearer ${await this.getAccessToken()}`,
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
      // Extract only the 5-digit ZIP code (remove ZIP+4 if present)
      const zip5 = request.zipCode ? request.zipCode.split('-')[0] : '';
      
      const response = await fetch(`${this.config.baseUrl}/addresses/v3/city-state?ZIPCode=${encodeURIComponent(zip5)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
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
  apiKey?: string // Made optional since we now use consumer key/secret
): Promise<USPSAddressResponse> {
  const uspsApi = createUSPSAddressesApi(apiKey || 'dummy'); // apiKey is no longer used
  return await uspsApi.standardizeAddress(address);
} 