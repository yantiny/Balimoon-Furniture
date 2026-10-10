import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'bmf_admin_token';
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || 'balimoon_admin_secret_key_2026_super_secure';

// Default admin credentials (override via environment variables in production)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@balimoon.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'balimoon2026';

export interface AdminUser {
  email: string;
  role: 'admin';
}

function generateToken(email: string): string {
  const payload = JSON.stringify({ email, role: 'admin', exp: Date.now() + 86400000 }); // 24h
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

function verifyToken(token: string): AdminUser | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;
    const payloadStr = Buffer.from(encodedPayload, 'base64').toString('utf-8');
    const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(payloadStr).digest('hex');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) return null;

    return { email: payload.email, role: 'admin' };
  } catch (e) {
    return null;
  }
}

export function validateAdminCredentials(emailInput: string, passwordInput: string): boolean {
  return emailInput.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && passwordInput === ADMIN_PASSWORD;
}

export function setAdminSessionCookie(email: string) {
  const token = generateToken(email);
  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 86400, // 24 hours
  });
  return token;
}

export function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function getAdminUserFromCookie(): AdminUser | null {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!tokenCookie || !tokenCookie.value) return null;
    return verifyToken(tokenCookie.value);
  } catch {
    return null;
  }
}
