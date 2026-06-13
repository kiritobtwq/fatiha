import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await verifyAuth(request);
    const lessons = await (prisma as any).lesson.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(lessons);
  } catch (error: any) {
    console.error('Get lessons error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const body = await request.json();
    const { title, group, days, startTime, endTime } = body;

    if (!title || !group || !days || !startTime || !endTime) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!Array.isArray(days) || days.length === 0) {
      return NextResponse.json({ error: 'Days must be a non-empty array' }, { status: 400 });
    }

    const lesson = await (prisma as any).lesson.create({
      data: { title, group, days, startTime, endTime },
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error('Lesson creation error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await verifyAuth(request);
    const body = await request.json();
    const { id, title, group, days, startTime, endTime } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const lesson = await (prisma as any).lesson.update({
      where: { id: parseInt(id) },
      data: { title, group, days, startTime, endTime },
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error('Update lesson error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await verifyAuth(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await (prisma as any).lesson.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ status: 'deleted' });
  } catch (error: any) {
    console.error('Delete lesson error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
