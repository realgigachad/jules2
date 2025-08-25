/**
 * @fileoverview This file defines the public API route for fetching a single article by its ID.
 * This endpoint is not protected and is intended for use by the public-facing website.
 */
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch a single article by its ID.
 * @param {Request} request - The incoming request object.
 * @param {{params: {id: string}}} context - The context object containing the route's dynamic parameters.
 * @returns {NextResponse} A JSON response containing the article data or an error.
 */
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const article = await Article.findById(params.id);
    if (!article) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error(`Public API failed to fetch article ${params.id}:`, error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
