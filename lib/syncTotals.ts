import { CartItem, Product, ShippingRate, TaxCalculation, State } from "../types/types";
import calculateTotal from "./calculateTotal";
import { calculateShipping } from "./calculateShipping";
import { calculateTax } from "./calculateTax";

/**
 * Syncs the subtotal by recalculating based on current cart items and products
 */
export function syncSubtotal(cartItems: CartItem[], products: Product[]): number {
  return calculateTotal(cartItems, products);
}

/**
 * Syncs the shipping cost based on destination and selected rate
 */
export function syncShipping(
  cartItems: CartItem[],
  products: Product[],
  destinationZip: string,
  selectedRateId?: string
): { shipping: number; shippingRate?: ShippingRate } {
  const subtotal = syncSubtotal(cartItems, products);
  return calculateShipping(subtotal, destinationZip, cartItems, products, selectedRateId);
}

/**
 * Syncs the tax calculation based on state and current subtotal
 */
export function syncTax(
  cartItems: CartItem[],
  products: Product[],
  state: State
): TaxCalculation {
  const subtotal = syncSubtotal(cartItems, products);
  return calculateTax(subtotal, state);
}

/**
 * Syncs all totals including subtotal, shipping, tax, and final total
 */
export function syncTotals(
  cartItems: CartItem[],
  products: Product[],
  state: State,
  destinationZip: string,
  selectedRateId?: string
) {
  const subtotal = syncSubtotal(cartItems, products);
  const { shipping, shippingRate } = syncShipping(cartItems, products, destinationZip, selectedRateId);
  const taxCalculation = syncTax(cartItems, products, state);

  return {
    subtotal,
    shipping,
    tax: taxCalculation.taxAmount,
    total: subtotal + shipping + taxCalculation.taxAmount,
    shippingRate,
    taxRate: taxCalculation.rate
  };
} 