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
  }

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
      // Calculate subtotal from cart items
      const subtotal = cartItems?.reduce((sum, item) => {
        const product = productsToUse?.find(p => p.id === item.productId || p.id === item.id);
        const price = product?.price || item.price || 0;
        return sum + (price * item.quantity);
      }, 0) || 0;
      
      // Convert cents to dollars for WooCommerce
      const totalInCents = subtotal + frontendShippingAmount + frontendTaxAmount;
      wooDetails.total = (totalInCents / 100).toFixed(2);
      wooDetails.subtotal = (subtotal / 100).toFixed(2);
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
      // For billing updates or when frontend amounts aren't provided, just update the address
      // This is normal for billing address updates
      if (!billing) {
        console.log("No frontend amounts provided for shipping update - this is normal for address-only updates");
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
}