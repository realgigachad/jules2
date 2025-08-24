import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import {
  getSession,
  unauthorizedResponse,
  failedResponse,
  successResponse,
} from '@/lib/api_helpers';

export async function GET(request) {
  const session = await getSession(request);
  if (!session) return unauthorizedResponse();

  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({});
    return successResponse(settings ? { appearance: settings.appearance } : { appearance: 'default' });
  } catch (error) {
    return failedResponse(error);
  }
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { appearance } = body;

    if (!['default', 'single-page', 'playful'].includes(appearance)) {
      return failedResponse(null, 'Invalid appearance value.', 400);
    }

    await dbConnect();
    await SiteSettings.findOneAndUpdate({}, { appearance }, { upsert: true, new: true });

    return successResponse({ appearance });
  } catch (error) {
    return failedResponse(error);
  }
}
