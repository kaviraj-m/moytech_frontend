import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define paths that are accessible without authentication
  const isPublicPath = path === '/login';
  
  // Check if the user is authenticated by looking for the user token in cookies
  const token = request.cookies.get('user')?.value;
  
  // If the path is public and the user is authenticated, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Continue with the request if authentication check passes
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    // Match all paths except for static files, api routes, _next, and public assets
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:jpg|jpeg|gif|png|svg)).*)',
  ],
};