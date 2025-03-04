import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    // First, get the JWT token
    const jwtResponse = await axios.post(`${process.env.WOOCOMMERCE_API_URL}/wp-json/jwt-auth/v1/token`, {
      username: email,
      password: password,
    });
    
    const jwtData = jwtResponse.data;
    const token = jwtData.token;
    
    if (!token) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
    
    // Now we have the token, use it to get detailed user data
    try {
      // Get WordPress user data
      const userResponse = await axios.get(
        `${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const userId = userResponse.data.id;
      
      // Then get WooCommerce customer data
      const authHeader = `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
      ).toString('base64')}`;
      
      const customerResponse = await axios.get(
        `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers/${userId}`,
        {
          headers: { Authorization: authHeader },
        }
      );
      
      // Create the response with the token and user data
      const res = NextResponse.json({
        success: true,
        user: customerResponse.data
      }, { status: 200 });
      
      // Set the token cookie (HTTP-only for security)
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      // Also set a non-HTTP-only cookie to indicate auth status to the client
      res.cookies.set("isAuthenticated", "true", {
        httpOnly: false, // Client JavaScript can read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      console.log('Login successful, returning complete user data');
      return res;
    } catch (error) {
      console.error("Error fetching detailed user data:", error);
      
      // If we can't get detailed data, return basic data from JWT response
      const basicUserData = {
        email: jwtData.user_email,
        username: jwtData.user_nicename,
        name: jwtData.user_display_name,
        first_name: jwtData.user_display_name.split(' ')[0] || jwtData.user_display_name,
        id: jwtData.user_id
      };
      
      const res = NextResponse.json({
        success: true,
        user: basicUserData
      }, { status: 200 });
      
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      // Also set a non-HTTP-only cookie to indicate auth status to the client
      res.cookies.set("isAuthenticated", "true", {
        httpOnly: false, // Client JavaScript can read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      console.log('Login successful, returning basic user data');
      return res;
    }
  } catch (error) {
    let errorMessage = "Invalid email or password";
    
    if (error.response && error.response.data) {
      const errorData = typeof error.response.data === "string"
        ? error.response.data.replace(/<\/?[^>]+(>|$)/g, "").trim()
        : error.response.data.message;
      
      if (errorData && errorData.includes("is not registered on this site")) {
        errorMessage = `This email is not registered on this site.`;
      } else {
        errorMessage = "Incorrect password";
      }
    }
    
    console.error("Login error:", error.message);
    return NextResponse.json({ error: errorMessage }, { status: error.response?.status || 401 });
  }
}