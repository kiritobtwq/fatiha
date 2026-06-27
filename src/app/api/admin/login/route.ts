import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimit';

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().max(72),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!rateLimit(ip, 10, 5 * 60_000)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === 'secret' || jwtSecret.length < 32) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminHash || !adminEmail) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, adminHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: 1, email: adminEmail }, jwtSecret, {
      expiresIn: '24h',
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
