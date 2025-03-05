import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/store/cart`;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartResponse = await fetch(API_BASE_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!cartResponse.ok) throw new Error("Failed to fetch WooCommerce cart");

    const cartData = await cartResponse.json();
    return NextResponse.json(cartData);
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
