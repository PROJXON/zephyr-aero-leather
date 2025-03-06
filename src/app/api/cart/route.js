import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/custom/v1/cart`;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch saved cart");

    const cartData = await response.json();
    return NextResponse.json(cartData);
  } catch (error) {
    console.error("Error fetching saved cart:", error.message);
    return NextResponse.json({ error: "Failed to fetch saved cart" }, { status: 500 });
  }
}
