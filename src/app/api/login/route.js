import { NextResponse } from "next/server"
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";

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

    const rawJwtResponse = await jwtRes.text(); // get raw text
    console.log("JWT raw response:", rawJwtResponse); // log it

    if (!jwtRes.ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let jwtData;
    try {
      jwtData = JSON.parse(rawJwtResponse);
    } catch (err) {
      if (rawJwtResponse.includes('<!DOCTYPE html>')) {
        console.error("Received HTML instead of JSON – likely Jetpack login screen.");
      } else {
        console.error("Failed to parse JWT response as JSON:", err);
      }
      return NextResponse.json({ error: "Unexpected response from auth server" }, { status: 500 });
    }

    const token = jwtData.token;
    if (!token) return NextResponse.json({ error: "Authentication failed" }, { status: 401 })

    // ✅ Step 2: Fetch WordPress user data
    let userData = null
    const userDataError = "Failed to fetch user data"

    try {
      userData = await fetchWooCommerce("wp/v2/users/me", userDataError, token)
    } catch {
      return NextResponse.json({ error: userDataError }, { status: 500 })
    }
    const userId = userData.id

    let customerData = null
    // ✅ Step 3: Fetch WooCommerce customer data
    customerData = await fetchWooCommerce(`wc/v3/customers/${userId}`, "Error fetching WooCommerce customer data:")

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
