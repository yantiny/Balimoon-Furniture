import { CustomizationState, OrderData, OrderStatus, AdminStatsSummary, StatusHistoryItem } from '../types/furniture';
import { calculateEstimatedPrice } from '../utils/pricing';
import { getProductById } from '../data/products';
import { generateOrderCode } from '../utils/orderCode';
import { getSupabaseAdmin, isSupabaseConfigured } from '../lib/supabase';
import { saveLocalOrder, getLocalOrders, updateLocalOrderStatus } from './localStorageService';

// Status Mapping between DB (snake_case) and UI (UPPERCASE/Readable)
export const DB_STATUS_TO_UI: Record<string, OrderStatus> = {
  'menunggu_konfirmasi': 'SUBMITTED',
  'menunggu_persetujuan_harga': 'DIPROSES',
  'dalam_produksi': 'PRODUKSI',
  'finishing': 'FINISHING',
  'siap_dikirim': 'SIAP DIKIRIM',
  'selesai': 'SELESAI',
  'dibatalkan': 'DIBATALKAN',

  // Reverse Fallbacks
  'SUBMITTED': 'SUBMITTED',
  'DIPROSES': 'DIPROSES',
  'PRODUKSI': 'PRODUKSI',
  'FINISHING': 'FINISHING',
  'SIAP DIKIRIM': 'SIAP DIKIRIM',
  'DIKIRIM': 'SIAP DIKIRIM',
  'SELESAI': 'SELESAI',
  'DIBATALKAN': 'DIBATALKAN',
};

export const UI_STATUS_TO_DB: Record<string, string> = {
  'SUBMITTED': 'menunggu_konfirmasi',
  'DIPROSES': 'menunggu_persetujuan_harga',
  'PRODUKSI': 'dalam_produksi',
  'FINISHING': 'finishing',
  'SIAP DIKIRIM': 'siap_dikirim',
  'DIKIRIM': 'siap_dikirim',
  'SELESAI': 'selesai',
  'DIBATALKAN': 'dibatalkan',

  // Direct Fallbacks
  'menunggu_konfirmasi': 'menunggu_konfirmasi',
  'menunggu_persetujuan_harga': 'menunggu_persetujuan_harga',
  'dalam_produksi': 'dalam_produksi',
  'finishing': 'finishing',
  'siap_dikirim': 'siap_dikirim',
  'selesai': 'selesai',
  'dibatalkan': 'dibatalkan',
};

/**
 * Normalizes DB row object into standard OrderData
 */
export function mapDbRowToOrderData(row: any, statusHistory: StatusHistoryItem[] = []): OrderData {
  const pelanggan = row.pelanggan || {};
  const produk = row.produk || {};

  const dbStatus = row.status || 'menunggu_konfirmasi';
  const uiStatus = DB_STATUS_TO_UI[dbStatus] || 'SUBMITTED';

  return {
    orderId: row.kode_pesanan || row.orderId || '',
    "Id-Pemesanan": row.kode_pesanan || row.orderId || '',
    date: row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('id-ID'),
    customerName: pelanggan.nama || row.nama_pelanggan || row.customerName || 'Pelanggan',
    whatsapp: pelanggan.no_whatsapp || pelanggan.whatsapp || row.no_whatsapp || row.whatsapp || '-',
    email: pelanggan.email || row.email || '-',
    address: pelanggan.alamat || row.address || '-',
    productId: row.produk_id || row.productId || '',
    productName: produk.nama || row.nama_produk || row.productName || 'Mebel Custom',
    length: Number(row.panjang || row.length || 0),
    width: Number(row.lebar || row.width || 0),
    height: Number(row.tinggi || row.height || 0),
    material: row.material || 'Kayu Jati Perhutani',
    finishing: row.finishing || 'Natural Wood Finish',
    additionalRequest: row.catatan || row.permintaan_tambahan || row.additionalRequest || '-',
    referenceImage: row.gambar_referensi || row.referenceImage || '',
    estimatedPrice: Number(row.estimasi_harga || row.estimatedPrice || 0),
    finalPrice: row.harga_final !== null && row.harga_final !== undefined ? Number(row.harga_final) : null,
    status: uiStatus,
    estimatedProductionTime: '14 - 21 Days',
    statusHistory: statusHistory.length > 0 ? statusHistory : (row.statusHistory || []),
    timelineDates: {
      submitted: row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')
    }
  };
}

