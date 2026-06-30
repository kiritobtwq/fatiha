import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { logAdminAction } from '@/lib/adminLog';

export async function GET(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') || 'unknown';

    await logAdminAction(Number(payload.id), 'GET_SETTINGS', undefined, ip);

    const records = await prisma.content.findMany({
      where: { key: { in: ['yandex_metrika_id', 'google_analytics_id'] } },
    });

    const settings: Record<string, string> = {};
    records.forEach(r => { settings[r.key] = r.value; });

    return NextResponse.json({
      yandexMetrikaId: settings.yandex_metrika_id || '',
      googleAnalyticsId: settings.google_analytics_id || '',
    });
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
               request.headers.get('x-real-ip') || 'unknown';

    const body = await request.json();
    const { yandexMetrikaId, googleAnalyticsId } = body;

    const keys = ['yandex_metrika_id', 'google_analytics_id'];
    const values = [yandexMetrikaId, googleAnalyticsId];

    for (let i = 0; i < keys.length; i++) {
      if (values[i] !== undefined) {
        await prisma.content.upsert({
          where: { key: keys[i] },
          update: { value: String(values[i]) },
          create: { key: keys[i], value: String(values[i]) },
        });
      }
    }

    await logAdminAction(Number(payload.id), 'UPDATE_SETTINGS', 'Analytics settings updated', ip);
    return NextResponse.json({ status: 'saved' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
