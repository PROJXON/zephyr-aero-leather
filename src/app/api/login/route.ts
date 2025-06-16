import { NextResponse } from "next/server";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { email, password }: { email: string; password: string } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const jwtRes = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const rawJwtResponse = await jwtRes.text();

    if (!jwtRes.ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let jwtData: { token: string };
    try {
      jwtData = JSON.parse(rawJwtResponse);
    } catch (err) {
      if (rawJwtResponse.includes("<!DOCTYPE html>")) {
        console.error("Received HTML instead of JSON – likely Jetpack login screen");
      } else {
        console.error("Failed to parse JWT response as JSON:", err);
      }
      return NextResponse.json({ error: "Unexpected response from auth server" }, { status: 500 });
    }

    const token: string | undefined = jwtData.token;
    if (!token) return NextResponse.json({ error: "Authentication failed" }, { status: 401 });

    let userData: any = null;
    const userDataError = "Failed to fetch user data";

    try {
      userData = await fetchWooCommerce("wp/v2/users/me", userDataError, token);
    } catch {
      return NextResponse.json({ error: userDataError }, { status: 500 });
    }
    const userId: number = userData.id;

    let customerData: any = null;
    customerData = await fetchWooCommerce(`wc/v3/customers/${userId}`, "Error fetching WooCommerce customer data:");

    if (!customerData) {
      return NextResponse.json({ error: "Failed to fetch WooCommerce customer Data" }, { status: 500 });
    }

    const res = new NextResponse(JSON.stringify({ success: true, user: customerData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    res.cookies.set("userData", Buffer.from(JSON.stringify(customerData)).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);

    const response = new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

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
