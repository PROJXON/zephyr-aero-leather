import { NextRequest } from "next/server";
import type { AddressDetailsState, USPSAddressValidationRequest, USPSAddressValidationResponse } from "../../../../types/types";

// Simple XML parser helper functions
function getXmlValue(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 's');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function hasXmlTag(xml: string, tag: string): boolean {
  return new RegExp(`<${tag}>`).test(xml);
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const addressData: AddressDetailsState = await req.json();
    
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
      return new Response(JSON.stringify({ 
        valid: false, 
        error: errorDescription,
        suggestions: []
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract validated address
    if (!hasXmlTag(xmlResponse, 'Address')) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'No address data returned',
        suggestions: []
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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

    return new Response(JSON.stringify({
      valid: isDeliverable,
      validatedAddress: {
        ...addressData,
        address: {
          line1: validatedAddress.address1,
          line2: validatedAddress.address2 || undefined
        },
        city: validatedAddress.city,
        state: validatedAddress.state,
        zipCode: validatedAddress.zip4 ? `${validatedAddress.zip5}-${validatedAddress.zip4}` : validatedAddress.zip5
      },
      suggestions: [],
      dpvConfirmation,
      carrierRoute: getXmlValue(xmlResponse, 'CarrierRoute'),
      deliveryPoint: getXmlValue(xmlResponse, 'DeliveryPoint')
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Address validation error:', error);
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'Address validation service unavailable',
      suggestions: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 