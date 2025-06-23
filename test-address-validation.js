// Test script for address validation endpoint
// Run with: node test-address-validation.js

const testAddress = {
  name: {
    first: "John",
    last: "Doe"
  },
  address: {
    line1: "123 Main St",
    line2: "Apt 4B"
  },
  city: "Los Angeles",
  state: "CA",
  zipCode: "90210"
};

async function testAddressValidation() {
  console.log('Testing Address Validation Endpoint...\n');
  
  try {
    // Test basic validation (default)
    console.log('1. Testing Basic Validation (default):');
    const basicResponse = await fetch('http://localhost:3000/api/validate-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAddress)
    });
    
    const basicResult = await basicResponse.json();
    console.log('Status:', basicResponse.status);
    console.log('Valid:', basicResult.valid);
    console.log('Provider:', basicResult.provider);
    console.log('Provider Info:', basicResult.providerInfo?.name);
    if (basicResult.error) console.log('Error:', basicResult.error);
    console.log('');

    // Test USPS validation (if configured)
    console.log('2. Testing USPS Validation:');
    const uspsResponse = await fetch('http://localhost:3000/api/validate-address?method=usps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAddress)
    });
    
    const uspsResult = await uspsResponse.json();
    console.log('Status:', uspsResponse.status);
    console.log('Valid:', uspsResult.valid);
    console.log('Provider:', uspsResult.provider);
    console.log('Provider Info:', uspsResult.providerInfo?.name);
    if (uspsResult.error) console.log('Error:', uspsResult.error);
    console.log('');

    // Test invalid address
    console.log('3. Testing Invalid Address:');
    const invalidAddress = {
      ...testAddress,
      address: { line1: "" },
      city: "",
      zipCode: "invalid"
    };
    
    const invalidResponse = await fetch('http://localhost:3000/api/validate-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidAddress)
    });
    
    const invalidResult = await invalidResponse.json();
    console.log('Status:', invalidResponse.status);
    console.log('Valid:', invalidResult.valid);
    console.log('Error:', invalidResult.error);
    console.log('');

    console.log('✅ Address validation tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure your Next.js development server is running on http://localhost:3000');
  }
}

// Run the test
testAddressValidation(); 