/**
 * @fileoverview This file contains helper functions for API routes,
 * including session management and standardized JSON responses.
 */

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET;

/**
 * Retrieves the current user session from the JWT stored in cookies.
 * @returns {Promise<object|null>} A promise that resolves to the decoded session object or null if the session is not valid.
 */
export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    // This will catch invalid/expired tokens
    console.error('Session verification failed:', error.message);
    return null;
  }
}

/**
 * Creates a standardized 401 Unauthorized response.
 * @returns {NextResponse} A JSON response with an error message and a 401 status code.
 */
export function unauthorizedResponse() {
  const responseBody = { success: false, message: 'Invalid or expired token' };
  return NextResponse.json(responseBody, { status: 401 });
}

/**
 * Creates a standardized error response.
 * @param {Error} error - The error object.
 * @param {string} [message='An unknown error occurred.'] - A custom error message.
 * @param {number} [status=500] - The HTTP status code.
 * @returns {NextResponse} A JSON response with an error message and status code.
 */
export function failedResponse(error, message = 'An unknown error occurred.', status = 500) {
  console.error(error);
  return NextResponse.json({ message: message, error: error ? error.message : undefined }, { status });
}

/**
 * Creates a standardized success response.
 * @param {any} data - The data to be included in the response body.
 * @param {number} [status=200] - The HTTP status code.
 * @returns {NextResponse} A JSON response with the data and a success flag.
 */
export function successResponse(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
