import fetchWooCommerce from "./fetchWooCommerce";
import { AddressDetailsState, State, CartItem, Product } from "../types/types";
import { WooCommerceAddress, WooOrderUpdate, WooOrder } from "../types/woocommerce";
import { syncTotals } from "./syncTotals";

export default async function syncAddress(
  addressObj: AddressDetailsState,
  woo_order_id: number | undefined,
  billing: boolean,
  cartItems?: CartItem[],
  products?: Product[],
  selectedRateId?: string,
  frontendShippingAmount?: number,
  frontendTaxAmount?: number
): Promise<void> {
  if (!woo_order_id) return;

  console.log('syncAddress called with:', {
    woo_order_id,
    billing,
    cartItems: cartItems?.length,
    products: products?.length,
    selectedRateId,
    frontendShippingAmount,
    frontendTaxAmount
  });

  // First, get the current order to preserve shipping line IDs
  const currentOrder = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${woo_order_id}`, "Failed to fetch order");
  const existingShippingLine = currentOrder.shipping_lines[0];

  // If we have cart items but no products, fetch them
  let productsToUse = products;
  if (cartItems && !productsToUse) {
    // Fetch all products with pagination
    let allProducts: Product[] = [];
    let page = 1;
    const perPage = 100;
    
    while (true) {
      const productsPage = await fetchWooCommerce<Product[]>(`wc/v3/products?per_page=${perPage}&page=${page}`, "Failed to fetch products");
      if (productsPage.length === 0) break;
      
      allProducts = allProducts.concat(productsPage);
      if (productsPage.length < perPage) break;
      page++;
    }
    
    productsToUse = allProducts;
    console.log('Fetched products:', productsToUse.length);
  }

  console.log('Current order shipping:', {
    shipping_total: currentOrder.shipping_total,
    shipping_lines: currentOrder.shipping_lines
  });

  const { name, address, city, zipCode, state } = addressObj;

  const wooDetails: WooOrderUpdate = {
    meta_data: [
      {
        key: "user_local_time",
        value: new Date().toISOString()
      },
      {
        key: "shipping_rate_id",
        value: selectedRateId || "usps-priority-mail"
      },
      {
        key: "tax_rate",
        value: state ? (syncTotals(cartItems || [], productsToUse || [], state as State, zipCode, selectedRateId).taxRate).toString() : "0"
      }
    ]
  };

  const wooAddress: WooCommerceAddress = {
    first_name: name.first,
    last_name: name.last,
    address_1: address.line1,
    address_2: address.line2 || "",
    city: city,
    state: state as State,
    postcode: zipCode,
    country: "US"
  };

  if (billing) {
    wooDetails.billing = wooAddress;
  } else {
    wooDetails.shipping = wooAddress;

    // If we have frontend-calculated amounts, use those instead of recalculating
    if (frontendShippingAmount !== undefined && frontendTaxAmount !== undefined) {
      console.log('Using frontend-calculated amounts:', {
        shipping: frontendShippingAmount,
        tax: frontendTaxAmount
      });
      
      // Convert cents to dollars for WooCommerce
      wooDetails.total = ((frontendShippingAmount + frontendTaxAmount) / 100).toFixed(2);
      wooDetails.shipping_total = (frontendShippingAmount / 100).toFixed(2);
      wooDetails.total_tax = (frontendTaxAmount / 100).toFixed(2);
      
      // Set shipping line with frontend amount
      wooDetails.shipping_lines = [{
        ...(existingShippingLine || {}), // Preserve existing line's ID and other fields
        method_title: selectedRateId === "usps-priority-mail-express" ? "USPS Priority Mail Express" : "USPS Priority Mail",
        method_id: selectedRateId || "usps-priority-mail",
        total: (frontendShippingAmount / 100).toFixed(2),
        total_tax: "0.00"
      }];

      console.log('Updating order with frontend amounts:', {
        total: wooDetails.total,
        shipping_total: wooDetails.shipping_total,
        total_tax: wooDetails.total_tax,
        shipping_lines: wooDetails.shipping_lines
      });

      // Set tax lines only if there is tax to collect
      if (frontendTaxAmount > 0) {
        wooDetails.tax_lines = [{
          rate_code: `US-${state}-STATE-TAX`,
          rate_id: 1,
          label: `${state} State Tax`,
          compound: false,
          tax_total: (frontendTaxAmount / 100).toFixed(2),
          shipping_tax_total: "0.00",
          rate_percent: (frontendTaxAmount / (cartItems?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 1)) * 100
        }];
      } else {
        // Explicitly set empty tax lines to remove any existing ones
        wooDetails.tax_lines = [];
      }
    } else {
      // Fallback to backend calculation if frontend amounts not provided
      if (cartItems && productsToUse) {
        const totals = syncTotals(cartItems, productsToUse, state as State, zipCode, selectedRateId);
        
        console.log('Calculated totals:', {
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          shippingRate: totals.shippingRate
        });
        
        // Convert cents to dollars for WooCommerce
        wooDetails.total = (totals.total / 100).toFixed(2);
        wooDetails.shipping_total = (totals.shipping / 100).toFixed(2);
        wooDetails.total_tax = (totals.tax / 100).toFixed(2);
        
        // Set a single shipping line with the current selected rate
        const shippingRate = totals.shippingRate || { 
          id: selectedRateId || "usps-priority-mail", 
          name: selectedRateId === "usps-priority-mail-express" ? "USPS Priority Mail Express" : "USPS Priority Mail",
          price: totals.shipping,
          deliveryDays: 1 
        };
        
        // Update the existing shipping line or create a new one if none exists
        wooDetails.shipping_lines = [{
          ...(existingShippingLine || {}), // Preserve existing line's ID and other fields
          method_title: shippingRate.name,
          method_id: shippingRate.id,
          total: (totals.shipping / 100).toFixed(2),
          total_tax: "0.00"
        }];

        console.log('Updating order with:', {
          total: wooDetails.total,
          shipping_total: wooDetails.shipping_total,
          total_tax: wooDetails.total_tax,
          shipping_lines: wooDetails.shipping_lines
        });

        // Set tax lines only if there is tax to collect
        if (totals.tax > 0) {
          wooDetails.tax_lines = [{
            rate_code: `US-${state}-STATE-TAX`,
            rate_id: 1,
            label: `${state} State Tax`,
            compound: false,
            tax_total: (totals.tax / 100).toFixed(2),
            shipping_tax_total: "0.00",
            rate_percent: totals.taxRate * 100
          }];
        } else {
          // Explicitly set empty tax lines to remove any existing ones
          wooDetails.tax_lines = [];
        }
      }
    }
  }

  // Force replace the entire order data instead of merging
  const updatedOrder = await fetchWooCommerce<WooOrder>(
    `wc/v3/orders/${woo_order_id}`,
    "Failed to sync address with WooCommerce",
    null,
    "PUT",
    wooDetails
  );

  console.log('Order after update:', {
    total: updatedOrder.total,
    shipping_total: updatedOrder.shipping_total,
    total_tax: updatedOrder.total_tax,
    shipping_lines: updatedOrder.shipping_lines
  });
}