/**
 * @fileoverview This file defines the API routes for managing a single trip
 * within the CMS, identified by its ID. It includes handlers for fetching,
 * updating, and deleting a trip.
 * Note: All routes in this file are protected by `src/middleware.js`.
 */
import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Handles GET requests to fetch a single trip by its ID.
 * @param {Request} request - The incoming request object.
 * @param {{params: {id: string}}} context - The context object containing route parameters.
 * @returns {NextResponse} A JSON response with the trip data or an error.
 */
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const trip = await Trip.findById(params.id);
    if (!trip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    console.error(`Failed to fetch trip ${params.id}:`, error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

/**
 * Handles PUT requests to update an existing trip by its ID.
 * @param {Request} request - The incoming request object, containing the update data.
 * @param {{params: {id: string}}} context - The context object containing route parameters.
 * @returns {NextResponse} A JSON response with the updated trip data or an error.
 */
export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const body = await request.json();

    // Sanitize the 'description' field before saving to prevent Stored XSS.
    if (body.description && typeof body.description === 'object') {
      for (const lang in body.description) {
        if (typeof body.description[lang] === 'string') {
          body.description[lang] = DOMPurify.sanitize(body.description[lang]);
        }
      }
    }

    const updatedTrip = await Trip.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTrip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    console.error(`Failed to update trip ${params.id}:`, error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

/**
 * Handles DELETE requests to remove a trip by its ID.
 * @param {Request} request - The incoming request object.
 * @param {{params: {id: string}}} context - The context object containing route parameters.
 * @returns {NextResponse} A JSON response confirming deletion or an error.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const deletedTrip = await Trip.findByIdAndDelete(params.id);
    if (!deletedTrip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error(`Failed to delete trip ${params.id}:`, error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
