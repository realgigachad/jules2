/**
 * @fileoverview This file defines the API route for user logout.
 * It handles POST requests to /api/auth/logout and clears the user's
 * session by expiring the 'token' cookie.
 */
import { NextResponse } from 'next/server';

/**
 * Handles the POST request for user logout.
 * @param {Request} req - The incoming request object.
 * @returns {NextResponse} A response object confirming logout and clearing the cookie.
 */
export async function POST(req) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // To log the user out, we overwrite the 'token' cookie with an empty value
    // and set its expiration date to a time in the past.
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set to a past date to expire the cookie immediately.
      path: '/',
    });

    return response;
  } catch (error) {
    // This is unlikely to be hit in this specific route, but it's good practice.
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
