/**
 * @fileoverview This file defines the public API route for fetching the global site settings.
 * This endpoint is not protected and is used by the public-facing site to load
 * dynamic content like contact information and styling.
 */
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch the site settings.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the site settings or an error.
 */
export async function GET(request) {
  await dbConnect();
  try {
    const settings = await SiteSettings.findOne({});
    // Return the settings document, or an empty object if one doesn't exist,
    // to prevent errors on the client side.
    return NextResponse.json({ success: true, data: settings || {} });
  } catch (error) {
    console.error('Public API failed to fetch site settings:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
