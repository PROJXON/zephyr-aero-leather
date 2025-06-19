import { ShippingRate, CartItem, Product } from "../types/types";

// Origin ZIP code (Los Angeles, CA)
const ORIGIN_ZIP = "90210"; // You can change this to your actual LA ZIP

// Fallback weight if product doesn't have weight (in lbs)
const FALLBACK_WEIGHT = 1.0; // 1 lb default

// USPS Zone Map (from Los Angeles to destination ZIP codes)
// This is a simplified version - in production you'd use USPS API
const getZoneFromZip = (destinationZip: string): number => {
  const zip = parseInt(destinationZip.substring(0, 3));
  
  // Zone 5: AK, HI (special handling)
  if (zip >= 995 && zip <= 999) return 5; // Alaska
  if (zip >= 967 && zip <= 968) return 5; // Hawaii

  // Zone 1: CA, NV, OR, WA (900-999)
  if (zip >= 900 && zip <= 999) return 1;
  
  // Zone 2: AZ, CO, ID, MT, NM, UT, WY (800-899)
  if (zip >= 800 && zip <= 899) return 2;
  
  // Zone 3: TX, OK, AR, LA, MS, AL, GA, FL, SC, NC, TN, KY, WV, VA, MD, DE, NJ, PA, NY, CT, RI, MA, NH, VT, ME
  if (zip >= 100 && zip <= 399) return 3;
  
  // Zone 4: ND, SD, NE, KS, IA, MN, WI, IL, IN, OH, MI
  if (zip >= 400 && zip <= 699) return 4;
  
  return 3; // Default to Zone 3 for any unmapped areas
};

// USPS Priority Mail rates by zone and weight (simplified 2024 rates)
const PRIORITY_MAIL_RATES: Record<number, Record<number, number>> = {
  1: { // Zone 1 (CA, NV, OR, WA)
    1: 895,   // 1 lb: $8.95
    2: 1095,  // 2 lbs: $10.95
    3: 1295,  // 3 lbs: $12.95
    4: 1495,  // 4 lbs: $14.95
    5: 1695,  // 5 lbs: $16.95
    6: 1895,  // 6 lbs: $18.95
    7: 2095,  // 7 lbs: $20.95
    8: 2295,  // 8 lbs: $22.95
    9: 2495,  // 9 lbs: $24.95
    10: 2695  // 10 lbs: $26.95
  },
  2: { // Zone 2 (AZ, CO, ID, MT, NM, UT, WY)
    1: 995,   // 1 lb: $9.95
    2: 1195,  // 2 lbs: $11.95
    3: 1395,  // 3 lbs: $13.95
    4: 1595,  // 4 lbs: $15.95
    5: 1795,  // 5 lbs: $17.95
    6: 1995,  // 6 lbs: $19.95
    7: 2195,  // 7 lbs: $21.95
    8: 2395,  // 8 lbs: $23.95
    9: 2595,  // 9 lbs: $25.95
    10: 2795  // 10 lbs: $27.95
  },
  3: { // Zone 3 (East Coast)
    1: 1095,  // 1 lb: $10.95
    2: 1295,  // 2 lbs: $12.95
    3: 1495,  // 3 lbs: $14.95
    4: 1695,  // 4 lbs: $16.95
    5: 1895,  // 5 lbs: $18.95
    6: 2095,  // 6 lbs: $20.95
    7: 2295,  // 7 lbs: $22.95
    8: 2495,  // 8 lbs: $24.95
    9: 2695,  // 9 lbs: $26.95
    10: 2895  // 10 lbs: $28.95
  },
  4: { // Zone 4 (Midwest)
    1: 1195,  // 1 lb: $11.95
    2: 1395,  // 2 lbs: $13.95
    3: 1595,  // 3 lbs: $15.95
    4: 1795,  // 4 lbs: $17.95
    5: 1995,  // 5 lbs: $19.95
    6: 2195,  // 6 lbs: $21.95
    7: 2395,  // 7 lbs: $23.95
    8: 2595,  // 8 lbs: $25.95
    9: 2795,  // 9 lbs: $27.95
    10: 2995  // 10 lbs: $29.95
  },
  5: { // Zone 5 (AK, HI)
    1: 1995,  // 1 lb: $19.95
    2: 2395,  // 2 lbs: $23.95
    3: 2795,  // 3 lbs: $27.95
    4: 3195,  // 4 lbs: $31.95
    5: 3595,  // 5 lbs: $35.95
    6: 3995,  // 6 lbs: $39.95
    7: 4395,  // 7 lbs: $43.95
    8: 4795,  // 8 lbs: $47.95
    9: 5195,  // 9 lbs: $51.95
    10: 5595  // 10 lbs: $55.95
  }
};

