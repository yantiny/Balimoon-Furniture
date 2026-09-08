'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderData } from '../../types/furniture';
import { trackOrderById } from '../../services/n8nService';
import { formatIDR } from '../../utils/pricing';
import { CheckCircle2, Clock, Search, Box, ShieldCheck, Copy, Check, AlertCircle, Loader2, MessageSquareText } from 'lucide-react';
import { generateWhatsAppPaymentUrl } from '../../utils/whatsapp';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || '';

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrderData() {
      if (!orderId) {
        if (isMounted) {
          setLoading(false);
          setErrorMsg('ID Pesanan tidak ditemukan pada URL.');
        }
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const res = await trackOrderById(orderId);
        if (isMounted) {
          if (res.success && res.data) {
            setOrder(res.data);
          } else {
            setErrorMsg(res.message || `Pesanan dengan ID "${orderId}" tidak ditemukan.`);
          }
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        if (isMounted) {
          setErrorMsg('Terjadi kesalahan saat mengambil rincian pesanan dari n8n.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOrderData();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const displayOrderId = order?.orderId || orderId || '';

  const copyOrderId = () => {
    if (navigator.clipboard && displayOrderId) {
      navigator.clipboard.writeText(displayOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const waPaymentUrl = order ? generateWhatsAppPaymentUrl(order) : '#';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">

      {/* Top Success Badge Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-wood/10 text-wood-dark rounded-full flex items-center justify-center mx-auto border border-wood/20 shadow-soft">
          <CheckCircle2 className="w-10 h-10 text-wood-medium" />
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">Pesanan Terkonfirmasi</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
            Permintaan Mebel Custom Anda Berhasil Terkirim
          </h1>
        </div>
        <p className="text-warm-gray text-sm max-w-lg mx-auto">
          Terima kasih telah memilih Balimoon Furniture. Rincian pesanan Anda telah diteruskan ke tim pengrajin kami.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-warm-border/80 shadow-soft text-center space-y-3 animate-pulse">
          <Loader2 className="w-8 h-8 text-wood-medium animate-spin mx-auto" />
          <p className="text-sm font-semibold text-charcoal-800">
            Mengambil data pesanan langsung dari server n8n...
          </p>
          <span className="text-xs text-warm-gray font-mono">{orderId}</span>
        </div>
      )}

      {/* Error State */}
      {!loading && errorMsg && (
        <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-red-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>Gagal Memuat Detail Pesanan</span>
          </div>
          <p className="text-xs text-red-700">{errorMsg}</p>
          <div className="pt-2">
            <Link
              href={`/track?orderId=${encodeURIComponent(orderId)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-semibold hover:bg-red-800 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Coba Lacak di Halaman Tracking</span>
            </Link>
          </div>
        </div>
      )}

      {/* Order Summary Card */}
      {!loading && order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border/80 shadow-soft space-y-6 animate-in fade-in duration-300">

          {/* Order ID Pill */}
          <div className="p-4 bg-cream-100 rounded-2xl border border-warm-border flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-warm-gray block">ID PESANAN</span>
              <span className="text-2xl font-mono font-extrabold text-charcoal-900">{order.orderId}</span>
            </div>

            <button
              onClick={copyOrderId}
              className="px-3.5 py-2 rounded-xl bg-white border border-warm-border text-xs font-semibold text-charcoal-800 hover:border-wood transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-wood-medium" />}
              <span>{copied ? 'Tersalin!' : 'Salin ID'}</span>
            </button>
          </div>

          {/* WhatsApp Payment Callout Card */}
          <div className="p-5 bg-gradient-to-r from-emerald-900 to-green-800 text-white rounded-2xl shadow-md space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-300">LANGKAH SELANJUTNYA</span>
                <h3 className="text-lg font-serif font-bold text-white">Pembayaran & Konfirmasi via WhatsApp</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Silakan hubungi WhatsApp Admin untuk menerima nomor rekening transfer (BCA/Mandiri/QRIS) dan konfirmasi DP produksi.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center shrink-0 border border-emerald-500/40">
                <MessageSquareText className="w-5 h-5 text-emerald-200" />
              </div>
            </div>

            <a
              href={waPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-charcoal-900 font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <MessageSquareText className="w-5 h-5 text-charcoal-900 fill-current" />
              <span>KONFIRMASI & BAYAR VIA WHATSAPP</span>
            </a>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1">
              <span className="text-warm-gray block font-medium">Nama Produk</span>
              <span className="font-bold text-charcoal-900 text-sm">{order.productName}</span>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1">
              <span className="text-warm-gray block font-medium">Ukuran Custom (P x L x T)</span>
              <span className="font-mono font-bold text-charcoal-900 text-sm">
                {order.length} x {order.width} x {order.height} cm
              </span>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1">
              <span className="text-warm-gray block font-medium">Bahan Kayu Pilihan</span>
              <span className="font-semibold text-charcoal-900 text-sm">
                {order.material && order.material !== '-' ? order.material : 'Kayu Jati Solid'}
              </span>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1">
              <span className="text-warm-gray block font-medium">Finishing</span>
              <span className="font-semibold text-wood-dark text-sm">{order.finishing}</span>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1">
              <span className="text-warm-gray block font-medium">Estimasi Waktu Produksi</span>
              <span className="font-bold text-charcoal-900 text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-wood-medium" />
                <span>{order.estimatedProductionTime}</span>
              </span>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1">
              <span className="text-warm-gray block font-medium">STATUS</span>
              <span className="font-bold text-charcoal-900 text-sm uppercase">
                {order.status}
              </span>
            </div>

            <div className="p-4 bg-wood/10 rounded-xl border border-wood/20 space-y-1 md:col-span-2">
              <span className="text-wood-dark font-medium block">
                {order.finalPrice ? 'HARGA FIX / FINAL ADMIN' : 'ESTIMASI HARGA'}
              </span>
              <span className="font-serif font-extrabold text-wood-dark text-lg">
                {order.finalPrice ? formatIDR(order.finalPrice) : formatIDR(order.estimatedPrice)}
              </span>
            </div>
          </div>

          {/* Informational Disclaimer Box */}
          <div className="p-4 bg-cream-200/70 rounded-2xl border border-warm-border text-xs text-charcoal-800 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-charcoal-900 mb-1">Tahap Selanjutnya?</h4>
              <p>
                Permintaan Anda telah kami terima. Tim pengrajin mebel kami akan memeriksa ukuran custom dan rincian teknis sebelum mengonfirmasi harga akhir dan estimasi jadwal pembuatan.
              </p>
            </div>
          </div>

          {/* Secondary Action Buttons */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/track?orderId=${encodeURIComponent(order.orderId)}`}
              className="w-full py-3.5 px-5 rounded-xl bg-charcoal-900 hover:bg-wood text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>CEK STATUS PESANAN</span>
            </Link>

            <Link
              href="/furniture"
              className="w-full py-3.5 px-5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 font-semibold text-sm border border-warm-border transition-all flex items-center justify-center gap-2"
            >
              <Box className="w-4 h-4 text-wood-medium" />
              <span>KEMBALI KE KATALOG</span>
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-warm-gray text-sm">
        Memuat rincian pesanan...
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
