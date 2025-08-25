/**
 * @fileoverview This file defines the API route for listing media files from the uploads directory.
 * Note: This route is protected by `src/middleware.js`.
 */
import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

/**
 * Handles GET requests to fetch a list of all uploaded media files.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response containing the list of file URLs.
 */
export async function GET(request) {
  const uploadsDir = join(process.cwd(), 'public/uploads');

  try {
    const filenames = await readdir(uploadsDir);
    // Filter out system files like .DS_Store
    const imageFiles = filenames.filter(file => !file.startsWith('.'));
    // Construct the public URL for each file
    const urls = imageFiles.map(file => `/uploads/${file}`);

    return NextResponse.json({ success: true, data: urls });
  } catch (error) {
    // If the directory doesn't exist, return an empty array instead of an error.
    if (error.code === 'ENOENT') {
      return NextResponse.json({ success: true, data: [] });
    }
    console.error('Failed to list media files:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
