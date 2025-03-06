import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/custom/v1/cart/add`;

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

    if (!response.ok) throw new Error("Failed to add item to cart");

    const updatedCart = await response.json();
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
