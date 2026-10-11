'use client';

import React, { useState } from 'react';
import { Star, X, Sparkles, Send, CheckCircle2, AlertCircle, HeartHandshake } from 'lucide-react';
import { submitTestimonial } from '../../services/testimonialService';
import { STATIC_PRODUCTS } from '../../data/products';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TestimonialModal({ isOpen, onClose, onSuccess }: TestimonialModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [nama, setNama] = useState<string>('');
  const [kota, setKota] = useState<string>('');
  const [produkNama, setProdukNama] = useState<string>(STATIC_PRODUCTS[0]?.name || 'Meja Rias Minimalis');
  const [komentar, setKomentar] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const ratingDescriptions: Record<number, string> = {
    1: 'Kurang Puas',
    2: 'Cukup',
    3: 'Baik & Sesuai',
    4: 'Sangat Bagus',
    5: 'Sempurna & Sangat Puas!',
  };

  const currentDisplayRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nama.trim() || !komentar.trim()) {
      setErrorMsg('Nama dan ulasan testimoni wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const res = await submitTestimonial({
        nama: nama.trim(),
        kota: kota.trim() || 'Bali',
        produk_nama: produkNama.trim(),
        rating,
        komentar: komentar.trim(),
      });

      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setNama('');
          setKota('');
          setKomentar('');
          setRating(5);
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Gagal mengirim testimoni. Silakan coba lagi.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-wood-deep via-wood-dark to-wood p-5 text-white flex items-center justify-between border-b border-wood-light/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-wood/40 border border-wood-light/40 flex items-center justify-center text-amber-300">
              <Star className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-cream-100">
                Tulis Ulasan & Testimoni
              </h3>
              <p className="text-[11px] text-cream-200/80">
                Bagikan pengalaman Anda bersama Bali Moon Furniture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cream-200/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-cream-200 text-wood-dark mx-auto flex items-center justify-center border border-wood/30 shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-wood" />
            </div>
            <h4 className="font-serif font-bold text-xl text-charcoal-900">
              Terima Kasih atas Testimoni Anda!
            </h4>
            <p className="text-xs text-warm-gray leading-relaxed max-w-xs mx-auto">
              Ulasan Anda telah berhasil disimpan dan langsung tampil secara real-time di website.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Star Rating Interactive Selector */}
            <div className="p-4 rounded-2xl bg-cream-100/80 border border-warm-border text-center space-y-2">
              <label className="text-xs font-semibold text-charcoal-800 block">
                Berapa bintang kepuasan Anda? *
              </label>
              
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform focus:outline-none"
                    aria-label={`Beri bintang ${star}`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        star <= currentDisplayRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-warm-border stroke-[1.5]'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold text-wood-dark">
                {currentDisplayRating} dari 5 Bintang • {ratingDescriptions[currentDisplayRating]}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-800">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Krisna"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-800">
                  Kota / Domisili
                </label>
                <input
                  type="text"
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  placeholder="Contoh: Denpasar, Bali"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                />
              </div>
            </div>

            {/* Product Purchased */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-800">
                Produk Mebel yang Dipesan
              </label>
              <select
                value={produkNama}
                onChange={(e) => setProdukNama(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium cursor-pointer"
              >
                {STATIC_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="Mebel Custom Lainnya">Mebel Custom Lainnya</option>
              </select>
            </div>

            {/* Testimonial Text */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-800">
                Ulasan & Kepuasan Anda *
              </label>
              <textarea
                rows={3}
                required
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                placeholder="Ceritakan kepuasan hasil kayu, presisi ukuran, atau pelayanan pengrajin Bali Moon..."
                className="w-full p-3 rounded-xl bg-cream-50 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium leading-relaxed"
              ></textarea>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-warm-border text-xs font-medium text-charcoal-700 hover:bg-cream-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-wood hover:bg-wood-medium text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>KIRIM TESTIMONI</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
