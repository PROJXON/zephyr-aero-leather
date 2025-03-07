import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/custom/v1/cart`;

export async function POST(req) {
  try {
    const { productId, quantity } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    const responseData = await response.json();
    console.log("✅ WooCommerce Cart Response:", responseData);

    if (!response.ok) throw new Error("Failed to add item to cart");

    // ✅ Fetch updated cart
    const cartResponse = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/custom/v1/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cartData = await cartResponse.json();
    return NextResponse.json({ success: true, cart: cartData });

  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
