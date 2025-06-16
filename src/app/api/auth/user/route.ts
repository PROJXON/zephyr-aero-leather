import { NextResponse } from "next/server";
import getCookieInfo from "../../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../../lib/fetchWooCommerce";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest): Promise<Response> {
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

    const userData = await fetchWooCommerce("wp/v2/users/me", "Failed to fetch WordPress user", token);
    if (typeof userData === "object" && userData !== null && "id" in userData) {
      const userId = (userData as { id: number }).id;
      const customerData = await fetchWooCommerce(`wc/v3/customers/${userId}`, "Failed to fetch WooCommerce customer");
      const response = NextResponse.json({ isAuthenticated: true, user: customerData });

      response.cookies.set("userData", Buffer.from(JSON.stringify(customerData)).toString("base64"), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } else {
      throw new Error("Invalid user data received from WooCommerce");
    }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      const err = error as { message: string };
      console.error("Auth check error:", err.message);
    } else {
      console.error("Auth check error:", error);
    }

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
