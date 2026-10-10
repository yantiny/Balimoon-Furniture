import { NextResponse } from 'next/server';
import { validateAdminCredentials, setAdminSessionCookie } from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const isValid = validateAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Kredensial Admin tidak valid. Periksa kembali email dan password.' }, { status: 401 });
    }

    setAdminSessionCookie(email);

    return NextResponse.json({
      success: true,
      message: 'Login Admin berhasil.',
      user: { email, role: 'admin' }
    });
  } catch (err: any) {
    console.error('Admin login API error:', err);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan sistem saat proses login.' }, { status: 500 });
  }
}
