'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Plus, ArrowRight, MessageSquareHeart } from 'lucide-react';
import { Testimonial } from '../../types/testimonial';
import { fetchAllTestimonials, onTestimonialUpdate } from '../../services/testimonialService';
import TestimonialCard from './TestimonialCard';
import TestimonialModal from './TestimonialModal';

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await fetchAllTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to real-time additions & deletions
    const unsubscribe = onTestimonialUpdate(
      (newTesti) => {
        setTestimonials((prev) => {
          const filtered = prev.filter((item) => item.id !== newTesti.id);
          return [newTesti, ...filtered];
        });
      },
      (deletedId) => {
        setTestimonials((prev) => prev.filter((item) => item.id !== deletedId));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Display top 3 on landing page
  const displayItems = testimonials.slice(0, 3);

  // Stats calculation
  const totalReviews = testimonials.length;
  const avgRating = totalReviews > 0
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-200 text-wood-dark text-xs font-semibold rounded-full border border-warm-border">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Ulasan & Testimoni Pelanggan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
            Pengalaman Mereka Bersama Bali Moon Furniture
          </h2>
          <p className="text-warm-gray text-sm leading-relaxed">
            Kepuasan pelanggan yang telah memesan mebel kayu custom dengan ukuran presisi dan kualitas premium.
          </p>
        </div>

        {/* Action Button & Summary Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-cream-100 border border-warm-border flex items-center gap-2 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-charcoal-900">{avgRating}/5.0</span>
            <span className="text-warm-gray text-[11px]">({totalReviews} Ulasan)</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-wood hover:bg-wood-medium text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>Tulis Testimoni</span>
          </button>
        </div>
      </div>

      {/* Realtime Grid of Testimonials */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-cream-100 rounded-3xl border border-warm-border/60"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayItems.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>
      )}

      {/* Footer Navigation Link */}
      <div className="text-center pt-2">
        <Link
          href="/testimoni"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-warm-border text-xs font-semibold text-charcoal-800 hover:border-wood hover:text-wood-dark hover:bg-cream-100 transition-all shadow-sm"
        >
          <MessageSquareHeart className="w-4 h-4 text-wood-medium" />
          <span>Lihat Semua {totalReviews} Testimoni & Tulis Ulasan Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Submission Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />

    </section>
  );
}
