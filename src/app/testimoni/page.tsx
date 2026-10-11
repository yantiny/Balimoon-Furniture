'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Star, Plus, MessageSquareHeart, ShieldCheck, ArrowLeft, Filter, Sparkles, CheckCircle2, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Testimonial } from '../../types/testimonial';
import { fetchAllTestimonials, onTestimonialUpdate, deleteTestimonial } from '../../services/testimonialService';
import TestimonialCard from '../../components/testimonials/TestimonialCard';
import TestimonialModal from '../../components/testimonials/TestimonialModal';

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'highest'>('newest');
  
  // Admin Mode & Delete state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<Testimonial | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

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

    // Check if current user is logged-in admin
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});

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

  const handleDeleteClick = (id: string) => {
    const target = testimonials.find((t) => t.id === id);
    if (target) {
      setConfirmDeleteTarget(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteTarget) return;

    setDeletingId(confirmDeleteTarget.id);
    try {
      await deleteTestimonial(confirmDeleteTarget.id);
      setTestimonials((prev) => prev.filter((t) => t.id !== confirmDeleteTarget.id));
      setFeedbackMsg(`Ulasan dari ${confirmDeleteTarget.nama} berhasil dihapus.`);
      setConfirmDeleteTarget(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus testimoni.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered & Sorted
  const filteredTestimonials = useMemo(() => {
    let list = [...testimonials];

    if (selectedRatingFilter !== 'all') {
      list = list.filter((t) => t.rating === selectedRatingFilter);
    }

    if (sortOrder === 'highest') {
      list.sort((a, b) => b.rating - a.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [testimonials, selectedRatingFilter, sortOrder]);

  // Overall Stats
  const totalReviews = testimonials.length;
  const avgRating = totalReviews > 0
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const fiveStarCount = testimonials.filter((t) => t.rating === 5).length;
  const fiveStarPercentage = totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 min-h-[85vh]">

      {/* Top Breadcrumb & Admin Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-warm-gray">
          <Link href="/" className="hover:text-charcoal-900 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <span>/</span>
          <span className="text-charcoal-900 font-semibold">Testimoni Pelanggan</span>
        </div>

        {isAdmin && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Mode Admin: Anda dapat menghapus ulasan yang tidak sesuai</span>
          </div>
        )}
      </div>

      {/* Action Notification Banner */}
      {feedbackMsg && (
        <div className="p-4 bg-wood/10 border border-wood/30 rounded-2xl text-xs text-wood-dark font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-wood-medium shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Hero Header & Summary Stats Card */}
      <div className="bg-gradient-to-br from-cream-100 via-white to-cream-200/80 rounded-3xl border border-warm-border/80 p-8 md:p-12 shadow-soft space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Title & Description */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cream-200 text-wood-dark text-xs font-semibold rounded-full border border-warm-border">
              <MessageSquareHeart className="w-3.5 h-3.5 text-wood-medium" />
              <span>Suara & Kepuasan Pelanggan Nyata</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-charcoal-900 tracking-tight leading-tight">
              Testimoni & Ulasan Mebel Bali Moon
            </h1>
            
            <p className="text-warm-gray text-base leading-relaxed">
              Semua ulasan diunggah langsung secara real-time oleh pelanggan kami yang telah membuktikan kualitas kayu jati perhutani, presisi ukuran custom 3D, dan hasil pengerjaan tangan pengrajin.
            </p>
          </div>

          {/* Quick Rating Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm flex flex-col sm:flex-row items-center gap-6 shrink-0">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-3xl font-mono font-extrabold text-charcoal-900">
                {avgRating} <span className="text-sm font-sans text-warm-gray font-normal">/ 5.0</span>
              </div>
              <p className="text-xs text-warm-gray">Berdasarkan {totalReviews} ulasan terverifikasi</p>
            </div>

            <div className="h-12 w-px bg-warm-border hidden sm:block"></div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-wood hover:bg-wood-medium text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 group shrink-0"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>TULIS TESTIMONI</span>
            </button>
          </div>

        </div>

        {/* Highlight Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-warm-border/60 text-xs">
          <div className="flex items-center gap-2.5 text-charcoal-800">
            <ShieldCheck className="w-5 h-5 text-wood-medium shrink-0" />
            <span><strong>{fiveStarPercentage}%</strong> Ulasan Berbintang 5 (Sangat Puas)</span>
          </div>
          <div className="flex items-center gap-2.5 text-charcoal-800">
            <CheckCircle2 className="w-5 h-5 text-wood-medium shrink-0" />
            <span>Real-time Sync dengan Database Supabase</span>
          </div>
          <div className="flex items-center gap-2.5 text-charcoal-800">
            <Sparkles className="w-5 h-5 text-wood-medium shrink-0" />
            <span>Kayu Jati Solid & Finishing Halus</span>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-warm-border/60">
        
        {/* Star Rating Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-warm-gray mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          <button
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedRatingFilter === 'all'
                ? 'bg-wood text-white shadow-sm'
                : 'bg-white border border-warm-border text-charcoal-800 hover:bg-cream-100'
            }`}
          >
            Semua ({testimonials.length})
          </button>
          <button
            onClick={() => setSelectedRatingFilter(5)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
              selectedRatingFilter === 5
                ? 'bg-wood text-white shadow-sm'
                : 'bg-white border border-warm-border text-charcoal-800 hover:bg-cream-100'
            }`}
          >
            <span>5 Bintang</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
          <button
            onClick={() => setSelectedRatingFilter(4)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
              selectedRatingFilter === 4
                ? 'bg-wood text-white shadow-sm'
                : 'bg-white border border-warm-border text-charcoal-800 hover:bg-cream-100'
            }`}
          >
            <span>4 Bintang</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
        </div>

        {/* Sort Order Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-warm-gray">Urutkan:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'highest')}
            className="px-3 py-1.5 rounded-xl bg-white border border-warm-border text-xs font-semibold text-charcoal-900 focus:outline-none cursor-pointer"
          >
            <option value="newest">Ulasan Terbaru</option>
            <option value="highest">Bintang Tertinggi</option>
          </select>
        </div>

      </div>

      {/* Testimonials List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-cream-100 rounded-3xl border border-warm-border/60"></div>
          ))}
        </div>
      ) : filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <TestimonialCard
              key={item.id}
              testimonial={item}
              showDeleteButton={isAdmin}
              onDelete={handleDeleteClick}
              isDeleting={deletingId === item.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-warm-border p-8 space-y-3">
          <MessageSquareHeart className="w-12 h-12 text-warm-gray mx-auto" />
          <h3 className="font-serif font-bold text-lg text-charcoal-900">Belum Ada Ulasan untuk Filter Ini</h3>
          <p className="text-xs text-warm-gray">Coba pilih filter bintang lainnya atau jadilah yang pertama memberikan testimoni!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 px-5 py-2.5 bg-wood text-white text-xs font-semibold rounded-xl hover:bg-wood-medium transition-colors"
          >
            Tulis Testimoni Sekarang
          </button>
        </div>
      )}

      {/* Bottom Floating CTA on Mobile */}
      <div className="fixed bottom-20 left-4 right-4 sm:hidden z-30 pointer-events-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-wood hover:bg-wood-medium text-white font-bold text-xs shadow-2xl flex items-center justify-center gap-2 border border-wood-light/40"
        >
          <Plus className="w-4 h-4" />
          <span>TULIS TESTIMONI BARU</span>
        </button>
      </div>

      {/* Submission Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />

      {/* Confirmation Modal for Deletion (Admin) */}
      {confirmDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-warm-border shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Hapus Testimoni Ini?</h3>
              <p className="text-xs text-warm-gray mt-1 leading-relaxed">
                Ulasan dari <strong>{confirmDeleteTarget.nama}</strong> ({confirmDeleteTarget.produk_nama}) akan dihapus secara permanen dari website dan database.
              </p>
            </div>
            <div className="p-3 bg-cream-100 rounded-xl border border-warm-border text-xs italic text-charcoal-800 line-clamp-3">
              &ldquo;{confirmDeleteTarget.komentar}&rdquo;
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteTarget(null)}
                disabled={Boolean(deletingId)}
                className="px-4 py-2.5 rounded-xl border border-warm-border text-xs font-medium text-charcoal-700 hover:bg-cream-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(deletingId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Ulasan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