/**
 * Helper to ensure product exists in public.produk and return a valid UUID
 */
async function getOrCreateProductUuid(supabaseAdmin: any, product: any): Promise<string> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(product.id)) {
    return product.id;
  }

  try {
    const { data: found } = await supabaseAdmin
      .from('produk')
      .select('id')
      .ilike('nama', product.name)
      .limit(1)
      .maybeSingle();

    if (found && found.id) {
      return found.id;
    }

    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from('produk')
      .insert({
        nama: product.name,
        deskripsi: product.description || product.tagline || 'Mebel Custom',
        harga_dasar: product.basePrice || 0,
        gambar_url: product.image || '',
        model_3d_url: product.model3D || '',
        aktif: true
      })
      .select()
      .maybeSingle();

    if (inserted && inserted.id) {
      return inserted.id;
    }

    if (insertErr) {
      console.warn('[Product Insert Warning]:', insertErr.message);
    }
  } catch (e) {
    console.warn('[getOrCreateProductUuid Exception]:', e);
  }

  return 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
}

/**
 * 1. SUBMIT ORDER VIA BACKEND
 */
export async function createOrder(customization: CustomizationState): Promise<{ success: boolean; data?: OrderData; message?: string }> {
  const product = getProductById(customization.productId);
  if (!product) {
    return { success: false, message: 'Produk furniture tidak ditemukan.' };
  }

  if (
    customization.length < product.length.min || customization.length > product.length.max ||
    customization.width < product.width.min || customization.width > product.width.max ||
    customization.height < product.height.min || customization.height > product.height.max
  ) {
    return { success: false, message: 'Ukuran kustomisasi berada di luar batas yang diizinkan.' };
  }

  if (!customization.customerName.trim() || !customization.whatsapp.trim() || !customization.email.trim() || !customization.address.trim()) {
    return { success: false, message: 'Harap melengkapi seluruh data pemesan.' };
  }

  const { totalEstimatedPrice } = calculateEstimatedPrice(
    product,
    customization.length,
    customization.width,
    customization.height,
    customization.selectedMaterial
  );

  const orderCode = generateOrderCode();
  const supabaseAdmin = getSupabaseAdmin();

  if (supabaseAdmin && isSupabaseConfigured()) {
    try {
      const productUuid = await getOrCreateProductUuid(supabaseAdmin, product);

      // Insert customer
      const { data: pelangganData, error: pelangganError } = await supabaseAdmin
        .from('pelanggan')
        .insert({
          nama: customization.customerName.trim(),
          no_whatsapp: customization.whatsapp.trim(),
        })
        .select()
        .single();

      if (pelangganError) {
        console.error('[Supabase Insert Pelanggan Error]:', pelangganError);
        throw new Error(`Gagal menyimpan pelanggan: ${pelangganError.message}`);
      }

      // Insert order
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('pesanan')
        .insert({
          kode_pesanan: orderCode,
          pelanggan_id: pelangganData.id,
          produk_id: productUuid,
          panjang: customization.length,
          lebar: customization.width,
          tinggi: customization.height,
          satuan_ukuran: 'cm',
          catatan: customization.additionalRequest || '-',
          estimasi_harga: totalEstimatedPrice,
          harga_final: null,
          status: 'menunggu_konfirmasi',
        })
        .select()
        .single();

      if (orderError) {
        console.error('[Supabase Insert Pesanan Error]:', orderError);
        throw new Error(`Gagal menyimpan pesanan: ${orderError.message}`);
      }

      // Insert initial status history
      await supabaseAdmin.from('riwayat_status').insert({
        pesanan_id: orderData.id,
        status: 'menunggu_konfirmasi',
        catatan: 'Pesanan baru berhasil dibuat oleh pelanggan.',
      });

      const formattedOrder = mapDbRowToOrderData({
        ...orderData,
        nama_produk: product.name,
        pelanggan: pelangganData,
      }, [
        {
          status_lama: null,
          status_baru: 'SUBMITTED',
          catatan: 'Pesanan baru berhasil dibuat oleh pelanggan.',
          dibuat_oleh: 'System/Pelanggan',
          created_at: new Date().toISOString(),
        }
      ]);

      saveLocalOrder(formattedOrder);

      return {
        success: true,
        data: formattedOrder,
        message: 'Pesanan berhasil dibuat dan tersimpan di database.',
      };
    } catch (err: any) {
      console.error('[Order creation failed on Supabase]:', err?.message || err);
    }
  }

  // Local/Offline Fallback Order Creation
  const fallbackOrder: OrderData = {
    orderId: orderCode,
    "Id-Pemesanan": orderCode,
    date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    customerName: customization.customerName,
    whatsapp: customization.whatsapp,
    email: customization.email,
    address: customization.address,
    productId: product.id,
    productName: product.name,
    length: customization.length,
    width: customization.width,
    height: customization.height,
    material: customization.selectedMaterial || 'Kayu Jati Perhutani',
    finishing: product.finishing || 'Natural Wood Finish',
    additionalRequest: customization.additionalRequest || '-',
    referenceImage: customization.referenceImage || '',
    estimatedPrice: totalEstimatedPrice,
    status: 'SUBMITTED',
    estimatedProductionTime: product.productionTime || '14 - 21 Hari',
    statusHistory: [
      {
        status_lama: null,
        status_baru: 'SUBMITTED',
        catatan: 'Pesanan disimpan secara lokal (Offline Cache).',
        dibuat_oleh: 'System',
        created_at: new Date().toISOString(),
      }
    ],
    timelineDates: { submitted: new Date().toLocaleDateString('id-ID') }
  };

  saveLocalOrder(fallbackOrder);

  return {
    success: true,
    data: fallbackOrder,
    message: 'Pesanan berhasil dibuat (Mode Cache Lokal).'
  };
}

