import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Use `cookies()` instead

export async function GET() {
  const cookieStore = await cookies(); // This is now correct in Next.js App Router
  const token = cookieStore.get("token")?.value; // Get token safely

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  return NextResponse.json({ isAuthenticated: true }, { status: 200 });
}
