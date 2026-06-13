import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

export async function GET() {
  try {
    const totalRaisedResult = await prisma.donation.aggregate({
      where: { status: 'succeeded' },
      _sum: { amount: true },
    });
    const totalRaised = totalRaisedResult._sum.amount || 0;

    const donorCountResult = await prisma.donation.groupBy({
      where: { status: 'succeeded' },
      by: ['donorEmail'],
    });
    const donorCount = donorCountResult.length;

    const actualGoal = config.donationGoal;
    const remaining = Math.max(0, actualGoal - totalRaised);
    const progressPercent = actualGoal > 0 ? Math.min(100, Math.round((totalRaised / actualGoal) * 100)) : 0;

    return NextResponse.json({
      totalRaised,
      donorCount,
      remaining,
      goal: actualGoal,
      progressPercent,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
