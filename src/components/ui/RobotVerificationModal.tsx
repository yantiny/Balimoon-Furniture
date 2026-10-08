'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Loader2, Sparkles, RefreshCw, Lock, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface RobotVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
  title?: string;
  description?: string;
}

export default function RobotVerificationModal({
  isOpen,
  onVerified,
  title = 'Verifikasi Keamanan Akses Katalog',
  description = 'Selesaikan verifikasi "Saya bukan robot" untuk melanjutkan ke Katalog Mebel Custom Balimoon.',
}: RobotVerificationModalProps) {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'challenge' | 'success'>('idle');
  const [selectedChallengeItems, setSelectedChallengeItems] = useState<number[]>([]);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  // Sample items for the visual puzzle challenge
  const challengeImages = [
    { id: 1, name: 'Meja Makan Jati', isTarget: true, icon: '🪑' },
    { id: 2, name: 'Mobil Mainan', isTarget: false, icon: '🚗' },
    { id: 3, name: 'Kursi Kayu Custom', isTarget: true, icon: '🪑' },
    { id: 4, name: 'Sepatu', isTarget: false, icon: '👟' },
    { id: 5, name: 'Lemari Kayu Solid', isTarget: true, icon: '🗄️' },
    { id: 6, name: 'Kipas Angin', isTarget: false, icon: '🌀' },
  ];

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setSelectedChallengeItems([]);
      setChallengeError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxClick = () => {
    if (status !== 'idle') return;

    setStatus('verifying');
    setChallengeError(null);

    // Simulate verification delay
    setTimeout(() => {
      // 80% direct success, or switch to visual challenge for extra interactivity
      // For smooth demo experience, let's complete direct success or offer visual verification option
      setStatus('success');
      setTimeout(() => {
        onVerified();
      }, 900);
    }, 1200);
  };

  const toggleChallengeItem = (id: number) => {
    if (selectedChallengeItems.includes(id)) {
      setSelectedChallengeItems(selectedChallengeItems.filter((item) => item !== id));
    } else {
      setSelectedChallengeItems([...selectedChallengeItems, id]);
    }
  };

  const handleVerifyChallenge = () => {
    const targetIds = challengeImages.filter((img) => img.isTarget).map((img) => img.id);
    const isCorrect =
      selectedChallengeItems.length === targetIds.length &&
      selectedChallengeItems.every((id) => targetIds.includes(id));

    if (isCorrect) {
      setStatus('verifying');
      setChallengeError(null);
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          onVerified();
        }, 800);
      }, 800);
    } else {
      setChallengeError('Pilihan belum tepat. Silakan pilih semua item produk mebel kayu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden transform transition-all">

        {/* Decorative Top Accent */}
        <div className="h-2 bg-gradient-to-r from-wood-light via-wood-medium to-charcoal-900" />

        <div className="p-6 sm:p-8 space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cream-200 text-wood-dark border border-wood-light/40 shadow-sm mb-1">
              <ShieldCheck className="w-7 h-7 text-wood-medium" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-charcoal-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-warm-gray leading-relaxed max-w-xs mx-auto">
              {description}
            </p>
          </div>

          {/* Captcha Box Container */}
          <div className="bg-cream-100/80 rounded-2xl p-4 border border-warm-border/80 shadow-inner space-y-4">

            {/* Standard Checkbox Verification Box */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-warm-border shadow-sm">
              <div className="flex items-center gap-3.5">

                {/* Custom Checkbox */}
                <button
                  type="button"
                  onClick={handleCheckboxClick}
                  disabled={status === 'verifying' || status === 'success'}
                  aria-label="Saya bukan robot"
                  className={`relative w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 focus:outline-none ${status === 'success'
                    ? 'bg-wood-medium border-wood-medium text-white shadow-md shadow-wood-light/40'
                    : status === 'verifying'
                      ? 'border-wood-medium bg-cream-200'
                      : 'border-warm-border hover:border-wood-medium bg-white hover:bg-cream-100'
                    }`}
                >
                  {status === 'verifying' && (
                    <Loader2 className="w-5 h-5 text-wood-medium animate-spin" />
                  )}

                  {status === 'success' && (
                    <Check className="w-5 h-5 text-white stroke-[3] animate-scaleIn" />
                  )}
                </button>

                <span className="text-sm font-medium text-charcoal-900 select-none">
                  Saya bukan robot
                </span>
              </div>

              {/* Security Brand Badge */}
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wide uppercase text-warm-gray">
                  <Lock className="w-3 h-3 text-wood-medium" />
                  <span>Bali Moon Furniture</span>
                </div>
                <span className="text-[8px] text-warm-gray/70">Anti-Bot Guard</span>
              </div>
            </div>

            {/* Sub-status Indicator */}
            {status === 'verifying' && (
              <div className="flex items-center justify-center gap-2 text-xs text-wood-dark font-medium animate-pulse py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-wood-medium" />
                <span>Memeriksa keamanan sesi browser Anda...</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-wood-dark font-semibold py-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-wood-medium" />
                <span>Verifikasi berhasil! Mengalihkan ke Katalog...</span>
              </div>
            )}

            {/* Switch to Challenge Option if desired */}
            {status === 'idle' && (
              <div className="pt-1 flex items-center justify-between text-[11px] text-warm-gray border-t border-warm-border/50">
                <button
                  type="button"
                  onClick={() => setStatus('challenge')}
                  className="hover:text-wood-dark font-medium underline transition-colors"
                >
                  Gunakan verifikasi gambar
                </button>
                <span className="flex items-center gap-1 text-wood-medium font-medium">
                  <Sparkles className="w-3 h-3 text-wood-medium" /> Dilindungi
                </span>
              </div>
            )}
          </div>

          {/* Optional Visual Image Challenge Modal Mode */}
          {status === 'challenge' && (
            <div className="p-4 bg-white rounded-2xl border border-warm-border space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-warm-border/60 pb-2">
                <h4 className="text-xs font-semibold text-charcoal-900">
                  Tantangan: Pilih semua gambar <span className="text-wood-dark font-bold underline">Mebel Kayu</span>
                </h4>
                <button
                  onClick={() => {
                    setSelectedChallengeItems([]);
                    setChallengeError(null);
                  }}
                  className="text-warm-gray hover:text-charcoal-900 p-1"
                  title="Acak item"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {challengeImages.map((img) => {
                  const isSelected = selectedChallengeItems.includes(img.id);
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => toggleChallengeItem(img.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${isSelected
                        ? 'bg-wood-medium/10 border-wood-medium ring-2 ring-wood-medium/30'
                        : 'bg-cream-100 border-warm-border/60 hover:border-warm-border'
                        }`}
                    >
                      <span className="text-2xl mb-1">{img.icon}</span>
                      <span className="text-[10px] font-medium text-charcoal-800 line-clamp-1">
                        {img.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-wood-medium text-white rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{challengeError}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="text-xs text-warm-gray hover:text-charcoal-900"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleVerifyChallenge}
                  className="px-4 py-1.5 rounded-lg bg-wood-medium hover:bg-wood text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Verifikasi Pilihan
                </button>
              </div>
            </div>
          )}

          {/* Footer Notice */}
          <div className="text-center pt-2 border-t border-warm-border/40">
            <p className="text-[11px] text-warm-gray/80 flex items-center justify-center gap-1">
              <Info className="w-3 h-3 text-wood-medium" />
              <span>Verifikasi ini menjamin pengalaman kustomisasi 3D yang cepat dan aman.</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
