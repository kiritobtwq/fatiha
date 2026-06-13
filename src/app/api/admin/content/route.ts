import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { logAdminAction } from '@/lib/adminLog';

export async function GET(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    await logAdminAction(Number(payload.id), 'GET_CONTENT', undefined, ip);

    const content = await prisma.content.findMany({
      orderBy: { key: 'asc' },
    });
    return NextResponse.json(content);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const body = await request.json();
    const { key, value, imageUrl } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const content = await prisma.content.upsert({
      where: { key },
      update: { value, imageUrl },
      create: { key, value, imageUrl },
    });

    await logAdminAction(Number(payload.id), 'UPSERT_CONTENT', `Content ${key}`, ip);
    return NextResponse.json(content);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const body = await request.json();
    const { id, key, value, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const content = await prisma.content.update({
      where: { id },
      data: { key, value, imageUrl },
    });

    await logAdminAction(Number(payload.id), 'UPDATE_CONTENT', `Content ${id}`, ip);
    return NextResponse.json(content);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.content.delete({
      where: { id },
    });

    await logAdminAction(Number(payload.id), 'DELETE_CONTENT', `Content ${id}`, ip);
    return NextResponse.json({ status: 'deleted' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
