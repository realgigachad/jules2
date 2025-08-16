import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

// This is a public, unprotected route

export async function GET(request) {
  await dbConnect();
  try {
    const trips = await Trip.find({}).sort({ startDate: 1 });
    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
