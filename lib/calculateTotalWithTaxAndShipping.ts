import { CartItem, Product, ShippingCalculation } from "../types/types";
import calculateTotal from "./calculateTotal";
import { calculateShipping } from "./calculateShipping";
import { calculateTax } from "./calculateTax";

export function calculateTotalWithTaxAndShipping(
  cartItems: CartItem[],
  products: Product[],
  state: string,
  destinationZip: string,
  selectedRateId?: string
): ShippingCalculation {
  // Calculate subtotal
  const subtotal = calculateTotal(cartItems, products);
  
  // Calculate shipping (now uses weight and zone)
  const { shipping, shippingRate } = calculateShipping(
    subtotal, 
    destinationZip, 
    cartItems, 
    products, 
    selectedRateId
  );
  
  // Calculate tax (tax is applied to subtotal, not including shipping)
  const taxCalculation = calculateTax(subtotal, state);
  
  // Calculate total
  const total = subtotal + shipping + taxCalculation.taxAmount;
  
  return {
    subtotal,
    shipping,
    tax: taxCalculation.taxAmount,
    total,
    shippingRate,
    taxRate: taxCalculation.rate
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
}

export function getCalculationBreakdown(
  cartItems: CartItem[],
  products: Product[],
  state: string,
  destinationZip: string,
  selectedRateId?: string
) {
  const calculation = calculateTotalWithTaxAndShipping(
    cartItems, 
    products, 
    state, 
    destinationZip, 
    selectedRateId
  );
  
  return {
    ...calculation,
    formatted: {
      subtotal: formatCurrency(calculation.subtotal),
      shipping: formatCurrency(calculation.shipping),
      tax: formatCurrency(calculation.tax),
      total: formatCurrency(calculation.total)
    }
  };
}

// New function to reconstruct calculation from WooCommerce order data
export function reconstructCalculationFromOrder(
  cartItems: CartItem[],
  products: Product[],
  orderData: any
): ShippingCalculation {
  // Calculate the actual subtotal using our precision-safe function
  const actualSubtotal = calculateTotal(cartItems, products);
  
  // Get the stored values from WooCommerce (convert from dollars to cents)
  const storedShipping = Math.round(parseFloat(orderData.shipping_total || "0") * 100);
  const storedTax = Math.round(parseFloat(orderData.cart_tax || "0") * 100);
  const storedTotal = Math.round(parseFloat(orderData.total || "0") * 100);
  
  // Use the actual calculated subtotal, but keep the stored shipping and tax
  // This ensures we have the correct item-level calculations while preserving
  // the exact shipping and tax amounts that were charged
  const reconstructedTotal = actualSubtotal + storedShipping + storedTax;
  
  return {
    subtotal: actualSubtotal,
    shipping: storedShipping,
    tax: storedTax,
    total: reconstructedTotal,
    shippingRate: undefined,
    taxRate: undefined
  };
} 