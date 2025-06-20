import { CartItem, Product, ShippingCalculation, State } from "../types/types";
import calculateTotal from "./calculateTotal";
import { calculateShipping } from "./calculateShipping";

export function calculateTotalWithTaxAndShipping(
  cartItems: CartItem[],
  products: Product[],
  state: State,
  zipCode: string,
  selectedRateId?: string
): ShippingCalculation {
  const subtotal = calculateTotal(cartItems, products);

  const { shipping, shippingRate } = calculateShipping(
    subtotal, 
    zipCode, 
    cartItems, 
    products, 
    selectedRateId
  );

  const total = subtotal + shipping;
  
  return {
    subtotal,
    shipping,
    total,
    shippingRate
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
  state: State,
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
      tax: calculation.tax !== undefined ? formatCurrency(calculation.tax) : "Calculating...",
      total: formatCurrency(calculation.total)
    }
  };
}

export function reconstructCalculationFromOrder(
  cartItems: CartItem[],
  products: Product[],
  orderData: { shipping_total?: string; cart_tax?: string; total?: string }
): ShippingCalculation {
  const actualSubtotal = calculateTotal(cartItems, products);
  
  const storedShipping = Math.round(parseFloat(orderData.shipping_total || "0") * 100);
  const storedTax = Math.round(parseFloat(orderData.cart_tax || "0") * 100);
  
  const reconstructedTotal = actualSubtotal + storedShipping + storedTax;
  
  return {
    subtotal: actualSubtotal,
    shipping: storedShipping,
    tax: storedTax,
    total: reconstructedTotal,
    shippingRate: undefined
  };
} 