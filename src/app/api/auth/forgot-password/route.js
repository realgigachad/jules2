/**
 * @fileoverview This file defines the API route for the "forgot password" functionality.
 * Note: This is not a standard password reset implementation. It's a hard-coded
 * reset specifically for the 'fonok' user to a default password.
 */
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

/**
 * Handles the POST request to reset the admin's password.
 * This endpoint is public. For security, it always returns a generic success
 * message to prevent attackers from discovering valid usernames.
 * @param {Request} req - The incoming request object.
 * @returns {NextResponse} A generic success response.
 */
export async function POST(req) {
  await dbConnect();

  try {
    const { username } = await req.json();

    // This functionality is hard-coded to only work for the 'fonok' user.
    if (username !== 'fonok') {
      // To prevent username enumeration, we send a generic success message
      // even if the username is wrong. The action simply won't happen.
      return NextResponse.json({ success: true, message: 'If a user with that name exists, the password has been reset.' });
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
    return NextResponse.json({ success: true, message: 'If a user with that name exists, the password has been reset.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    // Even on a server error, send a generic success-like message to prevent leaking information.
    // The actual error is logged on the server for debugging.
    return NextResponse.json({ success: true, message: 'An error occurred during the process.' });
  }
}
