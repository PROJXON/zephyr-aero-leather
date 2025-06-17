import { NextResponse } from "next/server";

export async function POST(): Promise<Response> {
  const response = new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
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
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });

  return response;
}
