/**
 * @fileoverview This file defines the API route for a development-only password reset.
 *
 * !!! WARNING: HIGHLY INSECURE - FOR DEVELOPMENT & TESTING ONLY !!!
 * This endpoint provides a simple, unauthenticated way to reset the 'fonok'
 * admin user's password to a known default ('abc123').
 *
 * It is INTENTIONALLY insecure to facilitate rapid testing during development.
 *
 * This entire endpoint is wrapped in a check for `process.env.NODE_ENV !== 'production'`
 * and will NOT run in a production environment to prevent this backdoor from being
 * exposed on a live site.
 *
 * DO NOT REMOVE THE NODE_ENV CHECK.
 * IT IS STRONGLY RECOMMENDED TO REMOVE THIS ENTIRE FILE BEFORE DEPLOYMENT.
 */
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // !!! SECURITY: This check ensures this dangerous endpoint is NEVER active in production.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'This endpoint is disabled in production.' }, { status: 404 });
  }

  await dbConnect();

  try {
    const { username } = await req.json();

    // This functionality is hard-coded to only work for the 'fonok' user.
    if (username !== 'fonok') {
      // To prevent username enumeration, we send a generic success message
      // even if the username is wrong. The action simply won't happen.
      return NextResponse.json({ success: true, message: 'Password reset trigger acknowledged.' });
    }

    const user = await User.findOne({ username: 'fonok' });

    if (user) {
      // Hash the default password 'abc123'.
      const hashedPassword = await bcrypt.hash('abc123', 10);
      user.password = hashedPassword;
      // Force the user to change this default password on their next login.
      user.forcePasswordChange = true;
      await user.save();
    }

    // Return the same generic message regardless of whether the user was found.
    return NextResponse.json({ success: true, message: 'Password reset trigger acknowledged.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    // Even on a server error, send a generic success-like message to prevent leaking information.
    // The actual error is logged on the server for debugging.
    return NextResponse.json({ success: true, message: 'An error occurred during the process.' });
  }
}
