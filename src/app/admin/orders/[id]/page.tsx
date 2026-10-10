'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderData, OrderStatus, StatusHistoryItem } from '../../../../types/furniture';
import { formatIDR } from '../../../../utils/pricing';
import { generateWhatsAppChatUrl } from '../../../../utils/whatsapp';
import { ChairLogo } from '../../../../components/ui/ChairLogo';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Ruler,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  MessageSquareText,
  Clock,
  Save,
  Loader2,
  ShieldCheck,
  History,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const STATUS_LIST: { value: OrderStatus; label: string }[] = [
  { value: 'SUBMITTED', label: 'Menunggu Konfirmasi (SUBMITTED)' },
  { value: 'DIPROSES', label: 'Diproses' },
  { value: 'PRODUKSI', label: 'Dalam Produksi' },
  { value: 'FINISHING', label: 'Proses Finishing' },
  { value: 'SIAP DIKIRIM', label: 'Siap Dikirim' },
  { value: 'DIKIRIM', label: 'Dalam Pengiriman' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'DIBATALKAN', label: 'Dibatalkan' },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Controls
  const [finalPriceInput, setFinalPriceInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<OrderStatus>('SUBMITTED');
  const [statusNoteInput, setStatusNoteInput] = useState<string>('');

  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchOrderDetail = async () => {
    if (!orderId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      // Check auth
      const meRes = await fetch('/api/admin/me');
      if (!meRes.ok) {
        router.replace('/admin/login');
        return;
      }
      const meData = await meRes.json();
      if (!meData.authenticated) {
        router.replace('/admin/login');
        return;
      }
      setIsAuthVerified(true);

      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const o: OrderData = data.data;
        setOrder(o);
        setStatusInput(o.status);
        setFinalPriceInput(o.finalPrice !== undefined && o.finalPrice !== null ? String(o.finalPrice) : '');
      } else {
        setErrorMsg(data.message || `Pesanan dengan kode "${orderId}" tidak ditemukan.`);
      }
    } catch (err) {
      console.error('Fetch order detail error:', err);
      setErrorMsg('Gagal memuat detail pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  if (!isAuthVerified) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-wood-medium animate-spin" />
        <p className="text-xs font-bold text-charcoal-800">Memverifikasi Akses Admin...</p>
      </div>
    );
  }

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (finalPriceInput.trim()) {
      const parsed = Number(finalPriceInput);
      if (isNaN(parsed) || parsed < 0) {
        setErrorMsg('Harga final harus berupa angka positif yang valid.');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const executeSave = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalPrice: finalPriceInput.trim() ? Number(finalPriceInput) : null,
          status: statusInput,
          note: statusNoteInput.trim() || `Pembaruan status ke ${statusInput}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Perubahan berhasil disimpan ke database.');
        setOrder(data.data);
        setStatusNoteInput('');
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.message || 'Gagal menyimpan perubahan.');
      }
    } catch (err) {
      console.error('Save changes error:', err);
      setErrorMsg('Terjadi kesalahan saat menyimpan perubahan ke database.');
    } finally {
      setSaving(false);
    }
  };

  // WhatsApp Link Generator for Customer Contact
  const getWhatsAppContactUrl = () => {
    if (!order) return '#';
    // Clean phone number (strip non-digits, ensure starts with 62)
    let phone = order.whatsapp.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    }

    const priceText = order.finalPrice
      ? formatIDR(order.finalPrice)
      : `${formatIDR(order.estimatedPrice)} (Estimasi)`;

    const message = [
      `Halo Sdr/i ${order.customerName},`,
      ``,
      `Kami dari *Bali Moon Furniture* ingin mengonfirmasi perkembangan pesanan mebel custom Anda:`,
      `📌 *Kode Pesanan*: ${order.orderId}`,
      `🛋️ *Produk*: ${order.productName}`,
      `📐 *Ukuran*: ${order.length} x ${order.width} x ${order.height} cm`,
      `🪵 *Material*: ${order.material}`,
      `🎨 *Finishing*: ${order.finishing}`,
      `💰 *Harga*: ${priceText}`,
      `⚙️ *Status Saat Ini*: *${order.status}*`,
      ``,
      `Jika ada pertanyaan lebih lanjut, silakan hubungi tim kami. Terima kasih!`,
    ].join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-cream-100/60 pb-16">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-warm-border/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-xs font-bold text-charcoal-800 hover:text-wood transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-wood-medium" />
            <span>Kembali ke Dashboard Admin</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-warm-gray">
            <span className="font-mono bg-cream-100 px-2.5 py-1 rounded-full border border-warm-border font-extrabold text-charcoal-900">
              {orderId}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-warm-border/80 text-center space-y-3 shadow-soft">
            <Loader2 className="w-8 h-8 text-wood-medium animate-spin mx-auto" />
            <p className="text-xs font-semibold text-charcoal-800">Memuat rincian pesanan dari database...</p>
          </div>
        )}

        {!loading && errorMsg && !order && (
          <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-red-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>Gagal Memuat Detail Pesanan</span>
            </div>
            <p className="text-xs">{errorMsg}</p>
            <div className="pt-2">
              <Link href="/admin" className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-semibold">
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Title Card */}
            <div className="bg-white p-6 rounded-3xl border border-warm-border/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-warm-gray mb-1">
                  <span>Kode Pesanan:</span>
                  <span className="font-mono font-extrabold text-charcoal-900">{order.orderId}</span>
                  <span>•</span>
                  <span>Tanggal: {order.date}</span>
                </div>
                <h1 className="text-2xl font-serif font-bold text-charcoal-900">
                  {order.productName} — Pelanggan: {order.customerName}
                </h1>
              </div>

              {/* WhatsApp Action Button */}
              <a
                href={getWhatsAppContactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 group shrink-0"
              >
                <MessageSquareText className="w-4 h-4 fill-current text-white" />
                <span>HUBUNGI VIA WHATSAPP</span>
              </a>
            </div>

            {/* Notifications */}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SPLIT GRID SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Customer & Order Details */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* 1. Customer Info Card */}
                <div className="bg-white p-6 rounded-3xl border border-warm-border/80 shadow-soft space-y-4">
                  <h3 className="font-serif font-bold text-lg text-charcoal-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-wood-medium" />
                    <span>Informasi Pelanggan</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-cream-50 rounded-xl border border-warm-border/60 flex items-center justify-between">
                      <span className="text-warm-gray font-medium">Nama Lengkap</span>
                      <span className="font-bold text-charcoal-900 text-sm">{order.customerName}</span>
                    </div>

                    <div className="p-3 bg-cream-50 rounded-xl border border-warm-border/60 flex items-center justify-between">
                      <span className="text-warm-gray font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </span>
                      <span className="font-mono font-bold text-charcoal-900">{order.whatsapp}</span>
                    </div>

                    <div className="p-3 bg-cream-50 rounded-xl border border-warm-border/60 flex items-center justify-between">
                      <span className="text-warm-gray font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-wood-medium" />
                        <span>Email</span>
                      </span>
                      <span className="font-semibold text-charcoal-900">{order.email}</span>
                    </div>

                    <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1">
                      <span className="text-warm-gray font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-wood-medium" />
                        <span>Alamat Pengiriman</span>
                      </span>
                      <p className="font-semibold text-charcoal-900 leading-relaxed text-xs">
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Furniture Customization Details Card */}
                <div className="bg-white p-6 rounded-3xl border border-warm-border/80 shadow-soft space-y-4">
                  <h3 className="font-serif font-bold text-lg text-charcoal-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-wood-medium" />
                    <span>Spesifikasi Mebel Custom</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                      <span className="text-warm-gray block text-[11px]">Nama Produk</span>
                      <span className="font-bold text-charcoal-900 text-sm mt-0.5 block">{order.productName}</span>
                    </div>

                    <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                      <span className="text-warm-gray block text-[11px]">Dimensi Custom (P x L x T)</span>
                      <span className="font-mono font-bold text-charcoal-900 text-sm mt-0.5 block">
                        {order.length} x {order.width} x {order.height} cm
                      </span>
                    </div>

                    <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                      <span className="text-warm-gray block text-[11px]">Bahan Kayu</span>
                      <span className="font-bold text-charcoal-900 text-sm mt-0.5 block">{order.material}</span>
                    </div>

                    <div className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60">
                      <span className="text-warm-gray block text-[11px]">Finishing</span>
                      <span className="font-bold text-charcoal-900 text-sm mt-0.5 block">{order.finishing}</span>
                    </div>
                  </div>

                  {order.additionalRequest && order.additionalRequest !== '-' && (
                    <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-amber-900 block flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Catatan Khusus Pelanggan:</span>
                      </span>
                      <p className="text-amber-950 italic leading-relaxed">{order.additionalRequest}</p>
                    </div>
                  )}
                </div>

                {/* 3. Status Audit History */}
                <div className="bg-white p-6 rounded-3xl border border-warm-border/80 shadow-soft space-y-4">
                  <h3 className="font-serif font-bold text-lg text-charcoal-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-wood-medium" />
                    <span>Riwayat Perubahan Status</span>
                  </h3>

                  {(!order.statusHistory || order.statusHistory.length === 0) ? (
                    <p className="text-xs text-warm-gray italic">Belum ada catatan riwayat perubahan status.</p>
                  ) : (
                    <div className="space-y-3">
                      {order.statusHistory.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-cream-50 rounded-xl border border-warm-border/60 space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold text-charcoal-900">
                            <span className="uppercase text-wood-dark">{item.status_baru}</span>
                            <span className="text-[11px] font-mono font-normal text-warm-gray">
                              {new Date(item.created_at).toLocaleString('id-ID')}
                            </span>
                          </div>
                          {item.status_lama && (
                            <div className="text-[11px] text-warm-gray">
                              Status Sebelumnya: {item.status_lama}
                            </div>
                          )}
                          {item.catatan && (
                            <p className="text-charcoal-800 italic bg-white p-2 rounded border border-warm-border/40 mt-1">
                              "{item.catatan}"
                            </p>
                          )}
                          <div className="text-[10px] text-warm-gray pt-1">
                            Diperbarui oleh: {item.dibuat_oleh || 'Admin'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Admin Price & Status Control Form */}
              <div className="lg:col-span-6 space-y-6">
                
                <form onSubmit={handleSaveSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border/80 shadow-soft space-y-6">
                  
                  <div className="border-b border-warm-border/60 pb-4">
                    <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">PENGATURAN ADMIN</span>
                    <h3 className="text-xl font-serif font-bold text-charcoal-900">
                      Kelola Harga Final & Status
                    </h3>
                  </div>

                  {/* 1. Price Breakdown Info */}
                  <div className="p-4 bg-cream-100 rounded-2xl border border-warm-border space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-warm-gray font-semibold">Estimasi Harga Sistem:</span>
                      <span className="font-serif font-bold text-charcoal-900 text-sm">
                        {formatIDR(order.estimatedPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-warm-border/60">
                      <span className="text-wood-dark font-bold">Harga Final Saat Ini:</span>
                      <span className="font-serif font-extrabold text-emerald-800 text-base">
                        {order.finalPrice ? formatIDR(order.finalPrice) : 'Belum Ditetapkan'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Final Price Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Input / Perbarui Harga Final (Rp)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-warm-gray">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={finalPriceInput}
                        onChange={(e) => setFinalPriceInput(e.target.value)}
                        placeholder={String(order.estimatedPrice)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream-50 border border-warm-border text-sm font-mono font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                      />
                    </div>
                    <p className="text-[11px] text-warm-gray">
                      Masukkan harga final disepakati setelah peninjauan spesifikasi kayu dan pengiriman.
                    </p>
                  </div>

                  {/* 3. Status Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-wood-medium" />
                      <span>Ubah Status Pengerjaan</span>
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as OrderStatus)}
                      className="w-full p-3.5 rounded-xl bg-cream-50 border border-warm-border text-xs font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                    >
                      {STATUS_LIST.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Status History Note Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-wood-medium" />
                      <span>Catatan Perubahan (Internal / Audit)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={statusNoteInput}
                      onChange={(e) => setStatusNoteInput(e.target.value)}
                      placeholder="Contoh: DP 50% telah diterima, bahan kayu jati mulai dipotong..."
                      className="w-full p-3 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-wood-medium"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 px-6 rounded-2xl bg-charcoal-900 hover:bg-wood text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 text-amber-400" />
                        <span>SIMPAN PERUBAHAN PESANAN</span>
                      </>
                    )}
                  </button>

                </form>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-elevated animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center border border-amber-300">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-xl text-charcoal-900">Konfirmasi Perubahan</h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                Apakah Anda yakin ingin memperbarui harga final menjadi{' '}
                <strong className="text-charcoal-900">
                  {finalPriceInput.trim() ? formatIDR(Number(finalPriceInput)) : 'Tidak diubah'}
                </strong>{' '}
                dan status pesanan menjadi <strong className="text-charcoal-900">{statusInput}</strong>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-3 px-4 rounded-xl bg-cream-100 hover:bg-cream-200 border border-warm-border text-xs font-bold text-charcoal-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeSave}
                className="py-3 px-4 rounded-xl bg-charcoal-900 hover:bg-wood text-white text-xs font-bold transition-colors shadow-sm"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
