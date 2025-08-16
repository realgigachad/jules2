import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

// Note: This route is protected by src/middleware.js

export async function GET(request) {
  await dbConnect();
  try {
    // We can add pagination here in the future if needed
    const trips = await Trip.find({}).sort({ startDate: -1 });
    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newTrip = await Trip.create(body);
    return NextResponse.json({ success: true, data: newTrip }, { status: 201 });
  } catch (error) {
    // Mongoose validation errors can be caught here
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
