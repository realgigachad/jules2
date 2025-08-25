/**
 * @fileoverview This file defines the public API route for fetching a list of articles.
 * This endpoint is not protected and is intended for use by the public-facing website.
 */
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch a list of articles.
 * It supports a 'limit' query parameter to control the number of articles returned.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the list of articles or an error.
 */
export async function GET(request) {
  await dbConnect();
  try {
    // Parse the URL to get query parameters.
    const { searchParams } = new URL(request.url);
    // Get the 'limit' parameter, defaulting to 10 if not provided.
    const limit = parseInt(searchParams.get('limit')) || 10;

    const articles = await Article.find({})
      .sort({ createdAt: -1 }) // Sort by newest first.
      .limit(limit); // Limit the number of results.

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Public API failed to fetch articles:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
