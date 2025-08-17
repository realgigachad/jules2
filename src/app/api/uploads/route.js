import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// This route is protected by the middleware, which is configured to protect /api/cms/*
// I need to update the middleware to also protect /api/uploads
export async function POST(req) {
  const data = await req.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name}`;
  const uploadsDir = join(process.cwd(), 'public/uploads');
  const path = join(uploadsDir, filename);

  try {
    // Note: The /public/uploads directory must exist. I will create it in a later step.
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, message: 'Failed to save file' }, { status: 500 });
  }
}
