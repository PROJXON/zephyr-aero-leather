import { NextRequest, NextResponse } from "next/server";
import getWooCommerceApi from "../../../../lib/woocommerceApi";
import type { CartItem, State } from "../../../../types/types";

export async function POST(request: NextRequest) {
  try {
    const { items, state, zipCode, shippingAmount } = await request.json();

    // Validate required fields
    if (!items || !state || !zipCode) {
      return NextResponse.json(
        { error: "Missing required fields: items, state, or zipCode" },
        { status: 400 }
      );
    }

    // Validate that items have valid product IDs
    if (!items.length || items.some((item: CartItem) => !item.id)) {
      return NextResponse.json(
        { error: "Invalid items: missing product IDs" },
        { status: 400 }
      );
    }

    // Get WooCommerce API instance
    const api = getWooCommerceApi();

    // Create a temporary order to get WooCommerce tax calculation
    const orderData = {
      status: "pending",
      billing: {
        state: state,
        postcode: zipCode,
        country: "US"
      },
      shipping: {
        state: state,
        postcode: zipCode,
        country: "US"
      },
      line_items: items.map((item: CartItem) => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      shipping_lines: shippingAmount ? [
        {
          method_title: "USPS Priority Mail",
          method_id: "usps-priority-mail",
          total: (shippingAmount / 100).toFixed(2) // Convert cents to dollars
        }
      ] : [],
      calculate_totals: true
    };

    console.log("Creating WooCommerce order for tax calculation:", orderData);

    const response = await api.post("orders", orderData);
    const order = response.data;

    // Extract tax amount (convert from dollars to cents)
    const taxAmount = Math.round(parseFloat(order.total_tax || "0") * 100);

    // Clean up the temporary order
    await api.delete(`orders/${order.id}`, { force: true });

    return NextResponse.json({ 
      taxAmount,
      success: true 
    });

  } catch (error: any) {
    console.error("Tax estimate error:", error);
    
    // Log more details about the error
    if (error.response) {
      console.error("WooCommerce API Error Details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.response.config?.url
      });
    }
    
    return NextResponse.json(
      { error: "Failed to calculate tax estimate" },
      { status: 500 }
    );
  }
} 