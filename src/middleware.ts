import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { rateLimit, getRateLimitRemaining } from '@/lib/rateLimit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secretPath = process.env.ADMIN_SECRET_PATH || 'admin';

  // Rate limiting for admin API routes (login, upload, gallery, donations)
  if (pathname.startsWith('/api/admin')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '127.0.0.1';

    const allowed = rateLimit(`admin:${ip}`, 10, 60_000);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте через минуту.' },
        { status: 429 }
      );
    }
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith(`/${secretPath}`) && !pathname.startsWith('/api')) {
    if (pathname === `/${secretPath}/login`) {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL(`/${secretPath}/login`, request.url));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return NextResponse.redirect(new URL(`/${secretPath}/login`, request.url));
      }

      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.redirect(new URL(`/${secretPath}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|media/).*)'],
};
