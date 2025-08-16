import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

// Note: This route is protected by src/middleware.js

export async function GET(request) {
  await dbConnect();
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newArticle = await Article.create(body);
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
