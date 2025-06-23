// USPS API Types
// This file contains all USPS-related type definitions

export interface USPSAddressesApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface USPSAddressRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface USPSAddressResponse {
  valid: boolean;
  standardizedAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    zipPlus4?: string;
    deliveryPoint?: string;
    carrierRoute?: string;
  };
  error?: string;
  suggestions?: string[];
}

export interface USPSZipCodeRequest {
  city: string;
  state: string;
}

export interface USPSZipCodeResponse {
  zipCodes: string[];
  error?: string;
}

export interface USPSCityStateRequest {
  zipCode: string;
}

export interface USPSCityStateResponse {
  city: string;
  state: string;
  error?: string;
}

// Address Validation Configuration Types
export interface AddressValidationConfig {
  provider: 'basic' | 'usps' | 'google' | 'smarty' | 'melissa';
  apiKey?: string;
  enabled: boolean;
}

export interface AddressValidationProvider {
  name: string;
  description: string;
  pricing: string;
  features: string[];
  setupUrl: string;
  apiDocs: string;
}

// Legacy Web Tools API Types (for backward compatibility)
export interface USPSAddress {
  Address1: string;
  Address2?: string;
  City: string;
  State: string;
  Zip5: string;
  Zip4?: string;
  DeliveryPoint?: string;
  CarrierRoute?: string;
  Footnotes?: string;
  DPVConfirmation?: string;
  DPVCMRA?: string;
  DPVVacant?: string;
  Business?: string;
  CentralDeliveryPoint?: string;
  Vacant?: string;
}

export interface USPSAddressValidationRequest {
  AddressValidateRequest: {
    Address: USPSAddress;
  };
} 