/**
 * @fileoverview This file defines the API route for user login.
 * It handles POST requests to /api/auth/login, authenticates users,
 * and sets a JWT in a secure, httpOnly cookie.
 */
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

/**
 * Handles the POST request for user login.
 * @param {Request} req - The incoming request object.
 * @returns {NextResponse} A response object with user data and a cookie on success, or an error message on failure.
 */
export async function POST(req) {
  await dbConnect();

  try {
    const { username, password } = await req.json();

    // Basic validation
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      // Use a generic error message to avoid revealing whether the username exists
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // If authentication is successful, create a JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Create a success response with user information
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        forcePasswordChange: user.forcePasswordChange,
      },
    });

    // Set the token in a secure, httpOnly cookie to prevent XSS attacks
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/', // Cookie is available on all paths
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
