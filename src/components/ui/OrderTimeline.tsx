import React from 'react';
import { OrderStatus } from '../../types/furniture';
import { CheckCircle2, Clock, PackageCheck, Hammer, Sparkles, Truck, Award, ShieldAlert, Paintbrush, Send } from 'lucide-react';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  timelineDates?: Record<string, string | undefined>;
}

interface TimelineStep {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    key: 'SUBMITTED',
    label: 'Pesanan Diajukan (SUBMITTED)',
    description: 'Permintaan mebel custom telah diterima via website dan tercatat di sistem.',
    icon: CheckCircle2,
  },
  {
    key: 'DIPROSES',
    label: 'Konfirmasi & Desain (DIPROSES)',
    description: 'Pemeriksaan spesifikasi kayu, ukuran custom, dan gambar kerja teknis.',
    icon: Sparkles,
  },
  {
    key: 'PRODUKSI',
    label: 'Proses Pembuatan (PRODUKSI)',
    description: 'Pekerjaan pertukangan kayu solid oven, perakitan konstruksi & pengamplasan.',
    icon: Hammer,
  },
  {
    key: 'FINISHING',
    label: 'Pelapisan Finishing (FINISHING)',
    description: 'Aplikasi pelapisan Natural Wood Finish untuk melindungi serat kayu alami.',
    icon: Paintbrush,
  },
  {
    key: 'SIAP DIKIRIM',
    label: 'Pemeriksaan & Packing (SIAP DIKIRIM)',
    description: 'Inspeksi kualitas final (QC) dan pembungkusan peti kayu pelindung.',
    icon: PackageCheck,
  },
  {
    key: 'DIKIRIM',
    label: 'Pengiriman Kurir (DIKIRIM)',
    description: 'Pesanan mebel sedang dalam perjalanan via kurir ekspedisi ke lokasi Anda.',
    icon: Truck,
  },
  {
    key: 'SELESAI',
    label: 'Selesai & Diterima (SELESAI)',
    description: 'Produk mebel custom telah diterima dengan baik oleh pelanggan.',
    icon: Award,
  },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, timelineDates = {} }) => {
  // Determine step index based on status string (Indonesian or legacy English)
  const getStepIndex = (status: OrderStatus): number => {
    const s = String(status || '').toUpperCase().trim();

    switch (s) {
      case 'SUBMITTED':
        return 0;
      case 'DIPROSES':
      case 'DESIGN_CONFIRMATION':
      case 'MATERIAL_PREPARATION':
      case 'REVISION_REQUIRED':
        return 1;
      case 'PRODUKSI':
      case 'DIPRODUKSI':
      case 'PRODUCTION':
        return 2;

      case 'FINISHING':
      case 'QUALITY_CHECK':
        return 3;
      case 'SIAP DIKIRIM':
      case 'SIAP_DIKIRIM':
      case 'READY_TO_SHIP':
        return 4;
      case 'DIKIRIM':
      case 'SHIPPED':
        return 5;
      case 'SELESAI':
      case 'COMPLETED':
        return 6;
      case 'DIBATALKAN':
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);
  const isCancelled = String(currentStatus || '').toUpperCase() === 'DIBATALKAN' || String(currentStatus || '').toUpperCase() === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-center gap-3">
        <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
        <div>
          <h4 className="font-bold text-base">Pesanan Dibatalkan (DIBATALKAN)</h4>
          <p className="text-xs text-red-700 mt-0.5">Permintaan pesanan mebel custom ini telah dibatalkan di sistem.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="relative pl-6 md:pl-8 border-l-2 border-warm-border space-y-8">
        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative group">
              
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-wood-medium text-white shadow-md'
                    : isActive
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-lg scale-110'
                    : 'bg-cream-200 text-warm-gray border border-warm-border'
                }`}
              >
                {isCompleted ? (
                  <span className="font-bold text-xs">✓</span>
                ) : isActive ? (
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                ) : (
                  <span className="text-[11px] font-mono font-medium">○</span>
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-4 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-white border-amber-300 shadow-elevated'
                    : isCompleted
                    ? 'bg-cream-100/60 border-warm-border/50'
                    : 'bg-cream-50/40 border-transparent opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : isCompleted ? 'text-wood-medium' : 'text-warm-gray'}`} />
                    <h4 className={`font-semibold text-sm ${isActive ? 'text-charcoal-900 font-bold' : isCompleted ? 'text-charcoal-800' : 'text-warm-gray'}`}>
                      {step.label}
                    </h4>
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                      Status Aktif
                    </span>
                  )}
                </div>

                <p className="text-xs text-warm-gray mt-1.5 leading-relaxed">
                  {step.description}
                </p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
