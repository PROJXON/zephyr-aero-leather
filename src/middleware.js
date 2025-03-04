import { NextResponse } from 'next/server';

// List of routes that require authentication
const protectedRoutes = [
  '/account',
  '/orders',
  '/checkout',
  // Add other protected routes here
];

export function middleware(request) {
  const token = request.cookies.get('token');
  const path = request.nextUrl.pathname;
  
  // Only check protected routes
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthPage = path.startsWith('/login');
  
  // If trying to access protected route without token
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If trying to access login page with token
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};