import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/store/cart/items`;

export async function POST(req) {
  try {
    const { productId, quantity } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authHeader = "Basic " + Buffer.from(
      `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64");

    const addItemResponse = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    if (!addItemResponse.ok) throw new Error("Failed to add item to cart");

    const updatedCart = await addItemResponse.json();
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
