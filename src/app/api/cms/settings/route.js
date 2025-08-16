import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import { NextResponse } from 'next/server';

// Note: This route is protected by src/middleware.js

export async function GET(request) {
  await dbConnect();
  try {
    // Find the first (and should be only) settings document
    const settings = await SiteSettings.findOne({});
    if (!settings) {
      // If no settings exist yet, create a default one
      const defaultSettings = await SiteSettings.create({});
      return NextResponse.json({ success: true, data: defaultSettings });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Use findOneAndUpdate with upsert:true to create the document if it doesn't exist,
    // or update it if it does. This makes it a simple "save" operation for the admin.
    const settings = await SiteSettings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
