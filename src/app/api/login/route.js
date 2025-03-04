import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ✅ Step 1: Get the JWT token from WooCommerce
    const jwtResponse = await axios.post(`${process.env.WOOCOMMERCE_API_URL}/wp-json/jwt-auth/v1/token`, {
      username: email,
      password: password,
    });

    const jwtData = jwtResponse.data;
    const token = jwtData.token;

    if (!token) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    try {
      // ✅ Step 2: Fetch WordPress user data
      const userResponse = await axios.get(
        `${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userId = userResponse.data.id;

      // ✅ Step 3: Fetch WooCommerce customer data
      const authHeader = `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
      ).toString("base64")}`;

      const customerResponse = await axios.get(
        `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers/${userId}`,
        {
          headers: { Authorization: authHeader },
        }
      );

      const userData = customerResponse.data;

      // ✅ Step 4: Create the response with cookies
      const res = new NextResponse(
        JSON.stringify({ success: true, user: userData }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

      // ✅ Set the authentication token as HTTP-only for security
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // ✅ Store `userData` in a Base64-encoded cookie for client-side access
      res.cookies.set("userData", Buffer.from(JSON.stringify(userData)).toString("base64"), {
        httpOnly: false, // Can be read by the client-side JavaScript
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return res;
    } catch (error) {
      console.error("Error fetching detailed user data:", error);

      // ✅ Step 5: If user data fetch fails, create a response with limited data
      const basicUserData = {
        email: jwtData.user_email,
        username: jwtData.user_nicename,
        name: jwtData.user_display_name,
        first_name: jwtData.user_display_name.split(" ")[0] || jwtData.user_display_name,
        id: jwtData.user_id,
      };

      const res = new NextResponse(
        JSON.stringify({ success: true, user: basicUserData }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

      // ✅ Set token and store basic user data
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      res.cookies.set("userData", Buffer.from(JSON.stringify(basicUserData)).toString("base64"), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return res;
    }
  } catch (error) {
    console.error("Login error:", error.message);

    // ✅ Step 6: If authentication fails, return an error and clear cookies
    const response = new NextResponse(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
      sameSite: "Strict",
      path: "/",
    });

    response.cookies.set("userData", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "Strict",
      path: "/",
    });

    return response;
  }
}
