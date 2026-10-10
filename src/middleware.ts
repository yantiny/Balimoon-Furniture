import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'bmf_admin_token';

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [encodedPayload, signature] = parts;
    if (!encodedPayload || !signature) return false;

    // Decode base64 payload
    const payloadStr = atob(encodedPayload);
    const payload = JSON.parse(payloadStr);

    if (!payload || typeof payload !== 'object') return false;
    if (payload.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !isTokenValid(token)) {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete(ADMIN_COOKIE_NAME);
      }
      return response;
    }
  }

  // If already logged in and visiting /admin/login, redirect to /admin dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token && isTokenValid(token)) {
      const dashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

