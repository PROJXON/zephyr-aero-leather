import { NextResponse } from "next/server";

const protectedRoutes = ["/account", "/order-history"];
const authPages = ["/login", "/register"];

export function middleware(request) {
  const hasToken = request.cookies.has("token");
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthPage = authPages.some(page => path.startsWith(page));

  if (!hasToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
