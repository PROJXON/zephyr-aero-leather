import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userCookie = cookieStore.get("userData")?.value;

    // ✅ 1️⃣ Decode `userData` properly
    if (userCookie) {
      try {
        const decodedUserData = JSON.parse(atob(userCookie)); // Decode Base64
        return NextResponse.json({ isAuthenticated: true, user: decodedUserData });
      } catch (error) {
        console.error("Error parsing userData cookie:", error);
      }
    }

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    // ✅ 2️⃣ Fetch user data if no userData in cookies
    const userResponse = await axios.get(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const userId = userResponse.data.id;

    const authHeader = `Basic ${Buffer.from(
      `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64")}`;

    const customerResponse = await axios.get(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers/${userId}`,
      { headers: { Authorization: authHeader } }
    );

    const userData = customerResponse.data;

    // ✅ 3️⃣ Store `userData` in cookies in readable format
    const response = NextResponse.json({ isAuthenticated: true, user: userData });

    response.cookies.set("userData", Buffer.from(JSON.stringify(userData)).toString("base64"), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Auth check error:", error.message);

    // ✅ 4️⃣ Clear cookies if token is invalid
    const response = NextResponse.json({ isAuthenticated: false, user: null });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
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
