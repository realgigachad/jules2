import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Redirect root path to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }

  // Allow public routes and static assets to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/logout') ||
    !pathname.startsWith('/api/cms') && !pathname.startsWith('/fonok') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // At this point, we are only dealing with protected routes.
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
  matcher: ['/((?!_next/static/favicon.ico|api/auth/login).*)'],
};
