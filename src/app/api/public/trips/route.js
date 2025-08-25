/**
 * @fileoverview This file defines the public API route for fetching a list of all trips.
 * This endpoint is not protected and is intended for use by the public-facing website.
 */
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch a list of all trips.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the list of trips or an error.
 */
export async function GET(request) {
  await dbConnect();
  try {
    // Fetches all trips, sorted by the soonest start date first.
    const trips = await Trip.find({}).sort({ startDate: 1 });
    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    console.error('Public API failed to fetch trips:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
