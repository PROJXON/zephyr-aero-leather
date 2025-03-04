import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  // Use the cookies API correctly in Next.js 13/14
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({
      isAuthenticated: false,
      user: null
    });
  }

  try {
    // Verify the token with WordPress
    const userResponse = await axios.get(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const userId = userResponse.data.id;

    // Get WooCommerce customer data
    const authHeader = `Basic ${Buffer.from(
      `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString('base64')}`;

    const customerResponse = await axios.get(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers/${userId}`,
      {
        headers: { Authorization: authHeader },
      }
    );

    return NextResponse.json({
      isAuthenticated: true,
      user: customerResponse.data
    });
  } catch (error) {
    console.error("Auth check error:", error.message);
    
    // If token validation fails, clear the cookies
    const response = NextResponse.json({
      isAuthenticated: false,
      user: null
    });

    // Clear auth cookies on failed validation
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "Strict",
      path: "/"
    });

    response.cookies.set("isAuthenticated", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "Strict",
      path: "/"
    });

    return response;
  }
}