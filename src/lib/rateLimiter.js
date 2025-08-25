/**
 * @fileoverview This file configures a production-ready rate limiter using the `rate-limiter-flexible` package.
 * It provides a middleware-compatible function to protect the application against DoS/DDoS attacks.
 */

import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextResponse } from 'next/server';

// Create a new rate limiter instance.
// It allows 100 requests per 1 minute per IP address.
const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
});

/**
 * The rate limiting middleware function.
 * It consumes a point for each request and checks if the client has exceeded the limit.
 * @param {import('next/server').NextRequest} req - The incoming request.
 * @returns {Promise<NextResponse | null>} - A response object if the client is rate-limited, otherwise null.
 */
export const limit = async (req) => {
  const ip = req.ip ?? '127.0.0.1';

  try {
    await rateLimiter.consume(ip);
    return null; // Not rate-limited
  } catch (rateLimiterRes) {
    const headers = {
      'X-RateLimit-Limit': rateLimiter.points,
      'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString(),
      'Retry-After': Math.ceil(rateLimiterRes.msBeforeNext / 1000),
    };
    return new NextResponse('Too Many Requests', { status: 429, headers });
  }
};
