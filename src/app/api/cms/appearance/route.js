/**
 * @fileoverview This file defines the API route for managing site appearance settings.
 * It provides a public GET endpoint to fetch the current themes and a protected
 * POST endpoint to update them.
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import {
  getSession,
  unauthorizedResponse,
  failedResponse,
  successResponse,
} from '@/lib/api_helpers';

/**
 * Handles GET requests to fetch the current appearance settings.
 * This is a public endpoint, allowing the public site (via server-side rendering)
 * and the admin panel to retrieve the current themes.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response with the admin and public appearance settings.
 */
export async function GET(request) {
  try {
    await dbConnect();
    // Find the single SiteSettings document.
    const settings = await SiteSettings.findOne({}).lean();
    // Return the settings, providing default values if none are found.
    return successResponse({
      adminAppearance: settings?.adminAppearance || 'default',
      publicAppearance: settings?.publicAppearance || 'default',
    });
  } catch (error) {
    return failedResponse(error);
  }
}

/**
 * Handles POST requests to update the appearance settings.
 * This is a protected endpoint that requires an active user session.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response with the updated settings or an error.
 */
export async function POST(request) {
  // Protect the route by checking for a valid session.
  const session = await getSession(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { theme, target } = body;

    // Validate the incoming theme and target values.
    if (!['default', 'single-page', 'playful'].includes(theme)) {
      return failedResponse(null, 'Invalid theme value.', 400);
    }
    if (!['admin', 'public', 'both'].includes(target)) {
      return failedResponse(null, 'Invalid target value.', 400);
    }

    await dbConnect();
    const update = {};
    // Build the update object based on the target.
    if (target === 'admin' || target === 'both') {
      update.adminAppearance = theme;
    }
    if (target === 'public' || target === 'both') {
      update.publicAppearance = theme;
    }

    // Find the single SiteSettings document and update it.
    // `upsert: true` creates the document if it doesn't exist.
    // `new: true` returns the modified document rather than the original.
    const newSettings = await SiteSettings.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true });

    // Return the newly updated settings.
    return successResponse({
      adminAppearance: newSettings.adminAppearance,
      publicAppearance: newSettings.publicAppearance,
    });
  } catch (error) {
    return failedResponse(error);
  }
}
