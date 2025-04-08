import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ✅ Step 1: Get JWT token from WooCommerce
    const jwtRes = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    if (!jwtRes.ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const jwtData = await jwtRes.json();
    const token = jwtData.token;

    if (!token) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // ✅ Step 2: Fetch WordPress user data
    const userRes = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    const userData = await userRes.json();
    const userId = userData.id;

    let customerData = null;

    // ✅ Step 3: Fetch WooCommerce customer data
    try {
      const authHeader = `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
      ).toString("base64")}`;

      const customerRes = await fetch(
        `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers/${userId}`,
        { headers: { Authorization: authHeader } }
      );

      if (customerRes.ok) {
        customerData = await customerRes.json();
      }
    } catch (error) {
      console.error("Error fetching WooCommerce customer data:", error);
    }

    if (!customerData) {
      return NextResponse.json({ error: "Failed to fetch WooCommerce customer Data" }, { status: 500 });
    }

    // ✅ Step 4: Create response with cookies
    const res = new NextResponse(JSON.stringify({ success: true, user: customerData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    res.cookies.set("userData", Buffer.from(JSON.stringify(customerData)).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);

    // ✅ Step 5: Return error and clear cookies if login fails
    const response = new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "Strict",
      path: "/",
    });

    response.cookies.set("userData", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "Strict",
      path: "/",
    });

    return response;
  }
}
