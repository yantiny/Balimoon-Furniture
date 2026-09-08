'use client';

import React, { useState } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import { STATIC_PRODUCTS } from '../../data/products';
import { Search, Filter, SlidersHorizontal, Box } from 'lucide-react';

export default function FurnitureCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
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

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-warm-border/60">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
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
  );
}
