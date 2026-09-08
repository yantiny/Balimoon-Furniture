import React from 'react';
import Link from 'next/link';
import ProductCard from '../components/ui/ProductCard';
import { STATIC_PRODUCTS } from '../data/products';
import { FurnitureCanvas } from '../components/3d/FurnitureCanvas';
import { Ruler, ShieldCheck, Hammer, Move3d, ArrowRight, CheckCircle2, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = STATIC_PRODUCTS.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-200/80 via-cream-100 to-cream-100 pt-12 pb-20 border-b border-warm-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wood/10 text-wood-dark border border-wood/20 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-wood-medium" />
                <span>Mebel Custom Hasil Karya Pengrajin</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-charcoal-900 tracking-tight leading-[1.15]">
                Mebel yang Dirancang Khusus untuk Ruangan Anda.
              </h1>

              <p className="text-base sm:text-lg text-warm-gray leading-relaxed max-w-xl">
                Setiap furnitur dibuat sesuai pesanan. Pilih desain favorit Anda, tentukan ukuran presisi hingga milimeter, dan visualisasikan dalam bentuk 3D interaktif sebelum memesan.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/furniture"
                  className="px-7 py-4 rounded-xl bg-charcoal-900 text-white font-medium hover:bg-wood transition-all shadow-md hover:shadow-elevated flex items-center justify-center gap-2 group text-base"
                >
                  <span>Jelajahi Katalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/customize/kursi-kayu-01"
                  className="px-7 py-4 rounded-xl bg-white border border-warm-border text-charcoal-800 font-semibold hover:border-charcoal-900 hover:bg-cream-200/50 transition-all flex items-center justify-center gap-2 text-base shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4 text-wood-medium" />
                  <span>Kustomisasi Ukuran 3D</span>
                </Link>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-6 border-t border-warm-border/60 grid grid-cols-3 gap-4 text-xs text-charcoal-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-wood-medium shrink-0" />
                  <span>Tanpa Penumpukan Stok</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-wood-medium shrink-0" />
                  <span>Kayu Solid Oven</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-wood-medium shrink-0" />
                  <span>Finishing Alami Kayu</span>
                </div>
              </div>
            </div>

            {/* Right Hero 3D Preview Card */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-wood-light via-wood-medium to-charcoal-900 opacity-20 blur-xl"></div>
                <div className="relative">
                  <FurnitureCanvas
                    modelType="dining-table"
                    modelUrl="/models/asset 3D/mejatinggi.glb"
                    length={160}
                    width={80}
                    height={76}
                    defaultLength={160}
                    defaultWidth={80}
                    defaultHeight={76}
                  />

                  <div className="mt-3 flex items-center justify-between text-xs text-warm-gray px-2">
                    <span className="font-medium text-charcoal-900">Meja Makan Custom (160 x 80 x 76 cm)</span>
                    <span className="text-wood font-semibold">Simulasi Model 3D</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">Keunggulan Balimoon Furniture</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
            Dibuat Khusus Sesuai Karakter Rumah Anda
          </h2>
          <p className="text-warm-gray text-sm">
            Kami menggabungkan keahlian ukir dan pertukangan kayu tradisional Indonesia dengan kustomisasi digital 3D modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 bg-white rounded-2xl border border-warm-border/80 shadow-soft hover:shadow-elevated transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cream-200 text-wood-medium flex items-center justify-center">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-charcoal-900">Ukuran Bebas (Custom Size)</h3>
            <p className="text-xs text-warm-gray leading-relaxed">
              Tidak terbatas pada ukuran standar toko. Bebas atur Panjang, Lebar, dan Tinggi agar pas dengan sudut ruangan Anda.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-warm-border/80 shadow-soft hover:shadow-elevated transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cream-200 text-wood-medium flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-charcoal-900">Material Kayu Pilihan</h3>
            <p className="text-xs text-warm-gray leading-relaxed">
              Dibuat dari kayu Jati solid pilihan, Oak Putih, Mahoni berkualitas tinggi, dan aksen rotan alami.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-warm-border/80 shadow-soft hover:shadow-elevated transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cream-200 text-wood-medium flex items-center justify-center">
              <Hammer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-charcoal-900">Pesanan Khusus (Made To Order)</h3>
            <p className="text-xs text-warm-gray leading-relaxed">
              Dikerjakan satu per satu secara teliti. Pengrajin berpengalaman merakit setiap sambungan kayu dengan kokoh dan presisi.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-warm-border/80 shadow-soft hover:shadow-elevated transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cream-200 text-wood-medium flex items-center justify-center">
              <Move3d className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-charcoal-900">Simulasi 3D Realtime</h3>
            <p className="text-xs text-warm-gray leading-relaxed">
              Lihat perubahan proporsi mebel secara langsung dalam tampilan 3D interaktif sebelum mengajukan estimasi harga.
            </p>
          </div>

        </div>
      </section>

      {/* 3. FEATURED FURNITURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">Pilihan Paling Populer</span>
            <h2 className="text-3xl font-serif font-bold text-charcoal-900 mt-1">Koleksi Mebel Favorit</h2>
          </div>

          <Link
            href="/furniture"
            className="inline-flex items-center gap-2 text-sm font-semibold text-wood-dark hover:text-wood transition-colors group"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="bg-cream-200/60 py-16 border-y border-warm-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">4 Langkah Mudah</span>
            <h2 className="text-3xl font-serif font-bold text-charcoal-900">Cara Pemesanan Mebel Custom</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            <div className="bg-white p-6 rounded-2xl border border-warm-border/70 space-y-3 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-wood-medium text-white font-bold text-sm flex items-center justify-center font-mono">1</span>
              <h4 className="font-serif font-bold text-base text-charcoal-900">Pilih Model Mebel</h4>
              <p className="text-xs text-warm-gray leading-relaxed">Pilih jenis produk dari katalog kami, seperti meja kerja, meja makan, lemari kabinet, atau rak buku.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-warm-border/70 space-y-3 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-wood-medium text-white font-bold text-sm flex items-center justify-center font-mono">2</span>
              <h4 className="font-serif font-bold text-base text-charcoal-900">Atur Ukuran Presisi</h4>
              <p className="text-xs text-warm-gray leading-relaxed">Geser slider Panjang, Lebar, dan Tinggi sesuai luas ruangan. Amati perubahan bentuk pada tampilan 3D.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-warm-border/70 space-y-3 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-wood-medium text-white font-bold text-sm flex items-center justify-center font-mono">3</span>
              <h4 className="font-serif font-bold text-base text-charcoal-900">Estimasi Harga Otomatis</h4>
              <p className="text-xs text-warm-gray leading-relaxed">Sistem menghitung perkiraan harga secara transparan berdasarkan volume kayu dan kirim permintaan Anda.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-warm-border/70 space-y-3 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-wood-medium text-white font-bold text-sm flex items-center justify-center font-mono">4</span>
              <h4 className="font-serif font-bold text-base text-charcoal-900">Pembuatan & Pengiriman</h4>
              <p className="text-xs text-warm-gray leading-relaxed">Dapatkan ID Pesanan unik, pantau tahapan produksi secara online, dan terima mebel impian Anda di rumah.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal-900 text-cream-100 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-elevated">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Siap Merancang Mebel Impian Anda?
            </h2>
            <p className="text-warm-gray text-base leading-relaxed">
              Mulai buat mebel yang pas dengan ukuran dan tata letak ruangan Anda hingga ke sentimeter terkecil.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/furniture"
                className="px-7 py-4 rounded-xl bg-wood hover:bg-wood-medium text-white font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <span>Lihat Katalog Produk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/track"
                className="px-7 py-4 rounded-xl bg-charcoal-700 hover:bg-charcoal-700/80 text-white font-medium border border-charcoal-700 transition-all"
              >
                Cek Pesanan Yang Ada
              </Link>
            </div>
          </div>

          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-wood-medium/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

    </div>
  );
}
