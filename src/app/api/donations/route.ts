import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimit';

const donationSchema = z.object({
  amount: z.number().min(0).max(1_000_000),
  donorName: z.string().max(100).optional(),
});

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!rateLimit(ip, 30, 60_000)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Подождите минуту и попробуйте снова.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'succeeded';
    const limit = Math.min(Number(searchParams.get('limit')) || 8, 100);
    const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

    const donations = await prisma.donation.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.donation.count({
      where: { status },
    });

    return NextResponse.json({
      donations,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!rateLimit(ip, 10, 60_000)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Подождите минуту и попробуйте снова.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = donationSchema.parse(body);
    const { amount, donorName = 'Аноним' } = validatedData;

    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        donorName,
        donorEmail: '',
        status: 'succeeded',
      },
    });

    return NextResponse.json({ ok: true, id: donation.id });
  } catch (error) {
    console.error('Error creating donation:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Проверьте введённые данные' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Произошла ошибка. Попробуйте ещё раз' },
      { status: 500 }
    );
  }
}
