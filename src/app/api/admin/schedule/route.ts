import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const body = await request.json();
    const { date, fajr, dhuhr, asr, maghrib, isha, juma } = body;

    if (!date || !fajr || !dhuhr || !asr || !maghrib || !isha || !juma) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const schedule = await prisma.prayerSchedule.upsert({
      where: { date: new Date(date) },
      update: { fajr, dhuhr, asr, maghrib, isha, juma },
      create: { date: new Date(date), fajr, dhuhr, asr, maghrib, isha, juma },
    });

    return NextResponse.json(schedule);
  } catch (error: any) {
    console.error('Schedule save error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
