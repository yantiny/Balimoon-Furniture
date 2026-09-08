import React from 'react';
import Link from 'next/link';
import { Hammer, ShieldCheck, Ruler, Box, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-cream-200 border-t border-charcoal-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-charcoal-700">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-charcoal-700/60 rounded-xl text-amber-400">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Ukuran Custom</h4>
              <p className="text-xs text-warm-gray mt-1">Dapat disesuaikan presisi hingga milimeter sesuai luas ruangan.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-charcoal-700/60 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Kayu Pilihan Premium</h4>
              <p className="text-xs text-warm-gray mt-1">100% kayu keras solid berkualitas oven & sentuhan rotan alami.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-charcoal-700/60 rounded-xl text-amber-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Buatan Pengrajin</h4>
              <p className="text-xs text-warm-gray mt-1">Bukan produk masal. Dibuat khusus oleh pengrajin kayu berpengalaman.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-charcoal-700/60 rounded-xl text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Visualisasi 3D Realtime</h4>
              <p className="text-xs text-warm-gray mt-1">Lihat bentuk mebel secara interaktif sebelum mengajukan pesanan.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-wood text-white flex items-center justify-center">
                <Hammer className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                BALIMOON FURNITURE
              </span>
            </div>
            <p className="text-sm text-warm-gray leading-relaxed">
              Mebel custom berkualitas tinggi yang dibuat khusus sesuai keinginan Anda. Memadukan keahlian seni kayu tradisional Indonesia dengan teknologi visualisasi 3D modern.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wide mb-4 uppercase text-xs">Jelajahi</h5>
            <ul className="space-y-2.5 text-sm text-warm-gray">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/furniture" className="hover:text-white transition-colors">Katalog Mebel</Link>
              </li>
              <li>
                <Link href="/customize/kursi-kayu-01" className="hover:text-white transition-colors">Kustomisasi 3D</Link>

              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">Cek Status Pesanan</Link>
              </li>
            </ul>

          </div>

          {/* Technical Note */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wide mb-4 uppercase text-xs">Sistem Otomatisasi</h5>
            <div className="p-4 rounded-xl bg-charcoal-700/40 border border-charcoal-700 text-xs text-warm-gray space-y-2">
              <p className="font-medium text-cream-200">✨ Arsitektur Zero Database</p>
              <p>Ditenagai workflow n8n Webhook yang terhubung langsung ke basis data Google Sheets.</p>
            </div>
          </div>

          {/* Contact / Service */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wide mb-4 uppercase text-xs">Jaminan Finishing</h5>
            <p className="text-sm text-warm-gray leading-relaxed mb-3">
              Semua produk dilindungi dengan lapisan <strong>Finishing Alami Kayu</strong> ramah lingkungan untuk menjaga keindahan serat kayu asli.
            </p>
            <div className="inline-block px-3 py-1 bg-wood/20 text-amber-300 text-xs rounded-full border border-wood/30">
              Finishing Alami Kayu
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-gray gap-4">
          <p>© {new Date().getFullYear()} BALIMOON FURNITURE. Hak Cipta Dilindungi.</p>
          <p className="text-[11px] text-warm-gray/80">Dibuat dengan Next.js, React Three Fiber, n8n & Google Sheets</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
