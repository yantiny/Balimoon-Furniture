import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabase';
import { getAdminUserFromCookie } from '../../../lib/auth';
import { STATIC_PRODUCTS } from '../../../data/products';
import { Product } from '../../../types/furniture';
import { SLUG_TO_UUID, UUID_TO_SLUG } from '../../../services/productService';

/**
 * Helper to merge a database row with STATIC_PRODUCTS
 */
function mergeDbRowWithStatic(row: any, staticList: Product[]): Product {
  const slug = UUID_TO_SLUG[row.id];
  let baseProduct = staticList.find(
    (p) => p.id === slug || p.id === row.id || p.name.toLowerCase() === (row.nama || '').toLowerCase()
  );

  if (!baseProduct) {
    // Fallback if no matching static product
    baseProduct = staticList[0];
  }

  return {
    ...baseProduct,
    id: slug || baseProduct.id,
    name: row.nama || baseProduct.name,
    description: row.deskripsi || baseProduct.description,
    basePrice: row.harga_dasar !== undefined && row.harga_dasar !== null ? Number(row.harga_dasar) : baseProduct.basePrice,
    image: row.gambar_url || baseProduct.image,
    model3D: row.model_3d_url || baseProduct.model3D,
  };
}

/**
 * GET /api/products
 * Returns all products merged with Supabase data
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: true, products: STATIC_PRODUCTS });
    }

    const { data: dbProducts, error } = await supabase
      .from('produk')
      .select('*')
      .eq('aktif', true)
      .order('created_at', { ascending: true });

    if (error || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ success: true, products: STATIC_PRODUCTS });
    }

    // Merge each static product with corresponding db row
    const mergedList: Product[] = STATIC_PRODUCTS.map((sp) => {
      const targetUuid = SLUG_TO_UUID[sp.id];
      const foundRow = dbProducts.find(
        (r) => r.id === targetUuid || (r.nama && r.nama.toLowerCase() === sp.name.toLowerCase())
      );

      if (foundRow) {
        return {
          ...sp,
          name: foundRow.nama || sp.name,
          description: foundRow.deskripsi || sp.description,
          basePrice: foundRow.harga_dasar !== undefined && foundRow.harga_dasar !== null ? Number(foundRow.harga_dasar) : sp.basePrice,
          image: foundRow.gambar_url || sp.image,
          model3D: foundRow.model_3d_url || sp.model3D,
        };
      }
      return sp;
    });

    return NextResponse.json({ success: true, products: mergedList });
  } catch (err: any) {
    console.error('API /api/products GET error:', err);
    return NextResponse.json({ success: true, products: STATIC_PRODUCTS });
  }
}

/**
 * PATCH /api/products
 * Allows admin to update name, description, and base price
 */
export async function PATCH(request: Request) {
  try {
    const admin = getAdminUserFromCookie();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Silakan login sebagai admin.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, description, basePrice } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID produk tidak boleh kosong.' },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama produk tidak boleh kosong.' },
        { status: 400 }
      );
    }

    if (basePrice === undefined || isNaN(Number(basePrice)) || Number(basePrice) < 0) {
      return NextResponse.json(
        { success: false, message: 'Harga produk harus berupa angka positif yang valid.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Database Supabase tidak terhubung.' },
        { status: 500 }
      );
    }

    // Determine target UUID
    const targetUuid = SLUG_TO_UUID[id] || id;

    // Check if row exists with targetUuid
    const { data: existing, error: findErr } = await supabase
      .from('produk')
      .select('id, nama')
      .eq('id', targetUuid)
      .maybeSingle();

    let updatedDbRow: any = null;

    if (existing) {
      const { data: updated, error: updateErr } = await supabase
        .from('produk')
        .update({
          nama: name.trim(),
          deskripsi: description !== undefined ? description.trim() : '',
          harga_dasar: Number(basePrice),
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUuid)
        .select()
        .single();

      if (updateErr) {
        console.error('Failed to update product in Supabase:', updateErr);
        return NextResponse.json(
          { success: false, message: `Gagal memperbarui produk: ${updateErr.message}` },
          { status: 500 }
        );
      }
      updatedDbRow = updated;
    } else {
      // Try finding by matching original static name
      const staticProd = STATIC_PRODUCTS.find((p) => p.id === id);
      const searchName = staticProd ? staticProd.name : name;

      const { data: foundByName } = await supabase
        .from('produk')
        .select('id')
        .ilike('nama', searchName)
        .maybeSingle();

      if (foundByName) {
        const { data: updated, error: updateErr } = await supabase
          .from('produk')
          .update({
            nama: name.trim(),
            deskripsi: description !== undefined ? description.trim() : '',
            harga_dasar: Number(basePrice),
            updated_at: new Date().toISOString(),
          })
          .eq('id', foundByName.id)
          .select()
          .single();

        if (updateErr) {
          return NextResponse.json(
            { success: false, message: `Gagal memperbarui produk: ${updateErr.message}` },
            { status: 500 }
          );
        }
        updatedDbRow = updated;
      } else {
        // Insert new product row
        const { data: inserted, error: insertErr } = await supabase
          .from('produk')
          .insert({
            id: targetUuid.length === 36 ? targetUuid : undefined,
            nama: name.trim(),
            deskripsi: description !== undefined ? description.trim() : '',
            harga_dasar: Number(basePrice),
            aktif: true,
          })
          .select()
          .single();

        if (insertErr) {
          return NextResponse.json(
            { success: false, message: `Gagal menyimpan produk baru: ${insertErr.message}` },
            { status: 500 }
          );
        }
        updatedDbRow = inserted;
      }
    }

    const finalProduct = mergeDbRowWithStatic(updatedDbRow, STATIC_PRODUCTS);

    return NextResponse.json({
      success: true,
      message: `Produk "${name.trim()}" berhasil diperbarui.`,
      product: finalProduct,
    });
  } catch (err: any) {
    console.error('API /api/products PATCH error:', err);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server saat memperbarui produk.' },
      { status: 500 }
    );
  }
}
