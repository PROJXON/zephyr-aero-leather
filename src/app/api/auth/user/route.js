import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userCookie = cookieStore.get("userData")?.value;

    if (userCookie) {
      try {
        const decodedUserData = JSON.parse(atob(userCookie)); 
        return NextResponse.json({ isAuthenticated: true, user: decodedUserData });
      } catch (error) {
        console.error("Error parsing userData cookie:", error);
      }
    }

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    const userResponse = await fetch(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!userResponse.ok) throw new Error("Failed to fetch WordPress user");

    const userData = await userResponse.json();
    const userId = userData.id;

    const authHeader = `Basic ${Buffer.from(
      `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64")}`;

    const customerResponse = await fetch(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers/${userId}`,
      { headers: { Authorization: authHeader } }
    );

    if (!customerResponse.ok) throw new Error("Failed to fetch WooCommerce customer");

    const customerData = await customerResponse.json();

    const response = NextResponse.json({ isAuthenticated: true, user: customerData });

    response.cookies.set("userData", Buffer.from(JSON.stringify(customerData)).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Auth check error:", error.message);

    const response = NextResponse.json({ isAuthenticated: false, user: null });

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
