import React from 'react';
import { PriceCalculationResult, formatIDR } from '../../utils/pricing';
import { AlertCircle, Calculator, CheckCircle2 } from 'lucide-react';

interface PriceEstimateWidgetProps {
  calculation: PriceCalculationResult;
  selectedMaterialName?: string;
  isSubmitting?: boolean;
}

export const PriceEstimateWidget: React.FC<PriceEstimateWidgetProps> = ({
  calculation,
  selectedMaterialName,
  isSubmitting = false
}) => {
  return (
    <div className="bg-gradient-to-br from-cream-100 to-cream-200 p-6 rounded-2xl border border-wood/20 shadow-soft space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
        <div className="flex items-center gap-2 text-charcoal-900 font-serif font-bold text-lg">
          <Calculator className="w-5 h-5 text-wood-medium" />
          <span>Rincian Estimasi Harga</span>
        </div>
        <span className="px-2.5 py-0.5 bg-wood/10 text-wood-dark text-xs font-semibold rounded-full border border-wood/20">
          Pesanan Khusus
        </span>
      </div>

      {/* Breakdown List */}
      <div className="space-y-2 text-xs text-charcoal-700">
        <div className="flex items-center justify-between">
          <span className="text-warm-gray">Harga Acuan Model Dasar:</span>
          <span className="font-mono font-medium">{formatIDR(calculation.basePrice)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-warm-gray">Penyesuaian Skala Ukuran:</span>
          <span className="font-mono font-medium">
            {calculation.dimensionAdjustment >= 0 ? '+' : ''}
            {formatIDR(calculation.dimensionAdjustment)}
          </span>
        </div>

        {calculation.materialAdjustment !== 0 && (
          <div className="flex items-center justify-between">
            <span className="text-warm-gray">Pilihan Bahan Kayu ({selectedMaterialName || 'Premium'}):</span>
            <span className="font-mono font-medium">
              {calculation.materialAdjustment >= 0 ? '+' : ''}
              {formatIDR(calculation.materialAdjustment)}
            </span>
          </div>
        )}
      </div>

      {/* Total Display */}
      <div className="pt-3 border-t border-warm-border/60 flex items-baseline justify-between">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-warm-gray block">Total Estimasi Harga</span>
          <span className="text-[10px] text-warm-gray">Tergantung konfirmasi verifikasi teknis</span>
        </div>
        <div className="text-right">
          <span className="text-2xl md:text-3xl font-serif font-extrabold text-wood-dark tracking-tight">
            {calculation.formattedPrice}
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 text-[11px] text-charcoal-700 leading-relaxed flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-wood-medium shrink-0 mt-0.5" />
        <p>
          <strong className="text-charcoal-900">Catatan Penting:</strong> Harga ini merupakan <em>PERKIRAAN / ESTIMASI HARGA</em> berdasarkan ukuran yang Anda masukkan. Harga final dapat disesuaikan setelah verifikasi gambar teknis & struktur oleh tim pengrajin kami.
        </p>
      </div>
    </div>
  );
};

export default PriceEstimateWidget;
