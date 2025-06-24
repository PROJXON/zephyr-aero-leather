import { NextRequest } from "next/server";
import type { AddressDetailsState } from "../../../../types/types";
import type { USPSAddressRequest } from "../../../../types/usps";
import { CURRENT_ADDRESS_VALIDATION_CONFIG, getCurrentProviderInfo } from "../../../../lib/addressValidation";
import { validateAddressWithUSPS } from "../../../../lib/uspsAddressesApi";

// Basic client-side validation
function validateAddressBasic(addressData: AddressDetailsState): {
  valid: boolean;
  validatedAddress?: AddressDetailsState;
  error?: string;
  suggestions: AddressDetailsState[];
} {
  const errors: string[] = [];
  
  // Basic validation rules
  if (!addressData.address.line1.trim()) {
    errors.push('Address line 1 is required');
  }
  
  if (!addressData.city.trim()) {
    errors.push('City is required');
  }
  
  if (!addressData.state) {
    errors.push('State is required');
  }
  
  if (!addressData.zipCode.trim()) {
    errors.push('ZIP code is required');
  } else {
    // Basic ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(addressData.zipCode.trim())) {
      errors.push('Invalid ZIP code format');
    }
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      error: errors.join(', '),
      suggestions: []
    };
  }
  
  // If basic validation passes, return the address as valid
  return {
    valid: true,
    validatedAddress: addressData,
    suggestions: []
  };
}

// USPS Addresses 3.0 API validation (new API Platform)
async function validateAddressUSPSNew(addressData: AddressDetailsState): Promise<{
  valid: boolean;
  validatedAddress?: AddressDetailsState;
  error?: string;
  suggestions: AddressDetailsState[];
  dpvConfirmation?: string;
  carrierRoute?: string;
  deliveryPoint?: string;
}> {
  try {
    const consumerKey = process.env.USPS_CONSUMER_KEY;
    const consumerSecret = process.env.USPS_CONSUMER_SECRET;
    
    if (!consumerKey || !consumerSecret) {
      throw new Error('USPS_CONSUMER_KEY and USPS_CONSUMER_SECRET environment variables not configured');
    }

    const uspsRequest: USPSAddressRequest = {
      addressLine1: addressData.address.line1.trim(),
      addressLine2: addressData.address.line2?.trim(),
      city: addressData.city.trim(),
      state: addressData.state,
      zipCode: addressData.zipCode.trim()
    };

    const result = await validateAddressWithUSPS(uspsRequest);

    if (!result.valid) {
      return {
        valid: false,
        error: result.error || 'Address validation failed',
        suggestions: []
      };
    }

    if (!result.standardizedAddress) {
      return {
        valid: false,
        error: 'No standardized address returned',
        suggestions: []
      };
    }

    const standardized = result.standardizedAddress;
    
    return {
      valid: true,
      validatedAddress: {
        ...addressData,
        address: {
          line1: standardized.addressLine1,
          line2: standardized.addressLine2 || undefined
        },
        city: standardized.city,
        state: standardized.state as AddressDetailsState['state'],
        zipCode: standardized.zipPlus4 ? `${standardized.zipCode}-${standardized.zipPlus4}` : standardized.zipCode
      },
      suggestions: [],
      dpvConfirmation: 'Y', // Assuming valid addresses are deliverable
      carrierRoute: standardized.carrierRoute,
      deliveryPoint: standardized.deliveryPoint
    };

  } catch (error) {
    console.error('USPS Addresses 3.0 API error:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
      suggestions: []
    };
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const addressData: AddressDetailsState = await req.json();
    
    // Get validation method from query params or use configured default
    const url = new URL(req.url);
    const validationMethod = url.searchParams.get('method') || CURRENT_ADDRESS_VALIDATION_CONFIG.provider;
    
    let validationResult;
    
    switch (validationMethod) {
      case 'usps':
        try {
          // Use new USPS Addresses 3.0 API with automatic token refresh
          if (process.env.USPS_CONSUMER_KEY && process.env.USPS_CONSUMER_SECRET) {
            validationResult = await validateAddressUSPSNew(addressData);
          } else {
            // Fall back to basic validation if no credentials
            console.warn('No USPS credentials found, falling back to basic validation');
            validationResult = validateAddressBasic(addressData);
          }
        } catch (error) {
          console.warn('USPS API failed, falling back to basic validation:', error);
          validationResult = validateAddressBasic(addressData);
        }
        break;
      
      case 'basic':
      default:
        validationResult = validateAddressBasic(addressData);
        break;
    }

    // Add provider info to response
    const providerInfo = getCurrentProviderInfo();
    const response = {
      ...validationResult,
      provider: validationMethod,
      providerInfo: providerInfo ? {
        name: providerInfo.name,
        description: providerInfo.description
      } : null
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Address validation error:', error);
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'Address validation service unavailable',
      suggestions: [],
      provider: 'error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 