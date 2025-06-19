import { NextResponse } from "next/server";
import { WooOrder, WooCommerceAddress, WooOrderMetaData } from "../../../../../types/woocommerce";
import { WordPressUser, Product, State } from "../../../../../types/types";
import fetchWooCommerce from "../../../../../lib/fetchWooCommerce";
import { getItemInfoById } from "../../../../../lib/getItemInfo";
import getCookieInfo from "../../../../../lib/getCookieInfo";
import { syncTotals } from "../../../../../lib/syncTotals";

// Type guard for WooCommerceAddress
function isValidShippingAddress(shipping: unknown): shipping is WooCommerceAddress {
  return (
    typeof shipping === 'object' &&
    shipping !== null &&
    'state' in shipping &&
    'postcode' in shipping &&
    typeof (shipping as WooCommerceAddress).state === 'string' &&
    typeof (shipping as WooCommerceAddress).postcode === 'string'
  );
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { productId, quantity, orderId } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const finalOrderId = orderId;

    if (!finalOrderId) {
      // Get user data from token
      const userData = await fetchWooCommerce<WordPressUser>("wp/v2/users/me", "Failed to fetch user data", token);
      const { subtotalInDollars } = await getItemInfoById(productId, quantity);

      const initialMetaData: WooOrderMetaData[] = [
        {
          key: "user_local_time",
          value: new Date().toISOString()
        },
        {
          key: "shipping_rate_id",
          value: "usps-priority-mail"
        },
        {
          key: "tax_rate",
          value: "0"
        }
      ];

      const newOrder = await fetchWooCommerce<WooOrder>("wc/v3/orders", "Failed to create order", null, "POST", {
        customer_id: userData.id,
        status: "pending",
        line_items: [{
          product_id: productId,
          quantity,
          subtotal: subtotalInDollars,
          total: subtotalInDollars,
          total_tax: "0.00"
        }],
        total: subtotalInDollars,
        total_tax: "0.00",
        shipping_total: "0.00",
        shipping_lines: [{
          method_title: "USPS Priority Mail",
          method_id: "usps-priority-mail",
          total: "0.00",
          total_tax: "0.00"
        }],
        tax_lines: [],
        meta_data: initialMetaData
      });
      return NextResponse.json({ success: true, cart: newOrder, orderId: newOrder.id });
    }

    const orderData = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${finalOrderId}`, "Failed to fetch order");

    // Find if the item already exists in the order
    const existingItem = orderData.line_items.find((item) => item.product_id === productId);

    // Preserve all existing line items and update/add the new one
    const updatedLineItems = existingItem 
      ? orderData.line_items.map(item => 
          item.product_id === productId 
            ? { ...item, quantity } 
            : item
        )
      : [...orderData.line_items, { product_id: productId, quantity }];

    // Get the current shipping rate ID from meta data
    const shippingRateId = orderData.meta_data?.find(meta => meta.key === "shipping_rate_id")?.value || "usps-priority-mail";
    
    // Get the current shipping address if it exists
    const shipping = orderData.shipping;
    
    // Calculate totals if we have a shipping address
    let shippingTotal = "0.00";
    let taxRate = "0";
    let allProducts: Product[] = [];
    let total = "0.00";
    
    if (isValidShippingAddress(shipping)) {
      allProducts = await fetchWooCommerce<Product[]>("wc/v3/products", "Failed to fetch products");
      const totals = syncTotals(updatedLineItems.map(item => ({ id: item.product_id, quantity: item.quantity })), allProducts, shipping.state as State, shipping.postcode, shippingRateId as string);
      shippingTotal = (totals.shipping / 100).toFixed(2);
      taxRate = totals.taxRate.toString();
      total = (totals.total / 100).toFixed(2);
    }

    const updatedMetaData: WooOrderMetaData[] = [
      {
        key: "user_local_time",
        value: new Date().toISOString()
      },
      {
        key: "shipping_rate_id",
        value: shippingRateId
      },
      {
        key: "tax_rate",
        value: taxRate
      }
    ];

    // Get the existing shipping line
    const existingShippingLine = orderData.shipping_lines[0];

    // Update the order with preserved line items and update the existing shipping line
    const updatedCart = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${finalOrderId}`, "Failed to add item to cart", null, "PUT", {
      line_items: updatedLineItems,
      total: total,
      shipping_total: shippingTotal,
      shipping_lines: [{
        ...(existingShippingLine || {}), // Preserve existing line's ID and other fields
        method_title: "USPS Priority Mail",
        method_id: "usps-priority-mail",
        total: shippingTotal,
        total_tax: "0.00"
      }],
      tax_lines: [],
      meta_data: updatedMetaData
    });
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("Error in cart/item route:", error);
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const { orderId, productId }: { orderId: number; productId: number } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No order ID provided" }, { status: 400 });

    const orderData = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${orderId}`, "Failed to fetch order");

    const updatedItems = orderData.line_items
      .filter((item) => item.product_id !== productId)
      .map((item) => ({ id: item.id, quantity: item.quantity }));

    await fetchWooCommerce<WooOrder>("wc/v3/orders", "Failed to remove item", null, "PUT", { line_items: updatedItems });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error removing item:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<Response> {
  const updateErrorMessage = "Failed to update cart item";

  try {
    const { orderId, line_items }: { orderId: number; line_items: Array<{ id: number; quantity: number }> } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No pending order found" }, { status: 400 });

    const updatedItems = line_items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const updatedCart = await fetchWooCommerce<WooOrder>('customcarteditor/v1/update-cart', updateErrorMessage, token, "POST", {
      orderId,
      line_items: updatedItems,
    });
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: unknown) {
    console.error("Error updating cart item:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: updateErrorMessage }, { status: 500 });
  }
}