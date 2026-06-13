import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lessons = await (prisma as any).lesson.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json([]);
  }
}
