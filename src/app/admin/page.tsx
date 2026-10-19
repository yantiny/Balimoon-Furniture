'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OrderData, AdminStatsSummary, OrderStatus, Product } from '../../types/furniture';
import { formatIDR } from '../../utils/pricing';
import { formatNumericDate } from '../../utils/date';
import { fetchCatalogProducts, updateCatalogProduct } from '../../services/productService';
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Phone,
  Loader2,
  FileText,
  ExternalLink,
  X,
  Edit3,
  SlidersHorizontal,
  Box,
  Save,
  Check,
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
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [stats, setStats] = useState<AdminStatsSummary>({
    totalOrders: 0,
    submittedOrders: 0,
    inProductionOrders: 0,
    completedOrders: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [adminEmail, setAdminEmail] = useState('');

  // Catalog Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    basePrice: '',
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check auth and fetch orders
  const checkAuthAndFetchData = async () => {
    setLoadingOrders(true);
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
      const ordersRes = await fetch(
        `/api/orders?q=${encodeURIComponent(searchQuery)}&status=${encodeURIComponent(selectedStatus)}`
      );
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (data.success) {
          setOrders(data.orders || []);
          setStats(
            data.stats || {
              totalOrders: 0,
              submittedOrders: 0,
              inProductionOrders: 0,
              completedOrders: 0,
            }
          );
        }
      }
    } catch (err) {
      console.error('Fetch admin orders failed:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load Catalog Products
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const items = await fetchCatalogProducts();
      setProducts(items);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    checkAuthAndFetchData();
    loadProducts();
  }, [selectedStatus]);

  // Handle Search Orders
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAuthAndFetchData();
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditForm({
      name: prod.name,
      description: prod.description,
      basePrice: String(prod.basePrice),
    });
    setProductError(null);
  };

  // Save Edited Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editForm.name.trim()) {
      setProductError('Nama produk tidak boleh kosong.');
      return;
    }

    const priceNum = Number(editForm.basePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setProductError('Harga dasar harus berupa angka positif yang valid.');
      return;
    }

    setSavingProduct(true);
    setProductError(null);

    try {
      const res = await updateCatalogProduct(editingProduct.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        basePrice: priceNum,
      });

      if (res.success) {
        showToast(`Produk "${editForm.name.trim()}" berhasil diperbarui.`);
        setEditingProduct(null);
        await loadProducts();
      } else {
        setProductError(res.message || 'Gagal menyimpan perubahan produk.');
      }
    } catch (err: any) {
      setProductError('Terjadi kesalahan saat menyimpan perubahan produk.');
    } finally {
      setSavingProduct(false);
    }
  };

  // Clean status display without background color and without border
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="font-semibold text-xs text-amber-700 whitespace-nowrap">Menunggu Konfirmasi</span>;
      case 'DIPROSES':
        return <span className="font-semibold text-xs text-blue-700 whitespace-nowrap">Diproses</span>;
      case 'PRODUKSI':
        return <span className="font-semibold text-xs text-purple-700 whitespace-nowrap">Dalam Produksi</span>;
      case 'FINISHING':
        return <span className="font-semibold text-xs text-indigo-700 whitespace-nowrap">Proses Finishing</span>;
      case 'SIAP DIKIRIM':
        return <span className="font-semibold text-xs text-wood-dark whitespace-nowrap">Siap Dikirim</span>;
      case 'DIKIRIM':
        return <span className="font-semibold text-xs text-sky-700 whitespace-nowrap">Dalam Pengiriman</span>;
      case 'SELESAI':
        return <span className="font-semibold text-emerald-700 whitespace-nowrap">Selesai</span>;
      case 'DIBATALKAN':
        return <span className="font-semibold text-xs text-rose-700 whitespace-nowrap">Dibatalkan</span>;
      default:
        return <span className="font-semibold text-xs text-charcoal-700 whitespace-nowrap">{status}</span>;
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = productSearchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  if (!isAuthVerified) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-wood-medium animate-spin" />
        <p className="text-xs font-bold text-charcoal-800">Memverifikasi Akses Admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100/60 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-warm-border text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-wood-light" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header (Sticky Top 0 because main navbar is removed) */}
      <header className="sticky top-0 z-40 bg-white border-b border-warm-border/80 shadow-xs">
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
                loadProducts();
              }}
              disabled={loadingOrders || loadingProducts}
              className="p-2.5 rounded-xl bg-cream-100 text-charcoal-800 hover:bg-cream-200 transition-colors border border-warm-border text-xs flex items-center gap-1.5 font-semibold"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 text-wood-medium ${
                  loadingOrders || loadingProducts ? 'animate-spin' : ''
                }`}
              />
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
          {/* Tab 1: Daftar Pesanan (Bubble removed as requested) */}
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
          </button>

          {/* Tab 2: Katalog Produk (Replacing Testimonials) */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-wood text-wood font-extrabold'
                : 'border-transparent text-warm-gray hover:text-charcoal-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Katalog Produk</span>
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
                <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">
                  MANAJEMEN PESANAN
                </span>
                <h2 className="text-3xl font-serif font-bold text-charcoal-900">
                  Ringkasan & Daftar Pesanan Mebel
                </h2>
              </div>

              <div className="text-xs text-warm-gray">
                Real-time Database Connection: <strong className="text-wood">Terhubung</strong>
              </div>
            </div>

            {/* STATISTICAL SUMMARY CARDS GRID: EXACTLY 3 CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {/* 1. Total Orders Card */}
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

              {/* 2. New / Submitted Orders Card */}
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

              {/* 3. Completed Orders Card */}
              <div className="bg-white p-5 rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-emerald-700">
                  <span className="text-xs font-bold uppercase tracking-wider">PESANAN SELESAI</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-charcoal-900">
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
              {loadingOrders ? (
                <div className="p-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-wood-medium animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-charcoal-800">
                    Memuat data pesanan dari database...
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <FileText className="w-10 h-10 text-warm-gray mx-auto" />
                  <h3 className="font-serif font-bold text-base text-charcoal-900">
                    Belum Ada Pesanan Ditemukan
                  </h3>
                  <p className="text-xs text-warm-gray max-w-sm mx-auto">
                    Tidak ada data pesanan yang sesuai dengan kata kunci pencarian atau filter status yang Anda pilih.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-charcoal-800">
                    <thead className="bg-cream-100/80 border-b border-warm-border text-[11px] font-bold uppercase tracking-wider text-warm-gray">
                      <tr>
                        <th className="py-4 px-6 whitespace-nowrap">Kode Pesanan</th>
                        <th className="py-4 px-6 whitespace-nowrap">Pelanggan</th>
                        <th className="py-4 px-6 whitespace-nowrap">Produk & Ukuran</th>
                        <th className="py-4 px-6 whitespace-nowrap">Tanggal</th>
                        <th className="py-4 px-6 whitespace-nowrap">Harga Estimasi</th>
                        <th className="py-4 px-6 whitespace-nowrap">Harga Final</th>
                        <th className="py-4 px-6 whitespace-nowrap">Status Pengerjaan</th>
                        <th className="py-4 px-6 text-center whitespace-nowrap">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-border/60">
                      {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-cream-50/80 transition-colors">
                          <td className="py-4 px-6 font-mono font-extrabold text-charcoal-900 whitespace-nowrap">
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
                            <div className="text-[11px] text-warm-gray font-mono whitespace-nowrap">
                              {order.length} x {order.width} x {order.height} cm
                            </div>
                          </td>

                          <td className="py-4 px-6 text-warm-gray font-mono font-medium whitespace-nowrap">
                            {formatNumericDate(order.date)}
                          </td>

                          <td className="py-4 px-6 font-serif font-semibold text-charcoal-900 whitespace-nowrap">
                            {formatIDR(order.estimatedPrice)}
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap">
                            {order.finalPrice ? (
                              <span className="font-serif font-bold text-charcoal-900 text-xs">
                                {formatIDR(order.finalPrice)}
                              </span>
                            ) : (
                              <span className="text-xs text-warm-gray font-normal">
                                Belum Ditetapkan
                              </span>
                            )}
                          </td>


                          {/* Clean status column without background color and without border */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>

                          <td className="py-4 px-6 text-center whitespace-nowrap">
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
        {/* TAB 2: CATALOG PRODUCTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'catalog' && (
          <>
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">
                  KATALOG PRODUK MEBEL
                </span>
                <h2 className="text-3xl font-serif font-bold text-charcoal-900">
                  Kelola Nama, Deskripsi & Harga Produk
                </h2>
                <p className="text-xs text-warm-gray mt-1">
                  Ubah data produk di katalog. Perubahan nama, deskripsi, dan harga dasar akan langsung tampil di halaman katalog mebel dan kustomisasi 3D.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/furniture"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-cream-100 text-charcoal-900 border border-warm-border text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-wood-medium" />
                  <span>Lihat Katalog Publik</span>
                </Link>
              </div>
            </div>

            {/* Search Bar for Products */}
            <div className="bg-white p-4 rounded-2xl border border-warm-border/80 shadow-soft flex items-center justify-between gap-4">
              <div className="relative w-full md:w-1/2">
                <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Cari nama produk, deskripsi, atau ID mebel..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                />
              </div>

              <div className="text-xs text-warm-gray font-medium">
                Total Koleksi: <strong className="text-charcoal-900">{filteredProducts.length} Produk</strong>
              </div>
            </div>

            {/* Products List Table / Cards */}
            <div className="bg-white rounded-3xl border border-warm-border/80 shadow-soft overflow-hidden">
              {loadingProducts ? (
                <div className="p-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-wood-medium animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-charcoal-800">Memuat data produk...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Box className="w-10 h-10 text-warm-gray mx-auto" />
                  <h3 className="font-serif font-bold text-base text-charcoal-900">
                    Tidak Ada Produk Ditemukan
                  </h3>
                  <p className="text-xs text-warm-gray max-w-sm mx-auto">
                    {productSearchQuery
                      ? 'Tidak ditemukan produk yang sesuai dengan pencarian Anda.'
                      : 'Belum ada produk terdaftar dalam katalog.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-charcoal-800">
                    <thead className="bg-cream-100/80 border-b border-warm-border text-[11px] font-bold uppercase tracking-wider text-warm-gray">
                      <tr>
                        <th className="py-4 px-6 whitespace-nowrap">Foto Produk</th>
                        <th className="py-4 px-6">Nama & Kategori</th>
                        <th className="py-4 px-6">Harga Dasar (Rp)</th>
                        <th className="py-4 px-6">Deskripsi Produk</th>
                        <th className="py-4 px-6 whitespace-nowrap">Ukuran Default</th>
                        <th className="py-4 px-6 text-center whitespace-nowrap">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-border/60">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-cream-50/80 transition-colors">
                          {/* Image */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="w-16 h-16 rounded-2xl bg-cream-200/60 border border-warm-border overflow-hidden relative flex items-center justify-center">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Box className="w-6 h-6 text-wood-medium" />
                              )}
                            </div>
                          </td>

                          {/* Name & Category */}
                          <td className="py-4 px-6 max-w-xs">
                            <div className="font-bold text-sm text-charcoal-900 leading-snug">
                              {p.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-wood-dark bg-wood/10 px-2 py-0.5 rounded-md border border-wood/20">
                                {p.category === 'living'
                                  ? 'Ruang Tamu & Santai'
                                  : p.category === 'dining'
                                  ? 'Ruang Makan'
                                  : 'Lemari & Rak'}
                              </span>
                              <span className="text-[10px] text-warm-gray font-mono">
                                ID: {p.id}
                              </span>
                            </div>
                          </td>

                          {/* Base Price */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="font-serif font-extrabold text-charcoal-900 text-sm">
                              {formatIDR(p.basePrice)}
                            </span>
                          </td>

                          {/* Description */}
                          <td className="py-4 px-6 max-w-md">
                            <p className="line-clamp-2 text-charcoal-700 leading-relaxed text-xs">
                              {p.description}
                            </p>
                          </td>

                          {/* Default Dimensions */}
                          <td className="py-4 px-6 whitespace-nowrap font-mono text-warm-gray text-xs">
                            {p.length.default} x {p.width.default} x {p.height.default} cm
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-900 hover:bg-wood text-white font-semibold text-xs transition-colors shadow-xs"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Ubah Produk</span>
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
      {/* EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-warm-border space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-wood/10 border border-wood/20 text-wood flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal-900 leading-tight">
                    Ubah Data Produk
                  </h3>
                  <span className="text-[11px] text-warm-gray">ID: {editingProduct.id}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full hover:bg-cream-100 flex items-center justify-center text-warm-gray hover:text-charcoal-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {productError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{productError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-charcoal-900 block">Nama Produk</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Contoh: Meja Rias Minimalis"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-charcoal-900 font-semibold focus:outline-none focus:ring-2 focus:ring-wood-medium text-xs"
                />
              </div>

              {/* Base Price */}
              <div className="space-y-1.5">
                <label className="font-bold text-charcoal-900 block">Harga Dasar (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-warm-gray text-xs">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={editForm.basePrice}
                    onChange={(e) => setEditForm({ ...editForm, basePrice: e.target.value })}
                    placeholder="Contoh: 1800000"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-charcoal-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-wood-medium text-xs"
                  />
                </div>
                {editForm.basePrice && !isNaN(Number(editForm.basePrice)) && (
                  <p className="text-[11px] text-wood-dark font-medium">
                    Preview Format: {formatIDR(Number(editForm.basePrice))}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-charcoal-900 block">Deskripsi Produk</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Tuliskan deskripsi produk yang akan tampil di katalog..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium text-xs leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-warm-border">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  disabled={savingProduct}
                  className="px-4 py-2.5 rounded-xl border border-warm-border text-xs font-semibold text-charcoal-700 hover:bg-cream-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-wood text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {savingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
