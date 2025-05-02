import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // In a real application, you would:
    // 1. Validate the credentials against your database
    // 2. Hash and compare passwords
    // 3. Generate a secure session token
    // For now, we'll use a simple mock authentication

    if (email === "test@example.com" && password === "password123") {
      const user = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      };

      const cookieStore = cookies();
      cookieStore.set("user", JSON.stringify(user), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return NextResponse.json({ user });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 