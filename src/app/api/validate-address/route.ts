import { NextRequest } from "next/server";
import type { AddressDetailsState, USPSAddressValidationRequest } from "../../../../types/types";
import type { USPSAddressRequest } from "../../../../types/usps";
import { CURRENT_ADDRESS_VALIDATION_CONFIG, getCurrentProviderInfo } from "../../../../lib/addressValidation";
import { validateAddressWithUSPS } from "../../../../lib/uspsAddressesApi";

// Simple XML parser helper functions
function getXmlValue(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 's');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function hasXmlTag(xml: string, tag: string): boolean {
  return new RegExp(`<${tag}>`).test(xml);
}

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

// USPS API validation (legacy - will be deprecated)
async function validateAddressUSPS(addressData: AddressDetailsState): Promise<{
  valid: boolean;
  validatedAddress?: AddressDetailsState;
  error?: string;
  suggestions: AddressDetailsState[];
  dpvConfirmation?: string;
  carrierRoute?: string;
  deliveryPoint?: string;
}> {
  try {
    // Extract ZIP code parts
    const zipParts = addressData.zipCode.trim().split('-');
    const zip5 = zipParts[0];
    const zip4 = zipParts[1] || '';

    // Prepare USPS API request
    const uspsRequest: USPSAddressValidationRequest = {
      AddressValidateRequest: {
        Address: {
          Address1: addressData.address.line1.trim(),
          Address2: addressData.address.line2?.trim() || '',
          City: addressData.city.trim(),
          State: addressData.state,
          Zip5: zip5,
          Zip4: zip4
        }
      }
    };

    // Convert to XML for USPS API
    const xmlRequest = `<?xml version="1.0"?>
<AddressValidateRequest USERID="${process.env.USPS_USER_ID || 'demo'}">
  <Address>
    <Address1>${uspsRequest.AddressValidateRequest.Address.Address1}</Address1>
    ${uspsRequest.AddressValidateRequest.Address.Address2 ? `<Address2>${uspsRequest.AddressValidateRequest.Address.Address2}</Address2>` : ''}
    <City>${uspsRequest.AddressValidateRequest.Address.City}</City>
    <State>${uspsRequest.AddressValidateRequest.Address.State}</State>
    <Zip5>${uspsRequest.AddressValidateRequest.Address.Zip5}</Zip5>
    ${uspsRequest.AddressValidateRequest.Address.Zip4 ? `<Zip4>${uspsRequest.AddressValidateRequest.Address.Zip4}</Zip4>` : ''}
  </Address>
</AddressValidateRequest>`;

    // Call USPS API
    const uspsResponse = await fetch('https://secure.shippingapis.com/ShippingAPI.dll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `API=Verify&XML=${encodeURIComponent(xmlRequest)}`
    });

    if (!uspsResponse.ok) {
      throw new Error('Failed to validate address with USPS');
    }

    const xmlResponse = await uspsResponse.text();
    
    // Check for errors using simple XML parsing
    if (hasXmlTag(xmlResponse, 'Error')) {
      const errorDescription = getXmlValue(xmlResponse, 'Description') || 'Address validation failed';
      return { 
        valid: false, 
        error: errorDescription,
        suggestions: []
      };
    }

    // Extract validated address
    if (!hasXmlTag(xmlResponse, 'Address')) {
      return { 
        valid: false, 
        error: 'No address data returned',
        suggestions: []
      };
    }

    const validatedAddress = {
      address1: getXmlValue(xmlResponse, 'Address1'),
      address2: getXmlValue(xmlResponse, 'Address2'),
      city: getXmlValue(xmlResponse, 'City'),
      state: getXmlValue(xmlResponse, 'State'),
      zip5: getXmlValue(xmlResponse, 'Zip5'),
      zip4: getXmlValue(xmlResponse, 'Zip4')
    };

    // Check if address is valid
    const dpvConfirmation = getXmlValue(xmlResponse, 'DPVConfirmation');
    const isDeliverable = dpvConfirmation === 'Y' || dpvConfirmation === 'D';

    return {
      valid: isDeliverable,
      validatedAddress: {
        ...addressData,
        address: {
          line1: validatedAddress.address1,
          line2: validatedAddress.address2 || undefined
        },
        city: validatedAddress.city,
        state: validatedAddress.state as AddressDetailsState['state'],
        zipCode: validatedAddress.zip4 ? `${validatedAddress.zip5}-${validatedAddress.zip4}` : validatedAddress.zip5
      },
      suggestions: [],
      dpvConfirmation,
      carrierRoute: getXmlValue(xmlResponse, 'CarrierRoute'),
      deliveryPoint: getXmlValue(xmlResponse, 'DeliveryPoint')
    };

  } catch (error) {
    console.error('USPS API error:', error);
    throw error;
  }
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
    const apiKey = process.env.USPS_OAUTH_TOKEN;
    if (!apiKey) {
      throw new Error('USPS_OAUTH_TOKEN environment variable not configured');
    }

    const uspsRequest: USPSAddressRequest = {
      addressLine1: addressData.address.line1.trim(),
      addressLine2: addressData.address.line2?.trim(),
      city: addressData.city.trim(),
      state: addressData.state,
      zipCode: addressData.zipCode.trim()
    };

    const result = await validateAddressWithUSPS(uspsRequest, apiKey);

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
          // Use new USPS Addresses 3.0 API with OAuth
          if (process.env.USPS_OAUTH_TOKEN) {
            validationResult = await validateAddressUSPSNew(addressData);
          } else {
            // Fall back to basic validation if no OAuth token
            console.warn('No USPS OAuth token found, falling back to basic validation');
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