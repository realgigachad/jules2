import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET;

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

export function unauthorizedResponse() {
  const responseBody = { success: false, message: 'Invalid or expired token' };
  return NextResponse.json(responseBody, { status: 401 });
}

export function failedResponse(error, message = 'An unknown error occurred.', status = 500) {
  console.error(error);
  return NextResponse.json({ message: message, error: error ? error.message : undefined }, { status });
}

export function successResponse(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
