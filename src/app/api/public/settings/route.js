import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import { NextResponse } from 'next/server';

// This is a public, unprotected route

export async function GET(request) {
  await dbConnect();
  try {
    const settings = await SiteSettings.findOne({});
    return NextResponse.json({ success: true, data: settings || {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
