import { NextResponse } from "next/server";
import Cookies from "cookies";

export async function POST(req) {
  const cookies = new Cookies(req);
  cookies.set("token", "", { expires: new Date(0) }); // Expire the cookie

  return NextResponse.json({ message: "Logged out" });
}