/**
 * 2. GET ORDER BY KODE PESANAN (PUBLIC TRACKING)
 */
export async function getOrderByCode(code: string): Promise<{ success: boolean; data?: OrderData; message?: string }> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, message: 'Harap masukkan kode pesanan yang valid.' };
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (supabaseAdmin && isSupabaseConfigured()) {
    try {
      // Step 1: Query order
      const { data: orderRow, error: orderErr } = await supabaseAdmin
        .from('pesanan')
        .select('*')
        .eq('kode_pesanan', cleanCode)
        .maybeSingle();

      if (!orderErr && orderRow) {
        // Step 2: Fetch pelanggan
        let pelangganObj: any = {};
        if (orderRow.pelanggan_id) {
          const { data: pData } = await supabaseAdmin
            .from('pelanggan')
            .select('nama, no_whatsapp')
            .eq('id', orderRow.pelanggan_id)
            .maybeSingle();
          if (pData) pelangganObj = pData;
        }

        // Step 3: Fetch produk
        let produkObj: any = {};
        if (orderRow.produk_id) {
          const { data: prData } = await supabaseAdmin
            .from('produk')
            .select('nama')
            .eq('id', orderRow.produk_id)
            .maybeSingle();
          if (prData) produkObj = prData;
        }

        // Step 4: Fetch history
        const { data: historyRows } = await supabaseAdmin
          .from('riwayat_status')
          .select('*')
          .eq('pesanan_id', orderRow.id)
          .order('created_at', { ascending: true });

        const history: StatusHistoryItem[] = (historyRows || []).map(h => ({
          id: h.id,
          pesanan_id: h.pesanan_id,
          status_lama: null,
          status_baru: DB_STATUS_TO_UI[h.status] || h.status,
          catatan: h.catatan,
          dibuat_oleh: 'System',
          created_at: h.created_at,
        }));

        const mergedRow = {
          ...orderRow,
          pelanggan: pelangganObj,
          produk: produkObj,
        };

        const result = mapDbRowToOrderData(mergedRow, history);
        saveLocalOrder(result);
        return { success: true, data: result };
      }
    } catch (err) {
      console.error('[Supabase Track Order Error]:', err);
    }
  }

  // Fallback to local storage
  const localOrders = getLocalOrders();
  const matched = localOrders.find(o => o.orderId.toUpperCase() === cleanCode);
  if (matched) {
    return { success: true, data: matched };
  }

  return { success: false, message: `Pesanan dengan kode "${cleanCode}" tidak ditemukan.` };
}