// USPS Priority Mail Express rates (simplified)
const PRIORITY_MAIL_EXPRESS_RATES: Record<number, Record<number, number>> = {
  1: { // Zone 1 (CA, NV, OR, WA)
    1: 2995,   // 1 lb: $29.95
    2: 3195,   // 2 lbs: $31.95
    3: 3395,   // 3 lbs: $33.95
    4: 3595,   // 4 lbs: $35.95
    5: 3795,   // 5 lbs: $37.95
    6: 3995,   // 6 lbs: $39.95
    7: 4195,   // 7 lbs: $41.95
    8: 4395,   // 8 lbs: $43.95
    9: 4595,   // 9 lbs: $45.95
    10: 4795   // 10 lbs: $47.95
  },
  2: { // Zone 2 (AZ, CO, ID, MT, NM, UT, WY)
    1: 3195,   // 1 lb: $31.95
    2: 3395,   // 2 lbs: $33.95
    3: 3595,   // 3 lbs: $35.95
    4: 3795,   // 4 lbs: $37.95
    5: 3995,   // 5 lbs: $39.95
    6: 4195,   // 6 lbs: $41.95
    7: 4395,   // 7 lbs: $43.95
    8: 4595,   // 8 lbs: $45.95
    9: 4795,   // 9 lbs: $47.95
    10: 4995   // 10 lbs: $49.95
  },
  3: { // Zone 3 (East Coast)
    1: 3395,   // 1 lb: $33.95
    2: 3595,   // 2 lbs: $35.95
    3: 3795,   // 3 lbs: $37.95
    4: 3995,   // 4 lbs: $39.95
    5: 4195,   // 5 lbs: $41.95
    6: 4395,   // 6 lbs: $43.95
    7: 4595,   // 7 lbs: $45.95
    8: 4795,   // 8 lbs: $47.95
    9: 4995,   // 9 lbs: $49.95
    10: 5195   // 10 lbs: $51.95
  },
  4: { // Zone 4 (Midwest)
    1: 3595,   // 1 lb: $35.95
    2: 3795,   // 2 lbs: $37.95
    3: 3995,   // 3 lbs: $39.95
    4: 4195,   // 4 lbs: $41.95
    5: 4395,   // 5 lbs: $43.95
    6: 4595,   // 6 lbs: $45.95
    7: 4795,   // 7 lbs: $47.95
    8: 4995,   // 8 lbs: $49.95
    9: 5195,   // 9 lbs: $51.95
    10: 5395   // 10 lbs: $53.95
  },
  5: { // Zone 5 (AK, HI)
    1: 5995,   // 1 lb: $59.95
    2: 6395,   // 2 lbs: $63.95
    3: 6795,   // 3 lbs: $67.95
    4: 7195,   // 4 lbs: $71.95
    5: 7595,   // 5 lbs: $75.95
    6: 7995,   // 6 lbs: $79.95
    7: 8395,   // 7 lbs: $83.95
    8: 8795,   // 8 lbs: $87.95
    9: 9195,   // 9 lbs: $91.95
    10: 9595   // 10 lbs: $95.95
  }
};

