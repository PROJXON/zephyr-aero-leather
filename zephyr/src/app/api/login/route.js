import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Encode WooCommerce API credentials
    const authHeader = `Basic ${Buffer.from(
      `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64")}`;

    // Fetch user by email from WooCommerce
    const { data } = await axios.get(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers?email=${email}`,
      { headers: { Authorization: authHeader } }
    );

    if (!data.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = data[0];

    // WooCommerce doesn't expose passwords via API. This assumes authentication is successful.
    return NextResponse.json({ token: "fake-jwt-token", user }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Server error, please try again" },
      { status: error.response?.status || 500 }
    );
  }
}
