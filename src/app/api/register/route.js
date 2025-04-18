import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Encode WooCommerce API credentials
    const authHeader = `Basic ${Buffer.from(
      `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64")}`;

    // Create user in WooCommerce
    const { data } = await axios.post(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers`,
      {
        email,
        first_name: name, // WooCommerce uses `first_name` instead of `username`
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Server error, please try again" },
      { status: error.response?.status || 500 }
    );
  }
}
