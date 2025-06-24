import fetchWooCommerce from "./fetchWooCommerce";
import { AddressDetailsState, State, CartItem, Product } from "../types/types";
import { WooCommerceAddress, WooOrderUpdate, WooOrder } from "../types/woocommerce";

export default async function syncAddress(
  addressObj: AddressDetailsState,
  woo_order_id: number | undefined,
  billing: boolean,
  cartItems?: CartItem[],
  products?: Product[],
  selectedRateId?: string,
  frontendShippingAmount?: number,
  wooCommerceTaxAmount?: number
): Promise<void> {
  if (!woo_order_id) return;
  
  const currentOrder = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${woo_order_id}`, "Failed to fetch order");
  const existingShippingLine = currentOrder.shipping_lines[0];

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

    if (frontendShippingAmount !== undefined && wooCommerceTaxAmount !== undefined) { 
      const subtotal = cartItems?.reduce((sum, item) => {
        const product = productsToUse?.find(p => p.id === item.productId || p.id === item.id);
        const price = product ? (typeof product.price === "string" ? parseFloat(product.price) : product.price) : 0;
        return sum + (price * item.quantity);
      }, 0) || 0;
      
      // Convert cents to dollars for WooCommerce
      const totalInCents = subtotal + frontendShippingAmount + wooCommerceTaxAmount;
      wooDetails.total = (totalInCents / 100).toFixed(2);
      wooDetails.subtotal = (subtotal / 100).toFixed(2);
      wooDetails.shipping_total = (frontendShippingAmount / 100).toFixed(2);
      wooDetails.total_tax = (wooCommerceTaxAmount / 100).toFixed(2);
      
      // Set shipping line with frontend amount
      wooDetails.shipping_lines = [{
        ...(existingShippingLine || {}),
        method_title: selectedRateId === "usps-priority-mail-express" ? "USPS Priority Mail Express" : "USPS Priority Mail",
        method_id: selectedRateId || "usps-priority-mail",
        total: (frontendShippingAmount / 100).toFixed(2),
        total_tax: "0.00"
      }];

      if (wooCommerceTaxAmount > 0) {
        wooDetails.tax_lines = [{
          rate_code: `US-${state}-STATE-TAX`,
          rate_id: 1,
          label: `${state} State Tax`,
          compound: false,
          tax_total: (wooCommerceTaxAmount / 100).toFixed(2),
          shipping_tax_total: "0.00",
          rate_percent: subtotal > 0 ? (wooCommerceTaxAmount / (subtotal * 100)) * 100 : 0
        }];
      } else {
        // Explicitly set empty tax lines to remove any existing ones
        wooDetails.tax_lines = [];
      }
    }
  }

  await fetchWooCommerce<WooOrder>(
    `wc/v3/orders/${woo_order_id}`,
    "Failed to sync address with WooCommerce",
    null,
    "PUT",
    wooDetails
  );
}