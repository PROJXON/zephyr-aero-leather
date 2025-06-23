# USPS API Migration Guide

## Overview

USPS is phasing out their Web Tools API and transitioning to a new USPS API Platform. This guide will help you migrate your address validation functionality.

## Current Status

- **Web Tools API**: Being phased out, limited access granted
- **New USPS API Platform**: Available at https://developers.usps.com/
- **Web Tools Retirement**: Scheduled for 2026 (Label APIs already retired in July 2024)

## What Changed

### Your Current Implementation
- Uses USPS Web Tools API for address validation
- Located in `/src/app/api/validate-address/route.ts`
- Uses `USPS_USER_ID` environment variable
- Currently falls back to 'demo' credentials

### New Requirements
- Must use the new USPS API Platform
- Separate from Web Tools
- New API credentials required
- Different API endpoints and formats

## Migration Options

### Option 1: Migrate to New USPS API Platform (Recommended)

**Pros:**
- Official USPS service
- Free (with usage limits)
- Maintains current functionality
- Official support

**Cons:**
- Requires new API credentials
- Different API format
- Limited to US shipping/mailing services only

**Steps:**
1. Sign up at https://developers.usps.com/
2. Request access to Address Validation API
3. Get new API credentials
4. Update your code to use new API format
5. Test thoroughly

### Option 2: Switch to Alternative Provider

**Google Maps Geocoding API**
- **Cost**: $5 per 1000 requests
- **Features**: International support, geocoding, high accuracy
- **Setup**: https://developers.google.com/maps/documentation/geocoding

**SmartyStreets**
- **Cost**: Starting at $0.03 per lookup
- **Features**: High accuracy, international support, address suggestions
- **Setup**: https://smartystreets.com/

**Melissa Data**
- **Cost**: Starting at $0.02 per lookup
- **Features**: Address correction, geocoding, real-time processing
- **Setup**: https://www.melissa.com/

### Option 3: Use Basic Validation (Current Fallback)

**Pros:**
- No external dependencies
- No API costs
- Immediate availability

**Cons:**
- Limited validation
- No address correction
- No delivery confirmation

## Implementation Changes

### Current Code Structure

```typescript
// Current USPS Web Tools implementation
const uspsResponse = await fetch('https://secure.shippingapis.com/ShippingAPI.dll', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: `API=Verify&XML=${encodeURIComponent(xmlRequest)}`
});
```

### Updated Implementation

The address validation endpoint now supports multiple providers:

```typescript
// New multi-provider approach
const validationMethod = url.searchParams.get('method') || 'basic';

switch (validationMethod) {
  case 'usps':
    // New USPS API Platform implementation
    break;
  case 'basic':
  default:
    // Basic client-side validation
    break;
}
```

## Environment Variables

### Current
```env
USPS_USER_ID=your_web_tools_user_id
```

### New (for USPS API Platform)
```env
USPS_API_KEY=your_new_api_key
```

### Alternative Providers
```env
GOOGLE_MAPS_API_KEY=your_google_api_key
SMARTY_API_KEY=your_smarty_api_key
MELISSA_API_KEY=your_melissa_api_key
```

## Testing

### Test Current Implementation
```bash
# Test basic validation (current default)
curl -X POST http://localhost:3000/api/validate-address \
  -H "Content-Type: application/json" \
  -d '{"name":{"first":"John","last":"Doe"},"address":{"line1":"123 Main St"},"city":"Los Angeles","state":"CA","zipCode":"90210"}'

# Test USPS validation (if configured)
curl -X POST "http://localhost:3000/api/validate-address?method=usps" \
  -H "Content-Type: application/json" \
  -d '{"name":{"first":"John","last":"Doe"},"address":{"line1":"123 Main St"},"city":"Los Angeles","state":"CA","zipCode":"90210"}'
```

## Configuration

Update `/lib/addressValidation.ts` to change the default provider:

```typescript
export const CURRENT_ADDRESS_VALIDATION_CONFIG: AddressValidationConfig = {
  provider: 'usps', // Change from 'basic' to 'usps' once configured
  apiKey: process.env.USPS_API_KEY,
  enabled: true
};
```

## Important Notes

1. **Usage Restrictions**: Address Validation APIs can only be used with USPS shipping/mailing services
2. **Transactional Use Only**: No batch processing allowed - only individual address validation
3. **Web Tools Retirement**: Web Tools will be completely retired in 2026
4. **Credential Incompatibility**: Web Tools credentials will not work with the new APIs

## Next Steps

1. **Immediate**: Your app will continue working with basic validation
2. **Short-term**: Choose and implement your preferred address validation provider
3. **Long-term**: Complete migration to new USPS API Platform or alternative provider

## Support

- **USPS API Platform**: Contact the team through the Developer Portal
- **Alternative Providers**: Check their respective documentation and support channels
- **Code Issues**: Review the updated implementation in `/src/app/api/validate-address/route.ts`

## Files Modified

- `/src/app/api/validate-address/route.ts` - Updated to support multiple providers
- `/lib/addressValidation.ts` - New configuration and provider management
- `USPS_API_MIGRATION.md` - This migration guide

## Timeline

- **Now**: Basic validation is active and working
- **ASAP**: Choose and implement your preferred provider
- **Before 2026**: Complete migration from Web Tools API 