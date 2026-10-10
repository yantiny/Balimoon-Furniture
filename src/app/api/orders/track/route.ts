import { NextResponse } from 'next/server';
import { getOrderByCode } from '../../../../services/orderService';

/**
 * GET /api/orders/track?code=BMF-20261009-XXXX
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || searchParams.get('orderId') || '';

  if (!code.trim()) {
    return NextResponse.json({ success: false, message: 'Harap berikan kode pesanan yang valid.' }, { status: 400 });
  }

  const result = await getOrderByCode(code);
  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}
