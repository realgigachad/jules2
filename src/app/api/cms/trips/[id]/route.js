import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

// Note: This route is protected by src/middleware.js

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const trip = await Trip.findById(params.id);
    if (!trip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const body = await request.json();
    const updatedTrip = await Trip.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTrip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const deletedTrip = await Trip.findByIdAndDelete(params.id);
    if (!deletedTrip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
