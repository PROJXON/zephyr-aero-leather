import { CartItem, Product, ShippingRate, State } from "../types/types";
import calculateTotal from "./calculateTotal";
import { calculateShipping } from "./calculateShipping";

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
 * Syncs all totals including subtotal and shipping (tax handled by WooCommerce API)
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

  return {
    subtotal,
    shipping,
    total: subtotal + shipping, // Tax will be added by WooCommerce
    shippingRate
  };
}

export function syncAddress(
  address: {
    state: State;
    zipCode: string;
  }
) {
  // ... existing code ...
} 