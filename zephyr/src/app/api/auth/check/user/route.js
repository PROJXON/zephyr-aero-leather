import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, user: null }, { status: 200 });
  }

  try {
    // Fetch the user's ID first
    const userResponse = await axios.get(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userId = userResponse.data.id;

    // Use Basic Authentication for WooCommerce API
    const authHeader = `Basic ${Buffer.from(`${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`).toString('base64')}`;

    // Fetch detailed customer data using WooCommerce customer endpoint
    const customerResponse = await axios.get(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers/${userId}`, {
      headers: { Authorization: authHeader },
    });

    // Ensure customer data is present before responding
    if (customerResponse.data) {
      console.log("Customer Data:", customerResponse.data); // Check if it includes first_name, last_name, etc.

      return NextResponse.json({
        isAuthenticated: true,
        user: customerResponse.data,
      }, { status: 200 });
    } else {
      return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
    }

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
  }
}