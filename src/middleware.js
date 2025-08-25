/**
 * @fileoverview This file defines the Next.js middleware, which runs before a request is completed.
 * It's used for routing, authentication, and authorization logic.
 */
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { limit } from './lib/rateLimiter';

/**
 * The main middleware function.
 * @param {import('next/server').NextRequest} req - The incoming request.
 * @returns {Promise<NextResponse>} The response to send back.
 */
export async function middleware(req) {
  const rateLimitResponse = await limit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { pathname } = req.nextUrl;

  // 1. Redirect the root path ('/') to the default language ('/en').
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }

  // 2. Define which routes are protected and require authentication.
  const protectedApiPrefixes = ['/api/cms', '/api/auth/change-password', '/api/uploads'];
  const protectedPagePrefix = '/fonok/';

  // Determine if the current route matches any of the protected prefixes.
  const isProtectedApiRoute = protectedApiPrefixes.some(prefix => pathname.startsWith(prefix));
  // The `/fonok` login page and `/fonok/password` forgot password page are not protected.
  const isProtectedPageRoute = pathname.startsWith(protectedPagePrefix) &&
                               pathname !== '/fonok';

  // If the route is not protected, continue to the requested page or API route.
  if (!isProtectedApiRoute && !isProtectedPageRoute) {
    return NextResponse.next();
  }

  // 3. For protected routes, check for a valid authentication token.
  const tokenCookie = req.cookies.get('token');
  const token = tokenCookie?.value;

  // If no token is found, deny access.
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/fonok'; // The login page URL.
    // For API routes, return a 401 Unauthorized JSON response.
    if (pathname.startsWith('/api/')) {
       return new NextResponse(JSON.stringify({ success: false, message: 'Authentication required' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }
    // For page routes, redirect the user to the login page.
    return NextResponse.redirect(url);
  }

  // 4. If a token is found, verify its validity.
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    // If the token is valid, allow the request to proceed.
    return NextResponse.next();
  } catch (err) {
    // If the token is invalid (e.g., expired or malformed), deny access.
    const url = req.nextUrl.clone();
    url.pathname = '/fonok';
    // For API routes, return a 401 Unauthorized JSON response.
    if (pathname.startsWith('/api/')) {
       return new NextResponse(JSON.stringify({ success: false, message: 'Invalid or expired token' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }
    // For page routes, create a redirect response.
    const response = NextResponse.redirect(url);
    // Clear the invalid cookie from the user's browser before redirecting.
    response.cookies.set('token', '', { expires: new Date(0) });
    return response;
  }
}

/**
 * The configuration object for the middleware.
 * The `matcher` specifies which paths the middleware should run on.
 */
export const config = {
  // This matcher is intentionally broad to catch all paths.
  // The logic inside the middleware function handles which routes are protected.
  // It excludes specific Next.js internal paths like static files and the favicon.
  matcher: ['/((?!_next/static/favicon.ico).*)'],
};