/**
 * 3. GET ALL ADMIN ORDERS WITH FILTERS
 */
export async function getAdminOrders(searchQuery: string = '', statusFilter: string = 'ALL'): Promise<{ success: boolean; orders: OrderData[]; stats: AdminStatsSummary }> {
  const supabaseAdmin = getSupabaseAdmin();
  let ordersList: OrderData[] = [];

  if (supabaseAdmin && isSupabaseConfigured()) {
    try {
      let query = supabaseAdmin
        .from('pesanan')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'ALL') {
        const dbStatusFilter = UI_STATUS_TO_DB[statusFilter] || statusFilter;
        query = query.eq('status', dbStatusFilter);
      }

      const { data: dbRows, error } = await query;

      if (!error && dbRows && dbRows.length > 0) {
        // Fetch pelanggan & produk for all rows
        const pelangganIds = Array.from(new Set(dbRows.map(r => r.pelanggan_id).filter(Boolean)));
        const produkIds = Array.from(new Set(dbRows.map(r => r.produk_id).filter(Boolean)));

        const { data: pelangganList } = await supabaseAdmin
          .from('pelanggan')
          .select('id, nama, no_whatsapp')
          .in('id', pelangganIds);

        const { data: produkList } = await supabaseAdmin
          .from('produk')
          .select('id, nama')
          .in('id', produkIds);

        const pelangganMap = new Map((pelangganList || []).map(p => [p.id, p]));
        const produkMap = new Map((produkList || []).map(p => [p.id, p]));

        ordersList = dbRows.map(row => {
          return mapDbRowToOrderData({
            ...row,
            pelanggan: pelangganMap.get(row.pelanggan_id) || {},
            produk: produkMap.get(row.produk_id) || {}
          });
        });

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          ordersList = ordersList.filter(o =>
            o.orderId.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.productName.toLowerCase().includes(q) ||
            o.whatsapp.includes(q)
          );
        }
      }
    } catch (err) {
      console.error('[Supabase Fetch Admin Orders Error]:', err);
    }
  }

  if (ordersList.length === 0) {
    let local = getLocalOrders();
    if (statusFilter && statusFilter !== 'ALL') {
      local = local.filter(o => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      local = local.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.whatsapp.includes(q)
      );
    }
    ordersList = local;
  }

  const stats: AdminStatsSummary = {
    totalOrders: ordersList.length,
    submittedOrders: ordersList.filter(o => o.status === 'SUBMITTED' || o.status === 'DIPROSES').length,
    inProductionOrders: ordersList.filter(o => o.status === 'PRODUKSI' || o.status === 'FINISHING' || o.status === 'SIAP DIKIRIM' || o.status === 'DIKIRIM').length,
    completedOrders: ordersList.filter(o => o.status === 'SELESAI').length,
  };

  return { success: true, orders: ordersList, stats };
}

/**
 * 4. UPDATE ORDER PRICE & STATUS (ADMIN ONLY)
 */
