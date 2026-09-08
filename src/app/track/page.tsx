'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackOrderById } from '../../services/n8nService';
import { OrderData } from '../../types/furniture';
import OrderTimeline from '../../components/ui/OrderTimeline';
import { formatIDR } from '../../utils/pricing';
import { Search, Package, Clock, ShieldCheck, AlertCircle, Sparkles, User, Box } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams?.get('orderId') || '';

  const [orderIdInput, setOrderIdInput] = useState<string>(initialOrderId);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim()) {
      setErrorMsg('Harap masukkan ID Pesanan yang valid (contoh: CF-20260903-001).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setOrderData(null);

    try {
      const res = await trackOrderById(orderIdInput);
      if (res.success && res.data) {
        setOrderData(res.data);
      } else {
        setErrorMsg(res.message || 'ID Pesanan tidak ditemukan.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan saat melacak pesanan Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      handleTrack();
    }
  }, [initialOrderId]);



  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cream-200 text-wood-dark text-xs font-semibold rounded-full border border-warm-border">
          <Search className="w-3.5 h-3.5" />
          <span>Pelacakan Status Real-Time</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
          Cek Status Pesanan Custom
        </h1>
        <p className="text-warm-gray text-sm leading-relaxed">
          Masukkan ID Pesanan Anda (contoh: <code className="font-mono bg-cream-200 px-1.5 py-0.5 rounded text-charcoal-900">CF-20260906-281</code>) untuk melihat progres pengerjaan mebel Anda.
        </p>
      </div>

      {/* Track Form Input Bar */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2.5 rounded-2xl border border-warm-border shadow-soft">
          <div className="relative flex-1 w-full">
            <Package className="w-5 h-5 text-warm-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Masukkan ID Pesanan (contoh: CF-20260906-281)"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream-50 border border-warm-border/60 text-sm font-mono uppercase font-bold text-charcoal-900 placeholder:normal-case placeholder:font-sans placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-wood-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-charcoal-900 hover:bg-wood text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mencari...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-400" />
                <span>CEK STATUS</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm mb-0.5">Pesanan Tidak Ditemukan</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Order Tracking Result View */}
      {orderData && (
        <div className="bg-white rounded-3xl border border-warm-border/80 p-6 sm:p-8 shadow-soft space-y-8 animate-in fade-in duration-300">

          {/* Order Header Specs Summary */}
          <div className="p-5 bg-cream-100 rounded-2xl border border-warm-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-warm-gray uppercase font-bold tracking-wider block">ID Referensi Pesanan</span>
              <span className="text-2xl font-mono font-extrabold text-charcoal-900">{orderData.orderId}</span>
              <p className="text-xs text-warm-gray mt-0.5">Produk: <strong className="text-charcoal-900">{orderData.productName}</strong></p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-white font-mono rounded-lg border border-warm-border font-medium">
                {orderData.length} x {orderData.width} x {orderData.height} cm
              </span>
              <span className="px-3 py-1.5 bg-wood/10 text-wood-dark font-semibold rounded-lg border border-wood/20">
                {orderData.material && orderData.material !== '-' ? orderData.material : 'Kayu Jati Solid'}
              </span>
              {orderData.finalPrice ? (
                <div className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg shadow-sm font-serif font-bold text-xs flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-sans tracking-wider bg-emerald-900/60 px-1.5 py-0.5 rounded">HARGA FIX</span>
                  <span>{formatIDR(orderData.finalPrice)}</span>
                </div>
              ) : (
                <div className="px-3.5 py-1.5 bg-charcoal-900 text-white rounded-lg font-serif font-bold text-xs flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-cream-300">Estimasi</span>
                  <span>{formatIDR(orderData.estimatedPrice)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Order Breakdown Card */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-wood-medium" />
              <span>Rincian Spesifikasi Pesanan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block text-[11px] font-medium">Nama Pemesan</span>
                <span className="font-bold text-charcoal-900 text-sm flex items-center gap-1.5 mt-0.5">
                  <User className="w-4 h-4 text-wood-medium shrink-0" />
                  <span>{orderData.customerName}</span>
                </span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block text-[11px] font-medium">Nama Mebel / Barang</span>
                <span className="font-bold text-charcoal-900 text-sm flex items-center gap-1.5 mt-0.5">
                  <Box className="w-4 h-4 text-wood-medium shrink-0" />
                  <span>{orderData.productName}</span>
                </span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block text-[11px] font-medium">Dimensi Custom</span>
                <span className="font-mono font-bold text-charcoal-900 text-sm mt-0.5 block">{orderData.length} x {orderData.width} x {orderData.height} cm</span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block text-[11px] font-medium">Bahan Kayu</span>
                <span className="font-bold text-charcoal-900 text-sm mt-0.5 block">
                  {orderData.material && orderData.material !== '-' ? orderData.material : 'Kayu Jati Solid'}
                </span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block text-[11px] font-medium">Finishing</span>
                <span className="font-bold text-charcoal-900 text-sm mt-0.5 block">{orderData.finishing}</span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block text-[11px] font-medium">Estimasi Harga System</span>
                <span className="font-serif font-bold text-charcoal-900 text-sm mt-0.5 block">{formatIDR(orderData.estimatedPrice)}</span>
              </div>

              <div className={`p-3.5 rounded-xl border ${orderData.finalPrice ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                <span className="block text-[11px] font-semibold">{orderData.finalPrice ? 'Harga Fix / Final Admin' : 'Status Harga Fix'}</span>
                <span className="font-serif font-bold text-sm mt-0.5 block">
                  {orderData.finalPrice ? formatIDR(orderData.finalPrice) : 'Menunggu Peninjauan Admin'}
                </span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block text-[11px] font-medium">Estimasi Produksi</span>
                <span className="font-bold text-charcoal-900 text-sm flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-wood-medium shrink-0" />
                  <span>{orderData.estimatedProductionTime}</span>
                </span>
              </div>
            </div>

            {orderData.additionalRequest && orderData.additionalRequest !== '-' && (
              <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60 text-xs">
                <span className="text-warm-gray block text-[11px] font-semibold">Catatan Khusus Pelanggan</span>
                <span className="text-charcoal-900 italic">{orderData.additionalRequest}</span>
              </div>
            )}
          </div>

          {/* Timeline Component */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-warm-border/60 mb-6">
              <h3 className="font-serif font-bold text-xl text-charcoal-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-wood-medium" />
                <span>Tahapan Progres Produksi</span>
              </h3>
              <span className="text-xs text-warm-gray">Lama Pengerjaan: {orderData.estimatedProductionTime}</span>
            </div>

            <OrderTimeline currentStatus={orderData.status} timelineDates={orderData.timelineDates} />
          </div>

          {/* Verification Notice */}
          <div className="p-4 bg-cream-200/50 rounded-xl border border-warm-border text-[11px] text-warm-gray flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-wood-medium shrink-0" />
            <span>Data rincian spesifikasi pesanan di atas terhubung langsung dengan basis data resmi Balimoon Furniture.</span>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-warm-gray text-sm">
        Memuat sistem pelacakan pesanan...
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
