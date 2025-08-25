/**
 * @fileoverview This file defines the API route for handling file uploads.
 * It accepts a POST request with multipart/form-data and saves the file
 * to the local filesystem under the `public/uploads` directory.
 * Note: This route is protected by `src/middleware.js` to ensure only authenticated users can upload files.
 */
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Handles POST requests to upload a file.
 * @param {Request} req - The incoming request object containing the form data.
 * @returns {NextResponse} A JSON response with the public URL of the saved file or an error.
 */
export async function POST(req) {
  // Get the form data from the request.
  const data = await req.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
  }

  // Convert the file to a Buffer.
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename to avoid collisions and replace spaces.
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  // Define the path to the public uploads directory.
  const uploadsDir = join(process.cwd(), 'public/uploads');
  const path = join(uploadsDir, filename);

  try {
    // Ensure the uploads directory exists, creating it if necessary.
    await mkdir(uploadsDir, { recursive: true });

    // Write the file to the filesystem.
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    // Construct the public URL for the file.
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, message: 'Failed to save file' }, { status: 500 });
  }
}
