import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// This is a public endpoint
export async function POST(req) {
  await dbConnect();

  try {
    const { username } = await req.json();

    if (username !== 'fonok') {
      // To prevent username enumeration, we send a generic success message
      // even if the username is wrong. The action simply won't happen.
      return NextResponse.json({ success: true, message: 'If a user with that name exists, the password has been reset.' });
    }

    const user = await User.findOne({ username: 'fonok' });

    if (user) {
      const hashedPassword = await bcrypt.hash('abc123', 10);
      user.password = hashedPassword;
      user.forcePasswordChange = true;
      await user.save();
    }

    return NextResponse.json({ success: true, message: 'If a user with that name exists, the password has been reset.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    // Even on server error, send a generic message to prevent leaking information
    return NextResponse.json({ success: true, message: 'An error occurred during the process.' });
  }
}
