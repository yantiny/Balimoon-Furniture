'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderData, AdminStatsSummary, OrderStatus } from '../../types/furniture';
import { formatIDR } from '../../utils/pricing';
import { Testimonial } from '../../types/testimonial';
import {
  fetchAllTestimonials,
  deleteTestimonial,
  onTestimonialUpdate,
} from '../../services/testimonialService';
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Clock,
  Hammer,
  CheckCircle2,
  AlertCircle,
  Eye,
  Phone,
  Calendar,
  ChevronRight,
  TrendingUp,
  Loader2,
  FileText,
  MessageSquareHeart,
  Star,
  Trash2,
  ExternalLink,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'SUBMITTED', label: 'Menunggu Konfirmasi (SUBMITTED)' },
  { value: 'DIPROSES', label: 'Diproses' },
  { value: 'PRODUKSI', label: 'Dalam Produksi' },
  { value: 'FINISHING', label: 'Proses Finishing' },
  { value: 'SIAP DIKIRIM', label: 'Siap Dikirim' },
  { value: 'DIKIRIM', label: 'Dalam Pengiriman' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'DIBATALKAN', label: 'Dibatalkan' },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'testimonials'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [stats, setStats] = useState<AdminStatsSummary>({
    totalOrders: 0,
    submittedOrders: 0,
    inProductionOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [adminEmail, setAdminEmail] = useState('');

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [testiSearchQuery, setTestiSearchQuery] = useState('');
  const [testiRatingFilter, setTestiRatingFilter] = useState<'ALL' | '5' | '4' | '3_BELOW'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check auth and fetch orders
  const checkAuthAndFetchData = async () => {
    setLoading(true);
    try {
      // Verify admin session
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

      setAdminEmail(meData.user?.email || 'Admin');
      setIsAuthVerified(true);

      // Fetch admin orders
      const ordersRes = await fetch(`/api/orders?q=${encodeURIComponent(searchQuery)}&status=${encodeURIComponent(selectedStatus)}`);
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (data.success) {
          setOrders(data.orders || []);
          setStats(data.stats || {
            totalOrders: 0,
            submittedOrders: 0,
            inProductionOrders: 0,
            completedOrders: 0,
          });
        }
      }
    } catch (err) {
      console.error('Fetch admin orders failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Testimonials
  const loadTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const items = await fetchAllTestimonials();
      setTestimonials(items);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    checkAuthAndFetchData();
    loadTestimonials();

    // Subscribe to realtime testimonial updates (insert/delete)
    const unsubscribe = onTestimonialUpdate(() => {
      loadTestimonials();
    });

    return () => {
      unsubscribe();
    };
  }, [selectedStatus]);

  // Handle Delete Testimonial
  const handleConfirmDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    const target = testimonialToDelete;
    setDeletingId(target.id);
    try {
      const res = await deleteTestimonial(target.id);
      if (res.success) {
        setTestimonials((prev) => prev.filter((item) => item.id !== target.id));
        showToast(`Testimoni dari "${target.nama}" berhasil dihapus.`);
        setTestimonialToDelete(null);
      } else {
        alert(res.message || 'Gagal menghapus testimoni');
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert('Terjadi kesalahan saat menghapus testimoni.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthVerified) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-wood-medium animate-spin" />
        <p className="text-xs font-bold text-charcoal-800">Memverifikasi Akses Admin...</p>
      </div>
    );
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAuthAndFetchData();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Menunggu Konfirmasi</span>;
      case 'DIPROSES':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Diproses</span>;
      case 'PRODUKSI':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">Dalam Produksi</span>;
      case 'FINISHING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">Proses Finishing</span>;
      case 'SIAP DIKIRIM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-wood-light/20 text-wood-dark border border-wood-light/40">Siap Dikirim</span>;
      case 'DIKIRIM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">Dalam Pengiriman</span>;
      case 'SELESAI':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-wood/20 text-wood-dark border border-wood/30">Selesai</span>;
      case 'DIBATALKAN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Dibatalkan</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Filtered testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    const query = testiSearchQuery.toLowerCase();
    const matchQuery =
      t.nama.toLowerCase().includes(query) ||
      t.produk_nama.toLowerCase().includes(query) ||
      t.komentar.toLowerCase().includes(query) ||
      (t.kota && t.kota.toLowerCase().includes(query));

    if (!matchQuery) return false;

    if (testiRatingFilter === '5') return t.rating === 5;
    if (testiRatingFilter === '4') return t.rating === 4;
    if (testiRatingFilter === '3_BELOW') return t.rating <= 3;

    return true;
  });

  // Calculate testimonial stats
  const totalTesti = testimonials.length;
  const avgRating = totalTesti > 0
    ? (testimonials.reduce((sum, item) => sum + item.rating, 0) / totalTesti).toFixed(1)
    : '0.0';
  const fiveStarCount = testimonials.filter((t) => t.rating === 5).length;
  const fourStarCount = testimonials.filter((t) => t.rating === 4).length;

  return (
    <div className="min-h-screen bg-cream-100/60 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-warm-border text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-wood-light" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sub Header */}
      <header className="sticky top-20 z-40 bg-white border-b border-warm-border/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-xl bg-wood/10 text-wood-dark border border-wood/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-wood animate-pulse" />
              <span>Admin Dashboard Control Panel</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-medium text-warm-gray bg-cream-100 px-3 py-1.5 rounded-full border border-warm-border">
              Logged in: <strong className="text-charcoal-900">{adminEmail}</strong>
            </span>

            <button
              onClick={() => {
                checkAuthAndFetchData();
                loadTestimonials();
              }}
              disabled={loading || loadingTestimonials}
              className="p-2.5 rounded-xl bg-cream-100 text-charcoal-800 hover:bg-cream-200 transition-colors border border-warm-border text-xs flex items-center gap-1.5 font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 text-wood-medium ${loading || loadingTestimonials ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 border-t border-warm-border/50">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-wood text-wood font-extrabold'
                : 'border-transparent text-warm-gray hover:text-charcoal-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Daftar Pesanan</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'orders' ? 'bg-wood/15 text-wood-dark' : 'bg-cream-200 text-warm-gray'
            }`}>
              {stats.totalOrders}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'testimonials'
                ? 'border-wood text-wood font-extrabold'
                : 'border-transparent text-warm-gray hover:text-charcoal-900'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Kelola Testimoni</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'testimonials' ? 'bg-wood/15 text-wood-dark' : 'bg-cream-200 text-warm-gray'
            }`}>
              {totalTesti}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ========================================================= */}
        {/* TAB 1: ORDERS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <>
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">MANAJEMEN PESANAN</span>
                <h2 className="text-3xl font-serif font-bold text-charcoal-900">
                  Ringkasan & Daftar Pesanan Mebel
                </h2>
              </div>

              <div className="text-xs text-warm-gray">
                Real-time Database Connection: <strong className="text-wood">Terhubung</strong>
              </div>
            </div>

            {/* STATISTICAL SUMMARY CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Orders Card */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-warm-gray">
                  <span className="text-xs font-bold uppercase tracking-wider">TOTAL PESANAN</span>
                  <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-900 border border-warm-border">
                    <Package className="w-5 h-5 text-wood-medium" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-charcoal-900">
                  {stats.totalOrders}
                </div>
                <p className="text-[11px] text-warm-gray">Keseluruhan pesanan terdaftar</p>
              </div>

              {/* New / Submitted Orders Card */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-amber-700">
                  <span className="text-xs font-bold uppercase tracking-wider">PESANAN BARU</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-amber-900">
                  {stats.submittedOrders}
                </div>
                <p className="text-[11px] text-amber-700 font-medium">Menunggu konfirmasi admin</p>
              </div>

              {/* In Production Card */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-indigo-700">
                  <span className="text-xs font-bold uppercase tracking-wider">DALAM PRODUKSI</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 border border-indigo-200">
                    <Hammer className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-indigo-900">
                  {stats.inProductionOrders}
                </div>
                <p className="text-[11px] text-indigo-700 font-medium">Sedang dalam proses pengerjaan</p>
              </div>

              {/* Completed Orders Card */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-wood-dark">
                  <span className="text-xs font-bold uppercase tracking-wider">SELESAI</span>
                  <div className="w-9 h-9 rounded-xl bg-wood/10 flex items-center justify-center text-wood-dark border border-wood/20">
                    <CheckCircle2 className="w-5 h-5 text-wood-medium" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-charcoal-900">
                  {stats.completedOrders}
                </div>
                <p className="text-[11px] text-wood-dark font-medium">Pesanan telah diselesaikan</p>
              </div>

            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="bg-white p-4 rounded-2xl border border-warm-border/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
              
              <form onSubmit={handleSearchSubmit} className="w-full md:w-1/2 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kode pesanan, nama pelanggan, produk..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-charcoal-900 text-white font-semibold text-xs hover:bg-wood transition-colors shadow-xs"
                >
                  Cari
                </button>
              </form>

              <div className="w-full md:w-auto flex items-center gap-2">
                <Filter className="w-4 h-4 text-wood-medium shrink-0" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full md:w-auto px-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* ORDERS TABLE */}
            <div className="bg-white rounded-3xl border border-warm-border/80 shadow-soft overflow-hidden">
              
              {loading ? (
                <div className="p-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-wood-medium animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-charcoal-800">Memuat data pesanan dari database...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <FileText className="w-10 h-10 text-warm-gray mx-auto" />
                  <h3 className="font-serif font-bold text-base text-charcoal-900">Belum Ada Pesanan Ditemukan</h3>
                  <p className="text-xs text-warm-gray max-w-sm mx-auto">
                    Tidak ada data pesanan yang sesuai dengan kata kunci pencarian atau filter status yang Anda pilih.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-charcoal-800">
                    <thead className="bg-cream-100/80 border-b border-warm-border text-[11px] font-bold uppercase tracking-wider text-warm-gray">
                      <tr>
                        <th className="py-4 px-6">Kode Pesanan</th>
                        <th className="py-4 px-6">Pelanggan</th>
                        <th className="py-4 px-6">Produk & Ukuran</th>
                        <th className="py-4 px-6">Tanggal</th>
                        <th className="py-4 px-6">Harga Estimasi</th>
                        <th className="py-4 px-6">Harga Final</th>
                        <th className="py-4 px-6">Status Pengerjaan</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-border/60">
                      {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-cream-50/80 transition-colors">
                          
                          <td className="py-4 px-6 font-mono font-extrabold text-charcoal-900">
                            {order.orderId}
                          </td>

                          <td className="py-4 px-6">
                            <div className="font-bold text-charcoal-900">{order.customerName}</div>
                            <div className="text-[11px] text-warm-gray flex items-center gap-1">
                              <Phone className="w-3 h-3 text-wood-medium" />
                              <span>{order.whatsapp}</span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="font-bold text-charcoal-900">{order.productName}</div>
                            <div className="text-[11px] text-warm-gray font-mono">
                              {order.length} x {order.width} x {order.height} cm
                            </div>
                          </td>

                          <td className="py-4 px-6 text-warm-gray font-medium">
                            {order.date}
                          </td>

                          <td className="py-4 px-6 font-serif font-semibold text-charcoal-900">
                            {formatIDR(order.estimatedPrice)}
                          </td>

                          <td className="py-4 px-6">
                            {order.finalPrice ? (
                              <span className="font-serif font-extrabold text-wood-dark bg-cream-200/80 px-2.5 py-1 rounded-lg border border-wood/20">
                                {formatIDR(order.finalPrice)}
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                                Belum Ditetapkan
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6">
                            {getStatusBadge(order.status)}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <Link
                              href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-900 hover:bg-wood text-white font-semibold text-xs transition-colors shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>Detail</span>
                            </Link>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TESTIMONIALS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'testimonials' && (
          <>
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">MANAJEMEN TESTIMONI</span>
                <h2 className="text-3xl font-serif font-bold text-charcoal-900">
                  Moderasi & Hapus Testimoni Pelanggan
                </h2>
                <p className="text-xs text-warm-gray mt-1">
                  Kelola seluruh ulasan yang masuk. Testimoni yang dihapus akan langsung hilang dari landing page dan halaman testimoni secara realtime.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/testimoni"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-cream-100 text-charcoal-900 border border-warm-border text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-wood-medium" />
                  <span>Lihat Halaman Publik</span>
                </Link>
              </div>
            </div>

            {/* Testimonials Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Reviews */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-warm-gray">
                  <span className="text-xs font-bold uppercase tracking-wider">TOTAL ULASAN</span>
                  <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-900 border border-warm-border">
                    <MessageSquareHeart className="w-5 h-5 text-wood-medium" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-charcoal-900">
                  {totalTesti}
                </div>
                <p className="text-[11px] text-warm-gray">Ulasan tersimpan di database</p>
              </div>

              {/* Average Rating */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-xs font-bold uppercase tracking-wider">RATA-RATA RATING</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-amber-900 flex items-baseline gap-1.5">
                  {avgRating} <span className="text-xs font-normal text-warm-gray">/ 5.0</span>
                </div>
                <p className="text-[11px] text-amber-700 font-medium">Tingkat kepuasan pelanggan</p>
              </div>

              {/* 5-Star Reviews */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-wood-dark">
                  <span className="text-xs font-bold uppercase tracking-wider">BINTANG 5</span>
                  <div className="w-9 h-9 rounded-xl bg-wood/10 flex items-center justify-center text-wood-dark border border-wood/20">
                    <Sparkles className="w-5 h-5 text-wood-medium" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-charcoal-900">
                  {fiveStarCount}
                </div>
                <p className="text-[11px] text-wood-dark font-medium">Ulasan sempurna ({totalTesti > 0 ? Math.round((fiveStarCount / totalTesti) * 100) : 0}%)</p>
              </div>

              {/* 4-Star Reviews */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-charcoal-800">
                  <span className="text-xs font-bold uppercase tracking-wider">BINTANG 4</span>
                  <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-800 border border-warm-border">
                    <Star className="w-5 h-5 fill-amber-300 text-amber-500" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-charcoal-900">
                  {fourStarCount}
                </div>
                <p className="text-[11px] text-warm-gray">Ulasan sangat baik</p>
              </div>

            </div>

            {/* Testimonials Filter & Search */}
            <div className="bg-white p-4 rounded-2xl border border-warm-border/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-1/2">
                <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={testiSearchQuery}
                  onChange={(e) => setTestiSearchQuery(e.target.value)}
                  placeholder="Cari nama pengirim, nama produk, isi ulasan, atau kota..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                />
              </div>

              <div className="w-full md:w-auto flex items-center gap-2">
                <Filter className="w-4 h-4 text-wood-medium shrink-0" />
                <select
                  value={testiRatingFilter}
                  onChange={(e) => setTestiRatingFilter(e.target.value as any)}
                  className="w-full md:w-auto px-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                >
                  <option value="ALL">Semua Rating</option>
                  <option value="5">Bintang 5 Saja</option>
                  <option value="4">Bintang 4 Saja</option>
                  <option value="3_BELOW">Bintang 3 ke Bawah</option>
                </select>
              </div>
            </div>

            {/* Testimonials Table / List */}
            <div className="bg-white rounded-3xl border border-warm-border/80 shadow-soft overflow-hidden">
              {loadingTestimonials ? (
                <div className="p-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-wood-medium animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-charcoal-800">Memuat data testimoni...</p>
                </div>
              ) : filteredTestimonials.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <MessageSquareHeart className="w-10 h-10 text-warm-gray mx-auto" />
                  <h3 className="font-serif font-bold text-base text-charcoal-900">Belum Ada Testimoni</h3>
                  <p className="text-xs text-warm-gray max-w-sm mx-auto">
                    {testiSearchQuery
                      ? 'Tidak ditemukan ulasan yang cocok dengan pencarian Anda.'
                      : 'Belum ada ulasan pelanggan yang masuk saat ini.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-charcoal-800">
                    <thead className="bg-cream-100/80 border-b border-warm-border text-[11px] font-bold uppercase tracking-wider text-warm-gray">
                      <tr>
                        <th className="py-4 px-6">Pelanggan</th>
                        <th className="py-4 px-6">Produk Mebel</th>
                        <th className="py-4 px-6">Rating</th>
                        <th className="py-4 px-6">Ulasan / Komentar</th>
                        <th className="py-4 px-6">Tanggal</th>
                        <th className="py-4 px-6 text-center">Aksi Moderasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-border/60">
                      {filteredTestimonials.map((t) => (
                        <tr key={t.id} className="hover:bg-cream-50/80 transition-colors">
                          {/* Customer */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-wood/15 text-wood-dark font-serif font-bold flex items-center justify-center shrink-0 border border-warm-border">
                                {t.nama ? t.nama.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="font-bold text-charcoal-900">{t.nama}</div>
                                {t.kota && (
                                  <div className="text-[11px] text-warm-gray flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-wood-medium" />
                                    <span>{t.kota}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Product */}
                          <td className="py-4 px-6">
                            <span className="font-bold text-charcoal-900 bg-cream-100 px-2.5 py-1 rounded-lg border border-warm-border/80">
                              {t.produk_nama}
                            </span>
                          </td>

                          {/* Rating */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < t.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-[11px] font-bold text-charcoal-800">
                                ({t.rating})
                              </span>
                            </div>
                          </td>

                          {/* Comment */}
                          <td className="py-4 px-6 max-w-md">
                            <p className="line-clamp-3 text-charcoal-700 italic">
                              "{t.komentar}"
                            </p>
                          </td>

                          {/* Date */}
                          <td className="py-4 px-6 text-warm-gray whitespace-nowrap">
                            {t.created_at ? new Date(t.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '-'}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <button
                              onClick={() => setTestimonialToDelete(t)}
                              disabled={deletingId === t.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors font-bold text-xs shadow-xs"
                              title="Hapus ulasan ini"
                            >
                              {deletingId === t.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              <span>Hapus</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </main>

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {testimonialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-warm-border space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal-900 leading-tight">
                    Hapus Testimoni
                  </h3>
                  <span className="text-[11px] text-warm-gray">Konfirmasi tindakan moderasi</span>
                </div>
              </div>
              <button
                onClick={() => setTestimonialToDelete(null)}
                className="w-8 h-8 rounded-full hover:bg-cream-100 flex items-center justify-center text-warm-gray hover:text-charcoal-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Apakah Anda yakin ingin menghapus ulasan dari <strong>{testimonialToDelete.nama}</strong> untuk produk <strong>{testimonialToDelete.produk_nama}</strong>?
              </p>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-warm-border/80 text-xs italic text-charcoal-800 space-y-1">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < testimonialToDelete.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p>"{testimonialToDelete.komentar}"</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium">
                Ulasan ini akan dihapus permanen dari database Supabase dan tidak akan tampil lagi di halaman manapun.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTestimonialToDelete(null)}
                disabled={Boolean(deletingId)}
                className="px-4 py-2.5 rounded-xl border border-warm-border text-xs font-semibold text-charcoal-700 hover:bg-cream-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTestimonial}
                disabled={Boolean(deletingId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Testimoni</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
