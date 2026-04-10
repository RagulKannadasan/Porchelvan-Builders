import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // In Next.js 16+, request properties might need careful json parsing
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpiry: expiry,
      isVerified: false,
      role: 'CUSTOMER'
    });

    await newUser.save();

    // Send OTP via Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    if (process.env.EMAIL_SERVER_USER) {
       await transporter.sendMail({
        from: '"Porchelvan Builders" <noreply@porchelvan.com>',
        to: email,
        subject: 'Verify your Porchelvan Builders Account',
        text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
      });
    } else {
      console.log('Skipped email send: No SMTP configuration provided. OTP is:', otp);
    }

    return NextResponse.json({ message: 'User created. Please check your email for the OTP.' }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
