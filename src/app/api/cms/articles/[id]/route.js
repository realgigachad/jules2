/**
 * @fileoverview This file defines the API routes for managing a single article
 * within the CMS, identified by its ID. It includes handlers for fetching,
 * updating, and deleting an article.
 * Note: All routes in this file are protected by `src/middleware.js`.
 */
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch a single article by its ID.
 * @param {Request} request - The incoming request object.
 * @param {{params: {id: string}}} context - The context object containing route parameters.
 * @returns {NextResponse} A JSON response with the article data or an error.
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
    console.error(`Failed to fetch article ${params.id}:`, error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

/**
 * Handles PUT requests to update an existing article by its ID.
 * @param {Request} request - The incoming request object, containing the update data.
 * @param {{params: {id: string}}} context - The context object containing route parameters.
 * @returns {NextResponse} A JSON response with the updated article data or an error.
 */
export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const body = await request.json();
    // Find the article by ID and update it with the request body.
    // `new: true` returns the updated document.
    // `runValidators: true` ensures the update respects the schema's validation rules.
    const updatedArticle = await Article.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedArticle) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error) {
    console.error(`Failed to update article ${params.id}:`, error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

/**
 * Handles DELETE requests to remove an article by its ID.
 * @param {Request} request - The incoming request object.
 * @param {{params: {id: string}}} context - The context object containing route parameters.
 * @returns {NextResponse} A JSON response confirming deletion or an error.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const deletedArticle = await Article.findByIdAndDelete(params.id);
    if (!deletedArticle) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }
    // Return a success response with an empty data object.
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error(`Failed to delete article ${params.id}:`, error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
