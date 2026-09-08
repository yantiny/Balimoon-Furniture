import { CustomizationState, OrderData, OrderStatus } from '../types/furniture';
import { calculateEstimatedPrice } from '../utils/pricing';
import { getProductById } from '../data/products';

const CREATE_ORDER_WEBHOOK = process.env.NEXT_PUBLIC_N8N_CREATE_ORDER_WEBHOOK || 'https://n8n.imadegautama.com/webhook/create-order';
const TRACK_ORDER_WEBHOOK = process.env.NEXT_PUBLIC_N8N_TRACK_ORDER_WEBHOOK || 'https://n8n.imadegautama.com/webhook/tracking-order';
const UPDATE_ORDER_WEBHOOK = process.env.NEXT_PUBLIC_N8N_UPDATE_ORDER_WEBHOOK || 'https://n8n.imadegautama.com/webhook/update-order-status';

const LOCAL_STORAGE_KEY = 'custom_furniture_orders_v1';

/**
 * Saves order into browser localStorage for offline fallback cache
 */
export function saveLocalOrder(order: OrderData): void {
  if (typeof window === 'undefined' || !order.orderId) return;
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing.filter(o => o.orderId.toUpperCase() !== order.orderId.toUpperCase())];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}

/**
 * Retrieves local orders from browser localStorage
 */
export function getLocalOrders(): OrderData[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error('Failed to read orders from localStorage', e);
    return [];
  }
}

/**
 * Updates status of a local order by Order ID
 */
export function updateLocalOrderStatus(orderId: string, newStatus: OrderStatus): void {
  if (typeof window === 'undefined' || !orderId) return;
  const orders = getLocalOrders();
  const index = orders.findIndex(o => o.orderId.toUpperCase() === orderId.trim().toUpperCase());
  if (index !== -1) {
    orders[index].status = newStatus;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  }
}

/**
 * Deletes an order by Order ID from browser localStorage
 */
export function deleteLocalOrder(orderId: string): OrderData[] {
  if (typeof window === 'undefined' || !orderId) return getLocalOrders();
  try {
    const existing = getLocalOrders();
    const updated = existing.filter(o => o.orderId.toUpperCase() !== orderId.trim().toUpperCase());
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete order from localStorage', e);
    return getLocalOrders();
  }
}

/**
 * Helper to normalize raw JSON object from n8n / Google Sheets into OrderData
 * Matches Google Sheets column headers: Id-Pemesanan, Tanggal, Nama Pelanggan, No Whatsapp, Email, Alamat, Id-Produk, Nama Produk, Panjang, Lebar, Tinggi, Material, Finishing, Permintaan Tambahan, Estimasi Harga, Harga Final, Status
 */
