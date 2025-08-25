/**
 * @fileoverview This file defines the API routes for managing collections of trips
 * within the CMS. It includes handlers for fetching all trips and creating a new one.
 * Note: All routes in this file are protected by `src/middleware.js`.
 */
import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch all trips.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the list of trips or an error.
 */
export async function GET(request) {
  await dbConnect();
  try {
    // Fetches all trips from the database, sorted with the soonest start date first.
    // A comment notes that pagination could be added here in the future.
    const trips = await Trip.find({}).sort({ startDate: -1 });
    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new trip.
 * @param {Request} request - The incoming request object, containing the trip data in its body.
 * @returns {NextResponse} A JSON response with the newly created trip or an error.
 */
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Creates a new trip document in the database.
    const newTrip = await Trip.create(body);
    return NextResponse.json({ success: true, data: newTrip }, { status: 201 });
  } catch (error) {
    console.error('Failed to create trip:', error);
    // This typically catches validation errors from the Mongoose model.
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
