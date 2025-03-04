import { NextResponse } from "next/server";

export async function POST() {
  const response = new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  // ✅ Properly clear authentication cookies
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