export function normalizeOrderData(raw: any, fallback?: OrderData): OrderData {
  if (!raw || typeof raw !== 'object') {
    return fallback || {
      orderId: '',
      date: new Date().toLocaleDateString('id-ID'),
      customerName: '-',
      whatsapp: '-',
      email: '-',
      address: '-',
      productId: '',
      productName: '-',
      length: 0,
      width: 0,
      height: 0,
      material: '-',
      finishing: '-',
      additionalRequest: '-',
      referenceImage: '',
      estimatedPrice: 0,
      status: 'SUBMITTED',
      estimatedProductionTime: '14 - 21 Days'
    };
  }

  // Support nested `pesanan` property from n8n response schema
  const item = raw.pesanan && typeof raw.pesanan === 'object' ? raw.pesanan : raw;

  // 1. Order ID (supports `idPesanan`, `Id-Pemesanan`, `orderId`, etc.)
  const idPemesanan =
    item.idPesanan ||
    item.id_pesanan ||
    item['Id-Pemesanan'] ||
    item['idPemesanan'] ||
    item['id-pemesanan'] ||
    item['Id_Pemesanan'] ||
    item['id_pemesanan'] ||
    item['Id Pemesanan'] ||
    item.orderId ||
    item.order_id ||
    item.OrderId ||
    item.ID ||
    fallback?.orderId ||
    '';

  const cleanId = String(idPemesanan).trim();

  // 2. Status normalization
  const rawStatus = item.status || item['Status'] || item.orderStatus || fallback?.status || 'SUBMITTED';
  const statusStr = String(rawStatus).toUpperCase().trim();
  let status: OrderStatus = 'SUBMITTED';
  if (statusStr === 'DIPRODUKSI' || statusStr === 'PRODUKSI' || statusStr === 'PRODUCTION') {
    status = 'PRODUKSI';
  } else if (statusStr === 'DIPROSES' || statusStr === 'DESIGN_CONFIRMATION') {
    status = 'DIPROSES';
  } else if (statusStr === 'FINISHING' || statusStr === 'QUALITY_CHECK') {
    status = 'FINISHING';
  } else if (statusStr === 'SIAP DIKIRIM' || statusStr === 'SIAP_DIKIRIM' || statusStr === 'READY_TO_SHIP') {
    status = 'SIAP DIKIRIM';
  } else if (statusStr === 'DIKIRIM' || statusStr === 'SHIPPED') {
    status = 'DIKIRIM';
  } else if (statusStr === 'SELESAI' || statusStr === 'COMPLETED') {
    status = 'SELESAI';
  } else if (statusStr === 'DIBATALKAN' || statusStr === 'CANCELLED') {
    status = 'DIBATALKAN';
  } else {
    status = rawStatus as OrderStatus;
  }

  // 3. Customer Name
  const pemesanObj = (item.pemesan && typeof item.pemesan === 'object' ? item.pemesan : {}) ||
    (item.pelanggan && typeof item.pelanggan === 'object' ? item.pelanggan : {});
  const rawPemesanObj = (raw.pemesan && typeof raw.pemesan === 'object' ? raw.pemesan : {}) ||
    (raw.pelanggan && typeof raw.pelanggan === 'object' ? raw.pelanggan : {});

  const customerName =
    pemesanObj.nama ||
    pemesanObj.namaPemesan ||
    pemesanObj.namaPelanggan ||
    pemesanObj.name ||
    rawPemesanObj.nama ||
    rawPemesanObj.namaPemesan ||
    rawPemesanObj.namaPelanggan ||
    rawPemesanObj.name ||
    item.namaPemesan ||
    item.nama_pemesan ||
    item.namaPelanggan ||
    item['Nama Pelanggan'] ||
    item['Nama_Pelanggan'] ||
    item.customerName ||
    item.customer_name ||
    raw.namaPemesan ||
    raw['Nama Pelanggan'] ||
    raw.customerName ||
    fallback?.customerName ||
    'Pelanggan';

  // 4. Product ID & Name (supports nested `barangDipesan: { idProduk, namaProduk }` or flat fields)
  const barang = item.barangDipesan && typeof item.barangDipesan === 'object' ? item.barangDipesan : {};
  const prodId =
    barang.idProduk ||
    barang.id_produk ||
    item.idProduk ||
    item.id_produk ||
    item['Id-Produk'] ||
    item['id-produk'] ||
    item['Id_Produk'] ||
    item.productId ||
    item.product_id ||
    fallback?.productId ||
    '';

  const prodName =
    barang.namaProduk ||
    barang.nama_produk ||
    item.namaProduk ||
    item.nama_produk ||
    item['Nama Produk'] ||
    item['Nama_Produk'] ||
    item.productName ||
    item.product_name ||
    fallback?.productName ||
    'Mebel Custom';

  // 5. Dimensions (supports nested `ukuran: { panjang, lebar, tinggi }` or flat fields)
  const ukuran = item.ukuran && typeof item.ukuran === 'object' ? item.ukuran : {};
  const lengthVal = ukuran.panjang ?? item.panjang ?? item['Panjang'] ?? item.length ?? fallback?.length ?? 0;
  const widthVal = ukuran.lebar ?? item.lebar ?? item['Lebar'] ?? item.width ?? fallback?.width ?? 0;
  const heightVal = ukuran.tinggi ?? item.tinggi ?? item['Tinggi'] ?? item.height ?? fallback?.height ?? 0;

  // 6. Material & Finishing
  const rawMat = item.material || item['Material'] || item.bahanKayu || item['Bahan Kayu'] || item.selectedMaterial || fallback?.material;
  const material = (rawMat && rawMat !== '-' && rawMat !== 'undefined' && String(rawMat).trim() !== '') ? String(rawMat).trim() : 'Kayu Jati Solid';

  const rawFin = item.finishing || item['Finishing'] || fallback?.finishing;
  const finishing = (rawFin && rawFin !== '-' && rawFin !== 'undefined' && String(rawFin).trim() !== '') ? String(rawFin).trim() : 'Finishing Alami Kayu';

  // 7. Additional Request
  const additionalRequest =
    item.permintaanTambahan ||
    item.permintaan_tambahan ||
    item['Permintaan Tambahan'] ||
    item['Permintaan_Tambahan'] ||
    item.additionalRequest ||
    item.additional_request ||
    fallback?.additionalRequest ||
    '-';

  // 8. Price calculations (Estimasi & Final)
  const estPriceRaw =
    item.estimasiHarga ??
    item.estimasi_harga ??
    item['Estimasi Harga'] ??
    item['Estimasi_Harga'] ??
    item.estimatedPrice ??
    item.estimated_price ??
    fallback?.estimatedPrice ??
    0;
  const estimatedPrice = Number(estPriceRaw) || (fallback?.estimatedPrice ?? 0);

  const finalPriceRaw =
    item.hargaFinal ??
    item.harga_final ??
    item['Harga Final'] ??
    item['Harga_Final'] ??
    item.finalPrice ??
    item.final_price;

  let finalPrice: number | undefined = undefined;
  if (finalPriceRaw !== undefined && finalPriceRaw !== null && finalPriceRaw !== '') {
    const num = Number(finalPriceRaw);
    if (!isNaN(num)) {
      finalPrice = num;
    }
  } else if (fallback?.finalPrice !== undefined) {
    finalPrice = fallback.finalPrice;
  }

  // 9. Contact Info & Date
  const date =
    item.tanggal ||
    item['Tanggal'] ||
    item.date ||
    item.submittedAt ||
    raw.tanggal ||
    raw['Tanggal'] ||
    raw.date ||
    fallback?.date ||
    new Date().toLocaleDateString('id-ID');

  const rawWa =
    item.whatsapp ??
    item.noWhatsapp ??
    item.noWhatsApp ??
    item['No Whatsapp'] ??
    item['No_Whatsapp'] ??
    item['No. Whatsapp'] ??
    item['no_whatsapp'] ??
    item['nomorWhatsapp'] ??
    item['nomor_whatsapp'] ??
    item['No WA'] ??
    item['noWa'] ??
    item.phone ??
    pemesanObj.whatsapp ??
    pemesanObj.noWhatsapp ??
    pemesanObj.noWhatsApp ??
    pemesanObj.phone ??
    rawPemesanObj.whatsapp ??
    rawPemesanObj.noWhatsapp ??
    rawPemesanObj.noWhatsApp ??
    rawPemesanObj.phone ??
    raw.whatsapp ??
    raw.noWhatsapp ??
    raw.noWhatsApp ??
    raw['No Whatsapp'] ??
    fallback?.whatsapp ??
    '-';

  const whatsapp = (rawWa !== undefined && rawWa !== null && rawWa !== '' && rawWa !== '-') ? String(rawWa).trim() : (fallback?.whatsapp || '-');

  const rawEmail =
    item.email ??
    item['Email'] ??
    item.emailPelanggan ??
    item['Email Pelanggan'] ??
    item['email_pelanggan'] ??
    pemesanObj.email ??
    rawPemesanObj.email ??
    raw.email ??
    raw['Email'] ??
    fallback?.email ??
    '-';

  const email = (rawEmail !== undefined && rawEmail !== null && rawEmail !== '' && rawEmail !== '-') ? String(rawEmail).trim() : (fallback?.email || '-');

  const rawAddr =
    item.alamat ??
    item.address ??
    item['Alamat'] ??
    item.Address ??
    item.alamatPelanggan ??
    item['Alamat Pelanggan'] ??
    item['alamat_pelanggan'] ??
    item['alamatPengiriman'] ??
    item['Alamat Pengiriman'] ??
    pemesanObj.alamat ??
    pemesanObj.address ??
    rawPemesanObj.alamat ??
    rawPemesanObj.address ??
    raw.alamat ??
    raw.address ??
    raw['Alamat'] ??
    fallback?.address ??
    '-';

  const address = (rawAddr !== undefined && rawAddr !== null && rawAddr !== '' && rawAddr !== '-') ? String(rawAddr).trim() : (fallback?.address || '-');

  const referenceImage = item.referenceImage || item.gambarReferensi || item['Gambar Referensi'] || fallback?.referenceImage || '';

  return {
    orderId: cleanId,
    "Id-Pemesanan": cleanId,
    date,
    customerName,
    whatsapp,
    email,
    address,
    productId: String(prodId).trim(),
    productName: prodName,
    length: Number(lengthVal) || 0,
    width: Number(widthVal) || 0,
    height: Number(heightVal) || 0,
    material,
    finishing,
    additionalRequest,
    referenceImage,
    estimatedPrice,
    finalPrice,
    status,
    estimatedProductionTime: item.estimatedProductionTime || fallback?.estimatedProductionTime || '14 - 21 Days',
    timelineDates: item.timelineDates || fallback?.timelineDates || { submitted: date || 'Terdaftar' }
  };
}

