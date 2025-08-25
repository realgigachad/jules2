/**
 * @fileoverview This file defines the API routes for managing the global Site Settings
 * within the CMS. It handles fetching and updating the single settings document.
 * Note: All routes in this file are protected by `src/middleware.js`.
 */
import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch the site settings.
 * If no settings document exists in the database, it creates a default one.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the site settings.
 */
export async function GET(request) {
  await dbConnect();
  try {
    // There should only ever be one SiteSettings document.
    const settings = await SiteSettings.findOne({});
    if (!settings) {
      // If no settings exist yet, create a default one to ensure the app has a starting point.
      const defaultSettings = await SiteSettings.create({});
      return NextResponse.json({ success: true, data: defaultSettings });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

/**
 * Handles POST requests to update the site settings.
 * This uses an "upsert" operation to simplify the client-side logic to a single "save" action.
 * @param {Request} request - The incoming request object, containing the settings data.
 * @returns {NextResponse} A JSON response with the updated settings or an error.
 */
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Use findOneAndUpdate with `upsert: true` to create the document if it doesn't exist,
    // or update it if it does. This makes it a simple "save" operation for the admin panel.
    const settings = await SiteSettings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Failed to update site settings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
