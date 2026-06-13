import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');
  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    const schedule = await prisma.prayerSchedule.findFirst({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });

    if (!schedule) {
      return NextResponse.json(null);
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Schedule API error:', error);
    return NextResponse.json(null);
  }
}
