'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageSquare, CheckCheck } from 'lucide-react';
import { generateWhatsAppChatUrl, getAdminWANumber } from '../../utils/whatsapp';

export const WhatsAppBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const adminNumber = getAdminWANumber();

  const presets = [
    { label: '💬 Konsultasi Mebel Custom', text: 'Halo Admin, saya ingin konsultasi mengenai desain mebel custom.' },
    { label: '🪵 Tanya Bahan Kayu', text: 'Halo Admin, kayu apa yang dipakai untuk produksi mebel Bali Moon?' },
    { label: '📦 Cek Status Pesanan', text: 'Halo Admin, saya ingin menanyakan status pesanan saya.' },
  ];

  const handleOpenToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = (customText?: string) => {
    const textToSend = customText || message || 'Halo Admin Bali Moon Furniture, saya ingin bertanya mengenai mebel custom.';
    const url = generateWhatsAppChatUrl(textToSend);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[360px] max-w-[380px] bg-charcoal-900 border border-charcoal-700/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-wood-dark via-wood to-charcoal-900 p-3.5 sm:p-4 flex items-center justify-between border-b border-wood-medium/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-wood-medium/30 border border-wood-light/40 flex items-center justify-center text-wood-light font-bold font-serif text-base sm:text-lg">
                    BM
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 border-2 border-charcoal-900 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-cream-100 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                    Bali Moon Customer Service
                    <Sparkles className="w-3.5 h-3.5 text-wood-light" />
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-cream-200/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Online • Respon Cepat
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenToggle}
                className="text-cream-200/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Tutup Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-3.5 sm:p-4 space-y-3.5 max-h-[300px] sm:max-h-[320px] overflow-y-auto bg-charcoal-950/90 text-xs">
              <div className="text-center my-1">
                <span className="bg-charcoal-800 text-warm-gray/70 px-2.5 py-0.5 rounded-full text-[10px]">
                  Hari ini
                </span>
              </div>

              {/* Admin Greeting Bubble */}
              <div className="flex items-start gap-2 max-w-[90%]">
                <div className="bg-wood-dark/70 text-cream-100 p-3 rounded-2xl rounded-tl-sm border border-wood-medium/50 shadow-sm space-y-1.5 leading-relaxed">
                  <p className="font-medium text-wood-light text-[11px]">Admin Bali Moon Furniture</p>
                  <p className="text-xs">
                    Halo! 👋 Selamat datang di Bali Moon Furniture. Ada yang bisa kami bantu seputar mebel?
                  </p>
                  <div className="flex items-center justify-end text-[10px] text-cream-200/70 gap-1 pt-0.5">
                    <span>Baru saja</span>
                    <CheckCheck className="w-3 h-3 text-wood-light" />
                  </div>
                </div>
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-medium text-warm-gray/80 px-1">Pilih pertanyaan cepat:</p>
                <div className="flex flex-col gap-1.5">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(preset.text)}
                      className="text-left bg-charcoal-800/80 hover:bg-wood-dark/40 border border-charcoal-700 hover:border-wood/50 text-cream-200 hover:text-white px-3 py-2 rounded-xl transition-all duration-200 flex items-center justify-between group"
                    >
                      <span className="text-xs">{preset.label}</span>
                      <Send className="w-3 h-3 text-warm-gray group-hover:text-wood-light opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input & Action Footer */}
            <div className="p-3 bg-charcoal-900 border-t border-charcoal-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 bg-charcoal-950 border border-charcoal-700 rounded-xl px-3 py-2 text-xs text-white placeholder-warm-gray/50 focus:outline-none focus:border-wood transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  className="bg-wood hover:bg-wood-medium text-cream-50 p-2.5 rounded-xl transition-colors flex items-center justify-center shrink-0 shadow-lg shadow-wood-dark/40"
                  aria-label="Kirim Pesan WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-warm-gray/60">
                Terhubung langsung ke WhatsApp Admin ({adminNumber})
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Floating Trigger Button */}
      <motion.button
        onClick={handleOpenToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group bg-wood hover:bg-wood-medium text-cream-50 p-3.5 sm:p-4 rounded-full shadow-2xl shadow-black/50 flex items-center justify-center border border-wood-light/40 transition-all duration-300"
        aria-label="Chat WhatsApp Admin"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-0.5 rounded-full bg-wood-light opacity-40 group-hover:opacity-75 animate-ping pointer-events-none"></span>

        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 fill-current relative z-10 text-white"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Floating Tooltip Label on desktop hover */}
        <span className="hidden sm:block absolute right-full mr-3 bg-wood-dark text-cream-100 text-xs px-3 py-1.5 rounded-xl border border-wood-medium/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Chat WA Admin
        </span>
      </motion.button>
    </div>
  );
};

export default WhatsAppBubble;
