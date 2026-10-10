import { NextResponse } from 'next/server';
import { getAdminUserFromCookie } from '../../../../lib/auth';

export async function GET() {
  const user = getAdminUserFromCookie();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
