import { NextResponse } from 'next/server';
import { createOrder, getAdminOrders } from '../../../services/orderService';
import { getAdminUserFromCookie } from '../../../lib/auth';

/**
 * GET /api/orders
 * Admin route to list orders with filters & stats
 */
export async function GET(request: Request) {
  const admin = getAdminUserFromCookie();
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Akses ditolak. Silakan login sebagai admin.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || 'ALL';

  const result = await getAdminOrders(q, status);
  return NextResponse.json(result);
}

/**
 * POST /api/orders
 * Public route to submit new custom furniture order
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOrder(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error('API /api/orders POST Error:', err);
    return NextResponse.json({
      success: false,
      message: err.message || 'Terjadi kesalahan pada server saat memproses pesanan.'
    }, { status: 500 });
  }
}
