import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Новый пароль должен быть минимум 8 символов' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: Number(payload.id) },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Администратор не найден' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Неверный текущий пароль' }, { status: 403 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.adminUser.update({
      where: { id: Number(payload.id) },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
