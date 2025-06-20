import { CartItem, Product, ShippingCalculation, State } from "../types/types";
import calculateTotal from "./calculateTotal";
import { calculateShipping } from "./calculateShipping";
import { calculateTax } from "./calculateTax";

export function calculateTotalWithTaxAndShipping(
  cartItems: CartItem[],
  products: Product[],
  state: State,
  destinationZip: string,
  selectedRateId?: string
): ShippingCalculation {
  const subtotal = calculateTotal(cartItems, products);

  const { shipping, shippingRate } = calculateShipping(
    subtotal,
    destinationZip,
    cartItems,
    products,
    selectedRateId
  );

  const taxCalculation = calculateTax(subtotal, state, shipping);
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
      tax: formatCurrency(calculation.tax),
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
    shippingRate: undefined,
    taxRate: undefined
  };
} 