/**
 * Helper to match Order ID from raw object
 */
function isMatchingOrderId(item: any, cleanId: string): boolean {
  if (!item || typeof item !== 'object') return false;
  const target = item.pesanan && typeof item.pesanan === 'object' ? item.pesanan : item;
  const id = (
    target.idPesanan ||
    target.id_pesanan ||
    target['Id-Pemesanan'] ||
    target['idPemesanan'] ||
    target['id-pemesanan'] ||
    target['Id_Pemesanan'] ||
    target['id_pemesanan'] ||
    target['Id Pemesanan'] ||
    target.orderId ||
    target.order_id ||
    target.OrderId ||
    target.ID ||
    ''
  );
  return String(id).trim().toUpperCase() === cleanId;
}

/**
 * 1. CREATE ORDER (Workflow 1)
 * Sends POST to n8n Workflow 1, which generates Id-Pemesanan and returns it in JSON response
 */
export async function submitOrderRequest(customization: CustomizationState): Promise<{ success: boolean; data: OrderData; message?: string; rawResult?: any }> {
  const product = getProductById(customization.productId);
  const { totalEstimatedPrice } = product
    ? calculateEstimatedPrice(product, customization.length, customization.width, customization.height, customization.selectedMaterial)
    : { totalEstimatedPrice: 2500000 };

  const currentDate = new Date().toISOString();

  if (CREATE_ORDER_WEBHOOK && CREATE_ORDER_WEBHOOK.startsWith('http')) {
    try {
      const response = await fetch(CREATE_ORDER_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "Tanggal": currentDate,
          "Nama Pelanggan": customization.customerName,
          customerName: customization.customerName,
          "No Whatsapp": customization.whatsapp,
          whatsapp: customization.whatsapp,
          "Email": customization.email,
          email: customization.email,
          "Alamat": customization.address,
          address: customization.address,
          "Id-Produk": customization.productId,
          productId: customization.productId,
          "Nama Produk": customization.productName,
          productName: customization.productName,
          "Panjang": customization.length,
          length: customization.length,
          "Lebar": customization.width,
          width: customization.width,
          "Tinggi": customization.height,
          height: customization.height,
          "Material": customization.selectedMaterial,
          material: customization.selectedMaterial,
          "Finishing": customization.finishing || 'Finishing Alami Kayu',
          finishing: customization.finishing || 'Finishing Alami Kayu',
          "Permintaan Tambahan": customization.additionalRequest || '-',
          additionalRequest: customization.additionalRequest || '-',
          "Estimasi Harga": totalEstimatedPrice,
          estimatedPrice: totalEstimatedPrice,
          "Status": 'SUBMITTED',
          status: 'SUBMITTED',
          submittedAt: currentDate,
        }),
      });

      if (response.ok) {
        const result = await response.json().catch(() => null);
        console.log("Response Workflow 1:", result);

        const returnedObj = Array.isArray(result)
          ? result[0]
          : (result?.pesanan || result?.order || result?.data || result);

        const returnedId =
          result?.pesanan?.idPesanan ||
          result?.idPesanan ||
          result?.["Id-Pemesanan"] ||
          result?.orderId ||
          (returnedObj && (
            returnedObj.idPesanan ||
            returnedObj.id_pesanan ||
            returnedObj['Id-Pemesanan'] ||
            returnedObj['idPemesanan'] ||
            returnedObj['id-pemesanan'] ||
            returnedObj['Id_Pemesanan'] ||
            returnedObj['id_pemesanan'] ||
            returnedObj.orderId ||
            returnedObj?.pesanan?.idPesanan
          )) || '';

        const cleanId = String(returnedId).trim();

        const baseFallback: OrderData = {
          orderId: cleanId,
          "Id-Pemesanan": cleanId,
          date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
          customerName: customization.customerName,
          whatsapp: customization.whatsapp,
          email: customization.email,
          address: customization.address,
          productId: customization.productId,
          productName: customization.productName,
          length: customization.length,
          width: customization.width,
          height: customization.height,
          material: customization.selectedMaterial,
          finishing: customization.finishing || 'Finishing Alami Kayu',
          additionalRequest: customization.additionalRequest || '-',
          referenceImage: customization.referenceImage || '',
          estimatedPrice: (result && result.estimatedPrice) || totalEstimatedPrice,
          status: (result && result.status) || 'SUBMITTED',
          estimatedProductionTime: product ? product.productionTime : '14 - 21 Days',
          timelineDates: {
            submitted: new Date().toLocaleDateString('id-ID')
          }
        };

        const finalOrderData = normalizeOrderData(result, baseFallback);

        if (cleanId) {
          finalOrderData.orderId = cleanId;
          finalOrderData["Id-Pemesanan"] = cleanId;
        }

        saveLocalOrder(finalOrderData);

        return {
          success: true,
          data: finalOrderData,
          rawResult: result,
          message: 'Pesanan berhasil dikirim ke n8n Workflow 1'
        };
      } else {
        const errText = await response.text().catch(() => '');
        console.error('[n8n POST Create Order Failed]:', response.status, errText);
      }
    } catch (error) {
      console.warn('Koneksi Webhook n8n Create Order gagal', error);
    }
  }

  return {
    success: false,
    data: {
      orderId: '',
      date: new Date().toLocaleDateString('id-ID'),
      customerName: customization.customerName,
      whatsapp: customization.whatsapp,
      email: customization.email,
      address: customization.address,
      productId: customization.productId,
      productName: customization.productName,
      length: customization.length,
      width: customization.width,
      height: customization.height,
      material: customization.selectedMaterial,
      finishing: customization.finishing || 'Finishing Alami Kayu',
      additionalRequest: customization.additionalRequest || '-',
      referenceImage: customization.referenceImage || '',
      estimatedPrice: totalEstimatedPrice,
      status: 'SUBMITTED',
      estimatedProductionTime: product ? product.productionTime : '14 - 21 Days'
    },
    message: 'Gagal mengirim pesanan ke n8n. Harap pastikan koneksi ke server n8n aktif.'
  };
}

