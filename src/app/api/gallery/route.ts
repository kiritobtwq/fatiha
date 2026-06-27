import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const images = await (prisma as any).galleryImage.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json([]);
  }
}
