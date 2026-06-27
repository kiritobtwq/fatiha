import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import { calculatePrayerTimes } from '@/lib/prayerTimes';

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

    if (schedule) {
      return NextResponse.json(schedule);
    }

    const calculated = calculatePrayerTimes(date);
    return NextResponse.json(calculated);
  } catch (error) {
    console.error('Schedule API error:', error);
    try {
      const calculated = calculatePrayerTimes(date);
      return NextResponse.json(calculated);
    } catch {
      return NextResponse.json(null);
    }
  }
}
