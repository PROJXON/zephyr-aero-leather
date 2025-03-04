import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ 
    success: true,
    message: "Logged out successfully" 
  });

  // Clear the secure token cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "Strict",
    path: "/"
  });

  // Clear the client-visible auth flag cookie
  response.cookies.set("isAuthenticated", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "Strict",
    path: "/"
  });

  return response;
}