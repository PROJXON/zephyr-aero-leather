import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/account", "/order-history"];
const authPages = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const hasToken = request.cookies.has("token");
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthPage = authPages.some(page => path.startsWith(page));

  // If user is on order history without token, redirect to home
  if (!hasToken && path === "/order-history") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is on a protected route without token, redirect to login
  if (!hasToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is on auth pages with token, redirect to home
  if (hasToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
