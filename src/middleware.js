import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Redirect root path to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }

  // 2. Skip middleware for static files, public routes, and framework routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 3. Handle admin route protection
  if (pathname.startsWith('/api/cms') || pathname.startsWith('/fonok')) {
    // Allow access to login page
    if (pathname === '/fonok' || pathname === '/fonok/login') {
      return NextResponse.next();
    }

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/fonok';
      if (pathname.startsWith('/api/cms')) {
         return new NextResponse(JSON.stringify({ success: false, message: 'Authentication required' }), { status: 401 });
      }
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.userId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      const url = req.nextUrl.clone();
      url.pathname = '/fonok';
       if (pathname.startsWith('/api/cms')) {
         return new NextResponse(JSON.stringify({ success: false, message: 'Invalid token' }), { status: 401 });
      }
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with /api/auth
  // as those are handled within the middleware logic
  matcher: [
    '/((?!api/auth).*)'
  ],
};
