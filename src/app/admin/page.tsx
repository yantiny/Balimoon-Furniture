'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderData, AdminStatsSummary, OrderStatus } from '../../types/furniture';
import { formatIDR } from '../../utils/pricing';
import { ChairLogo } from '../../components/ui/ChairLogo';
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
  FileText
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

  useEffect(() => {
    checkAuthAndFetchData();
  }, [selectedStatus]);

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
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">Siap Dikirim</span>;
      case 'DIKIRIM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">Dalam Pengiriman</span>;
      case 'SELESAI':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Selesai</span>;
      case 'DIBATALKAN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Dibatalkan</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-cream-100/60 pb-16">
      
      {/* Admin Navbar Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-warm-border/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wood text-white flex items-center justify-center p-1 shadow-sm">
              <ChairLogo className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-charcoal-900 leading-none">
                BALI MOON FURNITURE
              </h1>
              <span className="text-[11px] font-mono text-wood-medium font-semibold">
                Admin Dashboard Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-medium text-warm-gray bg-cream-100 px-3 py-1.5 rounded-full border border-warm-border">
              Logged in: <strong className="text-charcoal-900">{adminEmail}</strong>
            </span>

            <button
              onClick={checkAuthAndFetchData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-cream-100 text-charcoal-800 hover:bg-cream-200 transition-colors border border-warm-border text-xs flex items-center gap-1.5 font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 text-wood-medium ${loading ? 'animate-spin' : ''}`} />
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
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">MANAJEMEN PESANAN</span>
            <h2 className="text-3xl font-serif font-bold text-charcoal-900">
              Ringkasan & Daftar Pesanan Mebel
            </h2>
          </div>

          <div className="text-xs text-warm-gray">
            Real-time Database Connection: <strong className="text-emerald-700">Terhubung</strong>
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
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold uppercase tracking-wider">SELESAI</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-mono font-extrabold text-emerald-900">
              {stats.completedOrders}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">Pesanan telah diselesaikan</p>
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
              {STATUS_OPTIONS.map(opt => (
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
                          <Phone className="w-3 h-3 text-emerald-600" />
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
                          <span className="font-serif font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
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

      </main>

    </div>
  );
}
