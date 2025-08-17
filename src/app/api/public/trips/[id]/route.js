import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

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
