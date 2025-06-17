import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import type { RegisterRequest } from "../../../../types/types";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { name, email, password }: RegisterRequest = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const authHeader = `Basic ${Buffer.from(
      `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64")}`;

    const { data } = await axios.post(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/customers`,
      {
        email,
        first_name: name,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number } };
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: err.response?.data?.message || "Server error, please try again" },
      { status: err.response?.status || 500 }
    );
  }
}
