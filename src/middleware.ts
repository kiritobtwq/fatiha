import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secretPath = process.env.ADMIN_SECRET_PATH || 'admin';

  // Redirect /admin/* to secret path
  if (pathname.startsWith('/admin')) {
    const rest = pathname.replace('/admin', '') || '';
    return NextResponse.redirect(new URL(`/${secretPath}${rest}`, request.url));
  }

  // Protect secret admin routes
  if (pathname.startsWith(`/${secretPath}`)) {
    // Allow login page
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

      const { jwtVerify } = require('jose');
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.redirect(new URL(`/${secretPath}/login`, request.url));
    }
  }

  return NextResponse.next();
}
