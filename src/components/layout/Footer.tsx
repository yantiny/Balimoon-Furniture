import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Ruler, Box, Sparkles, MessageCircle } from 'lucide-react';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';
import { ChairLogo } from '../ui/ChairLogo';


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
              <div className="w-9 h-9 rounded-xl bg-wood text-white flex items-center justify-center p-1.5">
                <ChairLogo className="w-6 h-6 text-white" />
              </div>
              <span className="font-poppins text-xl font-bold tracking-tight text-white">
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
                <Link href="/customize/meja-rias-01" className="hover:text-white transition-colors">Kustomisasi 3D</Link>

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
            <h5 className="text-white font-semibold text-sm tracking-wide mb-4 uppercase text-xs">Layanan Pelanggan</h5>
            <p className="text-sm text-warm-gray leading-relaxed mb-3">
              Butuh panduan kustomisasi atau pertanyaan seputar kayu & pengiriman? Hubungi Admin kami.
            </p>
            <a
              href={generateWhatsAppChatUrl('Halo Admin Bali Moon Furniture, saya ingin bertanya tentang custom furniture.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-wood/20 hover:bg-wood/35 text-wood-light hover:text-white text-xs font-medium rounded-xl border border-wood-light/40 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-wood-light" />
              <span>Chat WA Admin</span>
            </a>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-700 flex items-center justify-center text-xs text-warm-gray text-center">
          <p>© {new Date().getFullYear()} BALIMOON FURNITURE. Hak Cipta Dilindungi.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
