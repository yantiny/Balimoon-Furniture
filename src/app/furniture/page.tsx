'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import RobotVerificationModal from '../../components/ui/RobotVerificationModal';
import { STATIC_PRODUCTS } from '../../data/products';
import { Search, Filter, SlidersHorizontal, Box, ShieldCheck, Lock, RotateCcw } from 'lucide-react';

export default function FurnitureCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Verification states
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already verified in this session
    const savedAuth = sessionStorage.getItem('balimoon_catalog_verified');
    if (savedAuth === 'true') {
      setIsVerified(true);
      setShowModal(false);
    } else {
      setIsVerified(false);
      setShowModal(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleVerified = () => {
    setIsVerified(true);
    setShowModal(false);
    sessionStorage.setItem('balimoon_catalog_verified', 'true');
  };

  const handleResetVerification = () => {
    sessionStorage.removeItem('balimoon_catalog_verified');
    setIsVerified(false);
    setShowModal(true);
  };

  const categories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'living', label: 'Ruang Tamu & Santai' },
    { id: 'dining', label: 'Ruang Makan' },
    { id: 'storage', label: 'Lemari & Rak' },
  ];

  const filteredProducts = STATIC_PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-[80vh]">

      {/* Robot Verification Gate Modal */}
      {!isCheckingAuth && (
        <RobotVerificationModal
          isOpen={showModal || !isVerified}
          onVerified={handleVerified}
          title="Verifikasi Akses Katalog Custom"
          description="Selesaikan verifikasi 'Saya bukan robot' di bawah ini untuk melihat koleksi mebel kayu custom Bali Moon Furniture."
        />
      )}

      {/* Main Catalog Content Container with Blur when locked */}
      <div className={`transition-all duration-500 space-y-10 ${!isVerified ? 'filter blur-md select-none pointer-events-none opacity-40' : 'opacity-100'}`}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cream-200 text-wood-dark text-xs font-semibold rounded-full border border-warm-border">
              <Box className="w-3.5 h-3.5" />
              <span>Koleksi Mebel Pesanan Khusus (Made-To-Order)</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-charcoal-900 tracking-tight">
              Katalog Mebel Custom
            </h1>
            <p className="text-warm-gray text-base leading-relaxed">
              Jelajahi berbagai model mebel kayu yang dapat disesuaikan. Klik pada produk untuk mengatur panjang, lebar, dan tinggi dalam tampilan 3D interaktif.
            </p>
          </div>

          {/* Verification Status Banner & Testing Reset Button */}
          {isVerified && (
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-cream-200/80 border border-wood-light/50 rounded-xl text-xs text-wood-dark shadow-sm shrink-0">
              <ShieldCheck className="w-4 h-4 text-wood-medium shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-charcoal-900">Terverifikasi (Bukan Robot)</span>
                <span className="text-[10px] text-wood font-medium">Akses Katalog Terbuka</span>
              </div>
              <button
                onClick={handleResetVerification}
                className="ml-2 p-1.5 hover:bg-wood/10 rounded-lg text-wood-dark transition-colors flex items-center gap-1 text-[11px] font-medium"
                title="Uji ulang verifikasi robot"
              >
                <RotateCcw className="w-3.5 h-3.5 text-wood-medium" />
                <span className="hidden sm:inline">Uji Ulang</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-warm-border/60">

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${selectedCategory === cat.id
                  ? 'bg-wood-medium text-white shadow-sm'
                  : 'bg-white text-charcoal-700 hover:bg-cream-200 border border-warm-border/60'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari model mebel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-warm-border/80 text-sm text-charcoal-900 placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-wood-medium transition-all"
            />
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-warm-border p-8 space-y-3">
            <p className="text-charcoal-800 font-semibold text-lg">Tidak ada model mebel yang ditemukan</p>
            <p className="text-warm-gray text-xs">Coba ubah kata kunci pencarian atau kategori filter Anda.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 px-4 py-2 bg-cream-200 text-charcoal-800 text-xs font-semibold rounded-lg hover:bg-cream-300 transition-colors"
            >
              Hapus Filter
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

