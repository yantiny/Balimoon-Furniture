import { NextResponse } from 'next/server';
import { getOrderByCode, updateOrderAdmin } from '../../../../services/orderService';
import { getAdminUserFromCookie } from '../../../../lib/auth';

/**
 * GET /api/orders/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const code = params.id;
  const result = await getOrderByCode(code);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

/**
 * PATCH /api/orders/[id]
 * Admin route to update final price, status, and status history note
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = getAdminUserFromCookie();
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Akses ditolak. Pengguna harus terautentikasi sebagai Admin.' }, { status: 401 });
  }

  try {
    const code = params.id;
    const body = await request.json();
    const { finalPrice, status, note } = body;

    if (!status) {
      return NextResponse.json({ success: false, message: 'Status pesanan wajib diisi.' }, { status: 400 });
    }

    const priceVal = (finalPrice !== undefined && finalPrice !== null && finalPrice !== '')
      ? Number(finalPrice)
      : null;

    const result = await updateOrderAdmin(code, priceVal, status, note, admin.email);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('API PATCH Order error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Gagal memperbarui pesanan.' }, { status: 500 });
  }
}
