import { NextResponse } from "next/server";
import Cookies from "cookies";

export async function GET(req) {
  const cookies = new Cookies(req);
  const token = cookies.get("token");

  return NextResponse.json({ isAuthenticated: !!token });
}
