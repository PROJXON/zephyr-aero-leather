import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const response = await axios.post(`${process.env.WOOCOMMERCE_API_URL}/wp-json/jwt-auth/v1/token`, {
      username: email,
      password: password,
    });

    const data = response.data;

    const res = NextResponse.json({ success: true, user: data.user }, { status: 200 });

    // Set authentication token in a secure HTTP-only cookie
    res.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    let errorMessage = "Invalid email or password";

    if (error.response && error.response.data) {
      const errorData = typeof error.response.data === "string" ? error.response.data.replace(/<\/?[^>]+(>|$)/g, "").trim() : error.response.data.message;

      if (errorData && errorData.includes("is not registered on this site")) {
        errorMessage = `This email is not registered on this site.`;
      } else {
        errorMessage = "Incorrect password";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: error.response?.status || 401 });
  }
}
