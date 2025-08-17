import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_FILE = /\.(.*)$/;
const PROTECTED_ROUTES = ['/fonok/dashboard', '/fonok/trips', '/fonok/articles', '/fonok/settings', '/api/cms'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Redirect root path to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }

  // Check if the route is a protected admin route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // At this point, we are dealing with a protected route.
  // Get token from cookies
  const tokenCookie = req.cookies.get('token');
  const token = tokenCookie?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/fonok';
    // For API routes, return 401 Unauthorized
    if (pathname.startsWith('/api/cms')) {
       return new NextResponse(JSON.stringify({ success: false, message: 'Authentication required' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }
    // For page routes, redirect to login
    return NextResponse.redirect(url);
  }

  // Verify the token
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    const url = req.nextUrl.clone();
    url.pathname = '/fonok';
    if (pathname.startsWith('/api/cms')) {
       return new NextResponse(JSON.stringify({ success: false, message: 'Invalid or expired token' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }
    // Clear the invalid cookie before redirecting
    const response = NextResponse.redirect(url);
    response.cookies.set('token', '', { expires: new Date(0) });
    return response;
  }
}

export const config = {
  // This matcher is broad, the logic inside the middleware handles specifics.
  matcher: ['/((?!_next/static/favicon.ico).*)'],
};
