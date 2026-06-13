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
    
    await logAdminAction(Number(payload.id), 'GET_CONTACTS', undefined, ip);
    
    const requests = await prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const contactRequest = await prisma.contactRequest.update({
      where: { id },
      data: {
        status: status as string
      },
    });

    await logAdminAction(Number(payload.id), 'UPDATE_CONTACT', `Contact ${id} status to ${status}`, ip);
    return NextResponse.json(contactRequest);
  } catch (error: any) {
    console.error('Archive contact error:', error);
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

    await prisma.contactRequest.delete({
      where: { id: id as string },
    });

    await logAdminAction(Number(payload.id), 'DELETE_CONTACT', `Contact ${id}`, ip);
    return NextResponse.json({ status: 'deleted' });
  } catch (error: any) {
    console.error('Delete contact error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
