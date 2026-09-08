'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '../../../data/products';
import { formatIDR } from '../../../utils/pricing';
import { FurnitureCanvas } from '../../../components/3d/FurnitureCanvas';
import { SlidersHorizontal, Clock, Ruler, Sparkles, ArrowLeft, Box } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id as string;
  const product = getProductById(productId);

  // Angle presets for 3D GLB Asset photos
  const ANGLE_PRESETS: Array<{ label: string; name: string; position: [number, number, number] }> = [
    { label: 'Foto 1', name: 'Depan Perspektif', position: [2.0, 1.2, 2.2] },
    { label: 'Foto 2', name: 'Samping Kiri', position: [-2.2, 0.9, 1.6] },
    { label: 'Foto 3', name: 'Tampak Atas', position: [0.2, 2.8, 1.8] }
  ];

  // Active View Index: 0 (Foto 1), 1 (Foto 2), 2 (Foto 3), 3 (Interactive 3D 360)
  const [activeViewIndex, setActiveViewIndex] = useState<number>(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal-900">Produk Tidak Ditemukan</h2>
        <p className="text-warm-gray text-sm">Produk mebel yang Anda cari tidak tersedia di katalog kami.</p>
        <Link
          href="/furniture"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal-900 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const activeAngle = ANGLE_PRESETS[activeViewIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-warm-gray">
        <Link href="/furniture" className="hover:text-charcoal-900 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Katalog Mebel</span>
        </Link>
        <span>/</span>
        <span className="text-charcoal-900 font-medium">{product.name}</span>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Gallery & Interactive 3D Quick View */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Display Container */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-warm-border/80 shadow-soft aspect-[4/3]">
            <FurnitureCanvas
              key={`main-canvas-${activeViewIndex}`}
              modelType={product.modelType}
              modelUrl={product.model3D}
              length={product.length.default}
              width={product.width.default}
              height={product.height.default}
              defaultLength={product.length.default}
              defaultWidth={product.width.default}
              defaultHeight={product.height.default}
              showDimensions={false}
              hideUIControls={activeViewIndex !== 3}
              enableControls={activeViewIndex === 3}
              cameraPosition={activeAngle ? activeAngle.position : [2.0, 1.2, 2.2]}
            />

            {/* View Mode Badge */}
            <div className="absolute top-4 left-4 z-20 bg-charcoal-900/80 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {activeViewIndex === 3 ? 'Model 3D Interaktif (360°)' : `${activeAngle?.label} - ${activeAngle?.name} (Asset 3D GLB)`}
              </span>
            </div>
          </div>

          {/* 3 Photos (3D GLB Angles) + 1 Interactive Preview 3D Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {/* 3 Photos derived from GLB Asset */}
            {ANGLE_PRESETS.map((preset, index) => {
              const isSelected = activeViewIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveViewIndex(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-cream-200 ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/30 opacity-100 scale-105 shadow-md'
                      : 'border-warm-border opacity-80 hover:opacity-100'
                  }`}
                >
                  <FurnitureCanvas
                    modelType={product.modelType}
                    modelUrl={product.model3D}
                    length={product.length.default}
                    width={product.width.default}
                    height={product.height.default}
                    defaultLength={product.length.default}
                    defaultWidth={product.width.default}
                    defaultHeight={product.height.default}
                    showDimensions={false}
                    hideUIControls={true}
                    enableControls={false}
                    cameraPosition={preset.position}
                  />
                  <span className="absolute bottom-1 left-1 z-10 bg-charcoal-900/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow">
                    {preset.label}
                  </span>
                </button>
              );
            })}

            {/* 4th Thumbnail: Interactive PREVIEW 3D */}
            <button
              onClick={() => setActiveViewIndex(3)}
              className={`relative aspect-square rounded-xl border-2 transition-all shrink-0 flex flex-col items-center justify-center gap-1 bg-cream-200 text-charcoal-900 ${
                activeViewIndex === 3
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 font-bold scale-105 shadow-md'
                  : 'border-warm-border hover:bg-cream-300'
              }`}
            >
              <Box className="w-6 h-6 text-amber-600 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900">PREVIEW 3D</span>
            </button>
          </div>

        </div>

        {/* Right Column: Specs, Dimensions, & Action CTA */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-wood-dark text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-wood-medium" />
              <span>Pesanan Khusus (Made To Order)</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
              {product.name}
            </h1>
            
            <p className="text-warm-gray text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 bg-white rounded-2xl border border-warm-border/80 shadow-soft space-y-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-warm-gray">Harga Acuan Awal</div>
            <div className="text-3xl font-serif font-extrabold text-wood-dark">
              {formatIDR(product.basePrice)}
            </div>
            <p className="text-[11px] text-warm-gray">
              * Estimasi harga akhir akan menyesuaikan dengan ukuran Panjang, Lebar, dan Tinggi custom Anda.
            </p>
          </div>

          {/* Product Specifications */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-900">Spesifikasi Teknis</h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-cream-100 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block mb-1">Material Utama</span>
                <span className="font-bold text-charcoal-900">{product.material}</span>
              </div>

              <div className="p-3.5 bg-cream-100 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block mb-1">Finishing Standar</span>
                <span className="font-bold text-charcoal-900">{product.finishing}</span>
              </div>

              <div className="p-3.5 bg-cream-100 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block mb-1">Estimasi Produksi</span>
                <span className="font-bold text-charcoal-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-wood-medium" />
                  <span>{product.productionTime}</span>
                </span>
              </div>

              <div className="p-3.5 bg-cream-100 rounded-xl border border-warm-border/60">
                <span className="text-warm-gray block mb-1">Pilihan Warna</span>
                <span className="font-semibold text-wood-dark">Serat Alami Kayu</span>
              </div>
            </div>
          </div>

          {/* Dimension Ranges Badge Table */}
          <div className="p-5 bg-cream-200/60 rounded-2xl border border-warm-border/80 space-y-3">
            <div className="flex items-center gap-2 text-charcoal-900 font-serif font-bold text-sm">
              <Ruler className="w-4 h-4 text-wood-medium" />
              <span>Batas Ukuran Kustomisasi</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-warm-border">
                <span className="text-[10px] text-warm-gray block uppercase font-bold">Panjang (P)</span>
                <span className="font-mono font-medium text-charcoal-900">{product.length.min} - {product.length.max} cm</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-warm-border">
                <span className="text-[10px] text-warm-gray block uppercase font-bold">Lebar (L)</span>
                <span className="font-mono font-medium text-charcoal-900">{product.width.min} - {product.width.max} cm</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-warm-border">
                <span className="text-[10px] text-warm-gray block uppercase font-bold">Tinggi (T)</span>
                <span className="font-mono font-medium text-charcoal-900">{product.height.min} - {product.height.max} cm</span>
              </div>
            </div>

            <div className="text-[11px] text-charcoal-700 bg-white/70 p-2.5 rounded-lg flex items-center justify-between">
              <span className="text-warm-gray font-medium">Rekomendasi Ukuran:</span>
              <span className="font-mono font-bold text-wood-dark">
                {product.recommendedDimensions.length} x {product.recommendedDimensions.width} x {product.recommendedDimensions.height} cm
              </span>
            </div>
          </div>

          {/* Main Action Button */}
          <button
            onClick={() => router.push(`/customize/${product.id}`)}
            className="w-full py-4 px-6 rounded-xl bg-charcoal-900 hover:bg-wood text-white font-semibold text-base shadow-md hover:shadow-elevated transition-all flex items-center justify-center gap-2 group"
          >
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <span>KUSTOMISASI PRODUK INI</span>
          </button>

        </div>

      </div>
    </div>
  );
}
