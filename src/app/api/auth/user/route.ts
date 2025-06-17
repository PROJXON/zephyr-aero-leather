import { NextResponse } from "next/server";
import getCookieInfo from "../../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../../lib/fetchWooCommerce";
import type { WordPressUser } from "../../../../../types/types";

export async function GET(): Promise<Response> {
  try {
    const [token, userCookie] = await getCookieInfo();

    if (userCookie) {
      try {
        const decodedUserData = JSON.parse(atob(userCookie));
        return NextResponse.json({ isAuthenticated: true, user: decodedUserData });
      } catch (error) {
        console.error("Error parsing userData cookie:", error);
      }
    }

    if (!token) return NextResponse.json({ isAuthenticated: false, user: null });

    const userData = await fetchWooCommerce<WordPressUser>("wp/v2/users/me", "Failed to fetch WordPress user", token);
    const userId = userData.id;
    const customerData = await fetchWooCommerce(`wc/v3/customers/${userId}`, "Failed to fetch WooCommerce customer");
    const response = NextResponse.json({ isAuthenticated: true, user: customerData });

    response.cookies.set("userData", Buffer.from(JSON.stringify(customerData)).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error("Auth check error:", error instanceof Error ? error.message : 'Unknown error');

    const response = NextResponse.json({ isAuthenticated: false, user: null });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    });

    response.cookies.set("userData", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    });

    return response;
  }
}
