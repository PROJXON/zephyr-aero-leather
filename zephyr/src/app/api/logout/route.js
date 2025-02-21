import { NextResponse } from "next/server";
import { cookies } from "next/headers"; 

export async function POST(req) {
  const cookieStore =  await cookies()
  cookieStore.set("token", "", { expires: new Date(0), path: "/" }); 

  return NextResponse.json({ message: "Logged out" });
}
