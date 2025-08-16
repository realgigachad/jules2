import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

// This is a public, unprotected route

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;

    const articles = await Article.find({})
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
