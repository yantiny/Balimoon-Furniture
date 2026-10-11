import { NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '../../../lib/supabase';
import { getAdminUserFromCookie } from '../../../lib/auth';
import { Testimonial } from '../../../types/testimonial';

/**
 * GET /api/testimonials
 * Fetches all testimonials from Supabase
 */
export async function GET() {
  try {
    const client = getSupabaseAdmin() || supabase;
    if (!client) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data, error } = await client
      .from('testimoni')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Table may not be created yet, fallback gracefully
      return NextResponse.json({ success: true, data: [], error: error.message });
    }

    const formatted: Testimonial[] = (data || []).map((row: any) => ({
      id: row.id,
      nama: row.nama,
      kota: row.kota || 'Indonesia',
      produk_nama: row.produk_nama || 'Mebel Custom',
      rating: Number(row.rating) || 5,
      komentar: row.komentar,
      created_at: row.created_at,
      terverifikasi: row.terverifikasi ?? true,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    console.error('GET /api/testimonials error:', err);
    return NextResponse.json({ success: true, data: [] });
  }
}

/**
 * POST /api/testimonials
 * Inserts a new customer testimonial into Supabase
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, kota, produk_nama, rating, komentar } = body;

    if (!nama || !komentar) {
      return NextResponse.json(
        { success: false, message: 'Nama dan komentar ulasan wajib diisi.' },
        { status: 400 }
      );
    }

    const parsedRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const newRecord = {
      nama: String(nama).trim(),
      kota: String(kota || 'Indonesia').trim(),
      produk_nama: String(produk_nama || 'Mebel Custom').trim(),
      rating: parsedRating,
      komentar: String(komentar).trim(),
      terverifikasi: true,
      created_at: new Date().toISOString(),
    };

    const client = getSupabaseAdmin() || supabase;
    if (client) {
      const { data, error } = await client
        .from('testimoni')
        .insert([newRecord])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          data: {
            id: data.id,
            nama: data.nama,
            kota: data.kota,
            produk_nama: data.produk_nama,
            rating: data.rating,
            komentar: data.komentar,
            created_at: data.created_at,
            terverifikasi: data.terverifikasi,
          },
        });
      } else if (error) {
        console.warn('Supabase insert testimoni warning:', error.message);
      }
    }

    // Fallback if table doesn't exist yet
    return NextResponse.json({
      success: true,
      data: {
        id: 'testi-' + Date.now(),
        ...newRecord,
      },
    });
  } catch (err: any) {
    console.error('POST /api/testimonials error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials?id=xxx
 * Admin route to delete a testimonial
 */
export async function DELETE(request: Request) {
  try {
    const admin = getAdminUserFromCookie();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Anda harus login sebagai admin.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID testimoni wajib disertakan.' },
        { status: 400 }
      );
    }

    const client = getSupabaseAdmin() || supabase;
    if (client) {
      const { error } = await client
        .from('testimoni')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete error:', error.message);
      }
    }

    return NextResponse.json({ success: true, message: 'Testimoni berhasil dihapus.' });
  } catch (err: any) {
    console.error('DELETE /api/testimonials error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menghapus testimoni.' },
      { status: 500 }
    );
  }
}