export async function updateOrderAdmin(
  code: string,
  newFinalPrice: number | null,
  newStatus: OrderStatus,
  note: string = '',
  updatedByAdmin: string = 'Admin'
): Promise<{ success: boolean; data?: OrderData; message: string }> {
  const cleanCode = code.trim().toUpperCase();
  const supabaseAdmin = getSupabaseAdmin();

  const dbStatus = UI_STATUS_TO_DB[newStatus] || newStatus;

  if (supabaseAdmin && isSupabaseConfigured()) {
    try {
      const { data: existingOrder, error: findErr } = await supabaseAdmin
        .from('pesanan')
        .select('*')
        .eq('kode_pesanan', cleanCode)
        .maybeSingle();

      if (findErr || !existingOrder) {
        return { success: false, message: `Pesanan ${cleanCode} tidak ditemukan di database.` };
      }

      const updatePayload: any = {
        status: dbStatus,
        updated_at: new Date().toISOString()
      };
      if (newFinalPrice !== undefined) {
        updatePayload.harga_final = newFinalPrice;
      }

      const { data: updatedDb, error: updateErr } = await supabaseAdmin
        .from('pesanan')
        .update(updatePayload)
        .eq('id', existingOrder.id)
        .select()
        .single();

      if (updateErr) {
        console.error('[Supabase Order Update Error]:', updateErr);
        return { success: false, message: 'Gagal memperbarui data pesanan di database.' };
      }

      // Add audit status history record
      await supabaseAdmin.from('riwayat_status').insert({
        pesanan_id: existingOrder.id,
        status: dbStatus,
        catatan: note || `Status diubah menjadi ${newStatus}${newFinalPrice !== null ? ` dan harga final Rp ${newFinalPrice.toLocaleString('id-ID')}` : ''}.`,
      });

      // Fetch fresh history
      const { data: historyRows } = await supabaseAdmin
        .from('riwayat_status')
        .select('*')
        .eq('pesanan_id', existingOrder.id)
        .order('created_at', { ascending: true });

      const history: StatusHistoryItem[] = (historyRows || []).map(h => ({
        id: h.id,
        pesanan_id: h.pesanan_id,
        status_lama: null,
        status_baru: DB_STATUS_TO_UI[h.status] || h.status,
        catatan: h.catatan,
        dibuat_oleh: updatedByAdmin,
        created_at: h.created_at,
      }));

      // Fetch pelanggan & produk details
      let pelangganObj: any = {};
      if (updatedDb.pelanggan_id) {
        const { data: pData } = await supabaseAdmin.from('pelanggan').select('nama, no_whatsapp').eq('id', updatedDb.pelanggan_id).maybeSingle();
        if (pData) pelangganObj = pData;
      }
      let produkObj: any = {};
      if (updatedDb.produk_id) {
        const { data: prData } = await supabaseAdmin.from('produk').select('nama').eq('id', updatedDb.produk_id).maybeSingle();
        if (prData) produkObj = prData;
      }

      const finalOrder = mapDbRowToOrderData({
        ...updatedDb,
        pelanggan: pelangganObj,
        produk: produkObj,
      }, history);

      saveLocalOrder(finalOrder);

      return {
        success: true,
        data: finalOrder,
        message: `Pesanan ${cleanCode} berhasil diperbarui.`
      };
    } catch (err: any) {
      console.error('[Admin Order Update Error]:', err);
    }
  }

  // Local storage update fallback
  updateLocalOrderStatus(cleanCode, newStatus);
  const localOrders = getLocalOrders();
  const localIndex = localOrders.findIndex(o => o.orderId.toUpperCase() === cleanCode);
  if (localIndex !== -1) {
    if (newFinalPrice !== undefined) {
      localOrders[localIndex].finalPrice = newFinalPrice;
    }
    localOrders[localIndex].status = newStatus;
    if (!localOrders[localIndex].statusHistory) {
      localOrders[localIndex].statusHistory = [];
    }
    localOrders[localIndex].statusHistory!.push({
      status_lama: localOrders[localIndex].status,
      status_baru: newStatus,
      catatan: note || `Status diperbarui menjadi ${newStatus}`,
      dibuat_oleh: updatedByAdmin,
      created_at: new Date().toISOString()
    });
    saveLocalOrder(localOrders[localIndex]);

    return {
      success: true,
      data: localOrders[localIndex],
      message: `Status pesanan ${cleanCode} diperbarui di memori lokal.`
    };
  }

  return { success: false, message: 'Gagal memperbarui pesanan.' };
}
