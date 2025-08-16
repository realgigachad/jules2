import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      // This should technically be caught by the middleware, but as a safeguard:
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      forcePasswordChange: false,
    });

    return NextResponse.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
