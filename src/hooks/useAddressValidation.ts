import { useState, useCallback } from 'react';
import type { AddressDetailsState, AddressValidationResponse } from '../../types/types';

export function useAddressValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<AddressValidationResponse | null>(null);

  const validateAddress = useCallback(async (address: AddressDetailsState): Promise<AddressValidationResponse> => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/validate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      const result: AddressValidationResponse = await response.json();
      setValidationResult(result);
      return result;
    } catch (error) {
      const errorResult: AddressValidationResponse = {
        valid: false,
        error: 'Address validation service unavailable',
        suggestions: []
      };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validateAddress,
    clearValidation,
    isValidating,
    validationResult
  };
} 