/**
 * 2. TRACK ORDER (Workflow 2)
 * GET https://n8n.imadegautama.com/webhook-test/tracking-order?orderId=CF-20260906-264
 */
export async function trackOrderById(orderId: string): Promise<{ success: boolean; data?: OrderData; message?: string }> {
  const cleanId = orderId.trim().toUpperCase();

  if (!cleanId) {
    return { success: false, message: 'Harap masukkan ID Pesanan yang valid.' };
  }

  if (TRACK_ORDER_WEBHOOK && TRACK_ORDER_WEBHOOK.startsWith('http')) {
    try {
      const separator = TRACK_ORDER_WEBHOOK.includes('?') ? '&' : '?';
      const targetUrl = `${TRACK_ORDER_WEBHOOK}${separator}orderId=${encodeURIComponent(cleanId)}`;
      console.log(`[n8n GET Tracking] Requesting: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const resData = await response.json().catch(() => null);
        console.log('[n8n GET Tracking] Received response:', resData);

        if (resData) {
          if (resData.success === false) {
            return {
              success: false,
              message: resData.message || `ID Pesanan "${cleanId}" tidak ditemukan.`
            };
          }

          let matchedItem: any = null;

          if (resData.pesanan) {
            matchedItem = resData.pesanan;
          } else if (Array.isArray(resData)) {
            matchedItem = resData.find((item: any) => isMatchingOrderId(item, cleanId)) || resData[0];
          } else if (resData.data) {
            if (Array.isArray(resData.data)) {
              matchedItem = resData.data.find((item: any) => isMatchingOrderId(item, cleanId)) || resData.data[0];
            } else {
              matchedItem = resData.data;
            }
          } else if (resData.order) {
            matchedItem = resData.order;
          } else if (typeof resData === 'object') {
            matchedItem = resData;
          }

          if (matchedItem) {
            const localFallback = getLocalOrders().find(o => o.orderId.toUpperCase() === cleanId);
            const normalized = normalizeOrderData(matchedItem, localFallback);

            // Ensure orderId is set to cleanId
            normalized.orderId = cleanId;

            saveLocalOrder(normalized);
            return { success: true, data: normalized, message: resData.message || 'Pesanan ditemukan' };
          }
        }
      }
    } catch (err) {
      console.warn('[n8n GET Tracking] n8n fetch error:', err);
    }
  }

  return {
    success: false,
    message: `ID Pesanan "${cleanId}" tidak ditemukan. Harap periksa kembali ID Pesanan Anda.`
  };
}

/**
 * 3. UPDATE ORDER STATUS (Workflow 3)
 * POST to https://n8n.imadegautama.com/webhook-test/update-order-status
 * Payload: { "orderId": "CF-20260904-204", "status": "PRODUKSI" }
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; message: string; data?: OrderData }> {
  const cleanId = orderId.trim().toUpperCase();

  if (!cleanId) {
    return { success: false, message: 'ID Pesanan tidak valid.' };
  }

  let updatedOrderData: OrderData | undefined = undefined;

  updateLocalOrderStatus(cleanId, status);
  const localOrders = getLocalOrders();
  updatedOrderData = localOrders.find(o => o.orderId.toUpperCase() === cleanId);

  if (UPDATE_ORDER_WEBHOOK && UPDATE_ORDER_WEBHOOK.startsWith('http')) {
    try {
      const response = await fetch(UPDATE_ORDER_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: cleanId,
          "Id-Pemesanan": cleanId,
          status: status,
          "Status": status,
        }),
      });

      if (response.ok) {
        const resData = await response.json().catch(() => null);
        if (resData && (resData.order || resData.data || (Array.isArray(resData) && resData[0]))) {
          const rawObj = resData.order || resData.data || (Array.isArray(resData) ? resData[0] : resData);
          const freshData = normalizeOrderData(rawObj, updatedOrderData);
          saveLocalOrder(freshData);
          updatedOrderData = freshData;
        }

        return {
          success: true,
          message: `Status pesanan ${cleanId} berhasil diperbarui menjadi "${status}" di Google Sheets via Workflow 3 n8n.`,
          data: updatedOrderData
        };
      }
    } catch (error) {
      console.warn('[n8n POST Update Status] n8n error, status updated locally', error);
    }
  }

  return {
    success: true,
    message: `Status pesanan ${cleanId} berhasil diperbarui menjadi "${status}".`,
    data: updatedOrderData
  };
}

/**
 * 4. FETCH ALL ADMIN ORDERS DIRECTLY FROM N8N / GOOGLE SHEETS
 */
export async function fetchAdminOrdersFromN8n(): Promise<OrderData[]> {
  if (TRACK_ORDER_WEBHOOK && TRACK_ORDER_WEBHOOK.startsWith('http')) {
    // 1. Attempt GET request
    try {
      const response = await fetch(TRACK_ORDER_WEBHOOK, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const resData = await response.json().catch(() => null);
        let list: any[] = [];
        if (Array.isArray(resData)) {
          list = resData;
        } else if (resData && Array.isArray(resData.data)) {
          list = resData.data;
        } else if (resData && Array.isArray(resData.orders)) {
          list = resData.orders;
        } else if (resData && typeof resData === 'object' && (resData['Id-Pemesanan'] || resData.orderId)) {
          list = [resData];
        }

        if (list.length > 0) {
          const normalizedList = list
            .map(item => normalizeOrderData(item))
            .filter(o => o.orderId && o.orderId !== 'CF-UNKNOWN');

          if (normalizedList.length > 0) {
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalizedList));
            }
            return normalizedList;
          }
        }
      }
    } catch (err) {
      console.warn('[n8n Admin Orders GET] Failed', err);
    }

    // 2. Attempt POST request if GET returns 0 items
    try {
      const response = await fetch(TRACK_ORDER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 'all' }),
      });

      if (response.ok) {
        const resData = await response.json().catch(() => null);
        let list: any[] = [];
        if (Array.isArray(resData)) {
          list = resData;
        } else if (resData && Array.isArray(resData.data)) {
          list = resData.data;
        } else if (resData && Array.isArray(resData.orders)) {
          list = resData.orders;
        } else if (resData && typeof resData === 'object' && (resData['Id-Pemesanan'] || resData.orderId)) {
          list = [resData];
        }

        if (list.length > 0) {
          const normalizedList = list
            .map(item => normalizeOrderData(item))
            .filter(o => o.orderId && o.orderId !== 'CF-UNKNOWN');

          if (normalizedList.length > 0) {
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalizedList));
            }
            return normalizedList;
          }
        }
      }
    } catch (err) {
      console.warn('[n8n Admin Orders POST] Failed', err);
    }
  }

  // Filter local storage orders to exclude old demo IDs (CF-20260906-325, CF-20260906-605)
  const localOrders = getLocalOrders().filter(o =>
    o.orderId !== 'CF-20260906-325' && o.orderId !== 'CF-20260906-605'
  );
  return localOrders;
}
