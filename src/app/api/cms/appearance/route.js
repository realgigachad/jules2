import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import {
  getSession,
  unauthorizedResponse,
  failedResponse,
  successResponse,
} from '@/lib/api_helpers';

// GET handler now returns both appearance settings
export async function GET(request) {
  // This is a public endpoint now, as the public site needs to know the theme.
  // We will rely on the server-side layout to fetch this, which doesn't have a session.
  // The POST route will remain protected.
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    return successResponse({
      adminAppearance: settings?.adminAppearance || 'default',
      publicAppearance: settings?.publicAppearance || 'default',
    });
  } catch (error) {
    return failedResponse(error);
  }
}

// POST handler saves the appearance setting for a specific target
export async function POST(request) {
  const session = await getSession(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { theme, target } = body; // Expect 'theme' and 'target'

    if (!['default', 'single-page', 'playful'].includes(theme)) {
      return failedResponse(null, 'Invalid theme value.', 400);
    }
    if (!['admin', 'public', 'both'].includes(target)) {
      return failedResponse(null, 'Invalid target value.', 400);
    }

    await dbConnect();
    const update = {};
    if (target === 'admin' || target === 'both') {
      update.adminAppearance = theme;
    }
    if (target === 'public' || target === 'both') {
      update.publicAppearance = theme;
    }

    const newSettings = await SiteSettings.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true });

    return successResponse({
      adminAppearance: newSettings.adminAppearance,
      publicAppearance: newSettings.publicAppearance,
    });
  } catch (error) {
    return failedResponse(error);
  }
}
