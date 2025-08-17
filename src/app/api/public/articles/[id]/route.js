import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const article = await Article.findById(params.id);
    if (!article) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
