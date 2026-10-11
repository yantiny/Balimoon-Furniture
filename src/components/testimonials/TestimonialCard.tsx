import React from 'react';
import { Star, Quote, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import { Testimonial } from '../../types/testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
  showDeleteButton?: boolean;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  showDeleteButton = false,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <div className="bg-white p-7 rounded-3xl border border-warm-border/80 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group">
      
      {/* Background Decorative Quote */}
      <Quote className="w-12 h-12 text-wood/10 absolute top-4 right-4 pointer-events-none group-hover:scale-110 transition-transform" />

      <div className="space-y-3.5 relative z-10">
        
        {/* Top Bar: Stars + Delete Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= testimonial.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-warm-border'
                }`}
              />
            ))}
            <span className="text-[11px] font-mono font-bold text-warm-gray ml-1.5">
              {testimonial.rating}.0
            </span>
          </div>

          {/* Admin Delete Action */}
          {showDeleteButton && onDelete && (
            <button
              onClick={() => onDelete(testimonial.id)}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-warm-gray hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Hapus testimoni ini (Khusus Admin)"
              aria-label="Hapus Testimoni"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Comment */}
        <p className="text-charcoal-800 text-sm italic leading-relaxed">
          &ldquo;{testimonial.komentar}&rdquo;
        </p>
      </div>

      {/* Customer Meta Footer */}
      <div className="pt-4 border-t border-warm-border/60 flex items-center justify-between relative z-10">
        <div>
          <h4 className="font-serif font-bold text-sm text-charcoal-900">
            {testimonial.nama}
          </h4>
          <p className="text-[11px] text-warm-gray flex items-center gap-1 mt-0.5">
            <span>{testimonial.kota}</span>
            <span>•</span>
            <span className="text-wood-dark font-medium">{testimonial.produk_nama}</span>
          </p>
        </div>

        {testimonial.terverifikasi !== false && (
          <span className="px-2.5 py-1 bg-cream-200 text-wood-dark text-[10px] font-bold rounded-full border border-warm-border/50 shrink-0 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-wood-medium" />
            <span>Terverifikasi</span>
          </span>
        )}
      </div>

    </div>
  );
};

export default TestimonialCard;
