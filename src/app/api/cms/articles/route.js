/**
 * @fileoverview This file defines the API routes for managing collections of articles
 * within the CMS. It includes handlers for fetching all articles and creating a new one.
 * Note: All routes in this file are protected by `src/middleware.js`, which checks for a valid user session.
 */
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Handles GET requests to fetch all articles.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the list of articles or an error.
 */
export async function GET(request) {
  await dbConnect();
  try {
    // Fetches all articles from the database, sorted with the newest first.
    const articles = await Article.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new article.
 * @param {Request} request - The incoming request object, containing the article data in its body.
 * @returns {NextResponse} A JSON response with the newly created article or an error.
 */
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();

    // Sanitize the 'content' field before saving to prevent Stored XSS.
    if (body.content && typeof body.content === 'object') {
      for (const lang in body.content) {
        if (typeof body.content[lang] === 'string') {
          body.content[lang] = DOMPurify.sanitize(body.content[lang]);
        }
      }
    }

    // Creates a new article document in the database.
    const newArticle = await Article.create(body);
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    console.error('Failed to create article:', error);
    // This typically catches validation errors from the Mongoose model.
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
