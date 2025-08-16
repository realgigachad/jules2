import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Set the cookie with an immediate expiration date to clear it
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
