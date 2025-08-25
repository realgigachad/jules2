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

  // --- Security Enhancements ---
  // 1. File Size Limit (e.g., 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return NextResponse.json({ success: false, message: 'File size exceeds the limit of 5MB' }, { status: 413 });
  }

  // 2. File Type Whitelist
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'video/webm'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ success: false, message: 'Invalid file type. Only images, PDFs, and videos are allowed.' }, { status: 415 });
  }
  // --- End Security Enhancements ---

  // Convert the file to a Buffer.
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // --- Security Enhancements ---
  // 3. Sanitize filename to prevent path traversal and other attacks.
  // This removes any characters that are not letters, numbers, dots, or underscores.
  const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const filename = `${Date.now()}-${sanitizedOriginalName}`;
  // --- End Security Enhancements ---
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
