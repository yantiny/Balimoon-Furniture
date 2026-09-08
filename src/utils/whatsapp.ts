import { OrderData } from '../types/furniture';
import { formatIDR } from './pricing';

/**
 * Returns clean Admin WhatsApp phone number from environment variable or fallback
 */
export function getAdminWANumber(): string {
  const envWa = process.env.NEXT_PUBLIC_ADMIN_WA_NUMBER || '6281234567890';
  // Strip any non-digit characters (+, -, spaces)
  return envWa.replace(/\D/g, '');
}

/**
 * Generates an encoded WhatsApp wa.me direct payment & order confirmation link
 */
export function generateWhatsAppPaymentUrl(order: OrderData): string {
  const adminNumber = getAdminWANumber();
  const priceDisplay = order.finalPrice && order.finalPrice > 0 
    ? formatIDR(order.finalPrice) 
    : `${formatIDR(order.estimatedPrice)} (Estimasi)`;

  const messageLines = [
    `Halo Admin Balimoon Furniture, saya ingin mengonfirmasi & melakukan pembayaran untuk pesanan mebel custom berikut:`,
    ``,
    `📌 *ID Pesanan*: ${order.orderId}`,
    `🛋️ *Produk*: ${order.productName}`,
    `📐 *Ukuran Custom*: ${order.length} x ${order.width} x ${order.height} cm`,
    `🪵 *Bahan Kayu*: ${order.material || 'Kayu Jati Solid'}`,
    `🎨 *Finishing*: ${order.finishing || 'Natural Wood Finish'}`,
    `💰 *Harga*: ${priceDisplay}`,
    order.additionalRequest && order.additionalRequest !== '-' ? `📝 *Catatan Tambahan*: ${order.additionalRequest}` : '',
    ``,
    `👤 *Nama Pemesan*: ${order.customerName || '-'}`,
    `📍 *Alamat Pengiriman*: ${order.address || '-'}`,
    ``,
    `Mohon info nomor rekening / QRIS pembayaran DP untuk memulai proses produksi. Terima kasih!`
  ].filter(line => line !== null && line !== undefined).join('\n');

  return `https://wa.me/${adminNumber}?text=${encodeURIComponent(messageLines)}`;
}