// Calculate total cart weight
export function calculateCartWeight(cartItems: CartItem[], products: Product[]): number {
  const totalWeight = cartItems.reduce((totalWeight, item) => {
    const product = products.find(p => p.id === item.id);
    const itemWeight = product?.weight || FALLBACK_WEIGHT;
    const itemTotalWeight = itemWeight * item.quantity;
    
    // Debug logging
    console.log(`Item: ${product?.name || 'Unknown'}, Weight: ${itemWeight}lbs, Qty: ${item.quantity}, Total: ${itemTotalWeight}lbs`);
    
    return totalWeight + itemTotalWeight;
  }, 0);
  
  console.log(`Total cart weight: ${totalWeight}lbs`);
  return totalWeight;
}

// Get shipping rate based on weight and zone
function getPriorityMailRate(weight: number, zone: number): number {
  const weightKey = Math.ceil(weight);
  const maxWeight = 10;
  
  if (weight <= maxWeight) {
    return PRIORITY_MAIL_RATES[zone]?.[weightKey] || PRIORITY_MAIL_RATES[zone]?.[maxWeight] || PRIORITY_MAIL_RATES[3][maxWeight];
  }
  
  // For weights over 10 lbs, add $2 per additional pound
  const baseRate = PRIORITY_MAIL_RATES[zone]?.[maxWeight] || PRIORITY_MAIL_RATES[3][maxWeight];
  const additionalWeight = weight - maxWeight;
  return baseRate + (Math.ceil(additionalWeight) * 200);
}

// Get Priority Mail Express rate based on weight and zone
function getPriorityMailExpressRate(weight: number, zone: number): number {
  const weightKey = Math.ceil(weight);
  const maxWeight = 10;
  
  if (weight <= maxWeight) {
    return PRIORITY_MAIL_EXPRESS_RATES[zone]?.[weightKey] || PRIORITY_MAIL_EXPRESS_RATES[zone]?.[maxWeight] || PRIORITY_MAIL_EXPRESS_RATES[3][maxWeight];
  }
  
  // For weights over 10 lbs, add $3 per additional pound (Express is more expensive)
  const baseRate = PRIORITY_MAIL_EXPRESS_RATES[zone]?.[maxWeight] || PRIORITY_MAIL_EXPRESS_RATES[3][maxWeight];
  const additionalWeight = weight - maxWeight;
  return baseRate + (Math.ceil(additionalWeight) * 300);
}

export function getShippingRates(): ShippingRate[] {
  return [
    {
      id: "usps-priority-mail",
      name: "USPS Priority Mail",
      price: 0, // Will be calculated based on weight and zone
      deliveryDays: 1,
      description: "1–3 business days"
    },
    {
      id: "usps-priority-mail-express",
      name: "USPS Priority Mail Express",
      price: 0, // Will be calculated based on weight and zone
      deliveryDays: 1,
      description: "Overnight to 2 days"
    }
  ];
}

export function calculateShipping(
  subtotal: number, // in cents
  destinationZip: string,
  cartItems: CartItem[],
  products: Product[],
  selectedRateId?: string
): { shipping: number; shippingRate?: ShippingRate } {
  const totalWeight = calculateCartWeight(cartItems, products);
  const zone = getZoneFromZip(destinationZip);
  
  console.log(`Shipping calculation - Weight: ${totalWeight}lbs, Zone: ${zone}, ZIP: ${destinationZip}`);
  
  const rates = getShippingRates();
  const selectedRate = selectedRateId
    ? rates.find(rate => rate.id === selectedRateId)
    : rates[0];

  let shippingCost = 0;
  
  if (selectedRate?.id === "usps-priority-mail") {
    shippingCost = getPriorityMailRate(totalWeight, zone);
    console.log(`Priority Mail rate: $${(shippingCost / 100).toFixed(2)}`);
  } else if (selectedRate?.id === "usps-priority-mail-express") {
    shippingCost = getPriorityMailExpressRate(totalWeight, zone);
    console.log(`Priority Mail Express rate: $${(shippingCost / 100).toFixed(2)}`);
  }

  return {
    shipping: shippingCost,
    shippingRate: selectedRate ? {
      ...selectedRate,
      price: shippingCost
    } : undefined
  };
}

export function getAvailableShippingRates(): ShippingRate[] {
  return getShippingRates();
} 