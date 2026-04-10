import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'User already verified' }, { status: 400 });
    }

    if (user.verifyOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (!user.verifyOtpExpiry || new Date() > user.verifyOtpExpiry) {
      return NextResponse.json({ message: 'OTP Expired' }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Account successfully verified.' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
