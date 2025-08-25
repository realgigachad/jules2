/**
 * @fileoverview This file defines the API route for changing a user's password.
 * It handles POST requests to /api/auth/change-password, authenticates the user
 * via JWT, and updates their password in the database.
 */
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { isRateLimited } from '@/lib/rateLimiter';

/**
 * Handles the POST request to change a user's password.
 * This function handles two scenarios:
 * 1. A user voluntarily changing their password (requires `oldPassword`).
 * 2. A user being forced to change their password on first login (does not require `oldPassword`).
 * @param {Request} req - The incoming request object.
 * @returns {NextResponse} A response object confirming success or detailing an error.
 */
export async function POST(req) {
  await dbConnect();

  try {
    // Authenticate the user by verifying the JWT from the cookie.
    const tokenCookie = cookies().get('token');
    if (!tokenCookie) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    if (isRateLimited(userId)) {
        return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
    }

    const { oldPassword, newPassword } = await req.json();

    // If an old password is provided, this is a voluntary change.
    // We must verify the old password before proceeding.
    if (oldPassword) {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
        }
    }

    // This logic is the same for both forced and voluntary changes.
    // Validate the new password's length.
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Hash the new password before storing it.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database.
    // Also, set `forcePasswordChange` to false, as the requirement has now been met.
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      forcePasswordChange: false,
    });

    return NextResponse.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    // Specifically handle JWT errors for better client-side feedback.
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
