import { prisma } from '@/lib/prisma';

export async function logAdminAction(
  adminId: number,
  action: string,
  details?: string,
  ip?: string
) {
  try {
    await (prisma as any).adminLog.create({
      data: {
        adminId,
        action,
        details,
        ip,
      },
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}
