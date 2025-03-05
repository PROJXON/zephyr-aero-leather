import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/cart/update`;

export async function POST(req) {
  try {
    const { productId, quantity } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateResponse = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId, quantity }),
    });

    if (!updateResponse.ok) throw new Error("Failed to update cart quantity");

    const updatedCart = await updateResponse.json();
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error.message);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
