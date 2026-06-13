import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await verifyAuth(request);

    const body = await request.json();
    const { amount, donorName, donorEmail } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        donorName: donorName || 'Тестовый донат',
        donorEmail: donorEmail || 'test@test.com',
        status: 'succeeded',
      },
    });

    return NextResponse.json({ success: true, donation });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Test donation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
