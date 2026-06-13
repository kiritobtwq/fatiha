import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimit';

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(255),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(2000),
});

export async function GET() {
  try {
    const count = await prisma.contactRequest.count();
    const requests = await prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ count, requests });
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return NextResponse.json({ count: 0, requests: [] });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!rateLimit(ip, 3, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);
    const { name, contact, subject, message } = validatedData;

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name,
        contact,
        subject: subject || null,
        message,
      },
    });

    return NextResponse.json(contactRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating contact request:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Не удалось отправить заявку' },
      { status: 500 }
    );
  }
}
