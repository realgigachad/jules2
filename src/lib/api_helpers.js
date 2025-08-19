import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

const secret = process.env.NEXTAUTH_SECRET;

export async function getSession() {
  const token = await getToken({
    req: {
      headers: Object.fromEntries(headers()),
    },
    secret,
    raw: true
  });
  return token;
}

export function unauthorizedResponse() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export function failedResponse(error, message = 'An unknown error occurred.', status = 500) {
  console.error(error);
  return NextResponse.json({ message: message, error: error ? error.message : undefined }, { status });
}

export function successResponse(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
