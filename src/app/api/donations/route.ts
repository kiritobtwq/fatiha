import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { config } from '@/config';
import { createPayment } from '@/lib/yookassa';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimit';

const donationSchema = z.object({
  amount: z.number().positive().max(1_000_000),
  donorEmail: z.string().email().max(255).optional().or(z.literal('')),
  donorName: z.string().max(100).optional(),
  isRecurring: z.boolean().optional(),
  recurringPeriod: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!rateLimit(ip, 30, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
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
    
    if (!rateLimit(ip, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = donationSchema.parse(body);
    const { amount, donorName = 'Аноним', donorEmail, isRecurring = false, recurringPeriod } = validatedData;

    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        donorName,
        donorEmail: donorEmail || '',
        status: 'pending',
        isRecurring,
        recurringPeriod: isRecurring ? recurringPeriod : null,
      },
    });

    const payment = await createPayment({
      amount: Number(amount),
      description: `Пожертвование мечети Фатиха от ${donorName}`,
      donationId: donation.id,
      returnUrl: `${config.yookassa.returnUrl}?donationId=${donation.id}`,
    });

    await prisma.donation.update({
      where: { id: donation.id },
      data: { yookassaPaymentId: payment.id },
    });

    return NextResponse.json({
      confirmationUrl: payment.confirmation.confirmation_url,
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => {
        if (e.path.includes('amount')) return 'Введите сумму пожертвования';
        if (e.path.includes('donorEmail')) return 'Введите корректный email';
        return 'Проверьте введённые данные';
      });
      return NextResponse.json(
        { error: messages[0] || 'Проверьте введённые данные' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Произошла ошибка. Попробуйте ещё раз' },
      { status: 500 }
    );
  }
}
