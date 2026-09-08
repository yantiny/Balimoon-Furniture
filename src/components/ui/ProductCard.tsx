import React from 'react';
import Link from 'next/link';
import { Product } from '../../types/furniture';
import { formatIDR } from '../../utils/pricing';
import { FurnitureCanvas } from '../3d/FurnitureCanvas';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const CATEGORY_LABELS: Record<string, string> = {
  workspace: 'Ruang Kerja',
  dining: 'Ruang Makan',
  living: 'Ruang Tamu',
  storage: 'Penyimpanan'
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl border border-warm-border/70 overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col h-full">
      {/* 3D Model Interactive Viewport Container */}
      <div className="relative h-64 w-full overflow-hidden bg-cream-200">
        <FurnitureCanvas
          modelType={product.modelType}
          modelUrl={product.model3D}
          length={product.length.default}
          width={product.width.default}
          height={product.height.default}
          defaultLength={product.length.default}
          defaultWidth={product.width.default}
          defaultHeight={product.height.default}
          showDimensions={false}
          hideUIControls={true}
        />

        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-charcoal-900 shadow-sm border border-warm-border/50 uppercase tracking-wider">
          {CATEGORY_LABELS[product.category] || product.category}
        </div>
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-charcoal-900 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-charcoal-900" />
          <span>Model 3D GLB</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-charcoal-900 group-hover:text-wood transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-warm-gray mt-1 line-clamp-2 leading-relaxed">
            {product.tagline || product.description}
          </p>

          {/* Quick Specs Pill Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-cream-200 text-charcoal-700 rounded-md font-mono text-[11px]">
              P: {product.length.min}-{product.length.max}cm
            </span>
            <span className="px-2.5 py-1 bg-cream-200 text-charcoal-700 rounded-md font-mono text-[11px]">
              L: {product.width.min}-{product.width.max}cm
            </span>
            <span className="px-2.5 py-1 bg-cream-200 text-charcoal-700 rounded-md font-mono text-[11px]">
              T: {product.height.min}-{product.height.max}cm
            </span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-4 border-t border-warm-border/50 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-warm-gray font-medium uppercase tracking-wider">Harga Mulai</span>
            <span className="text-lg font-bold text-wood-dark font-serif">
              {formatIDR(product.basePrice)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/furniture/${product.id}`}
              className="w-full px-3 py-2.5 rounded-xl border border-warm-border hover:border-charcoal-900 text-charcoal-800 text-center text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Detail Specs</span>
            </Link>

            <Link
              href={`/customize/${product.id}`}
              className="w-full px-3 py-2.5 rounded-xl bg-charcoal-900 hover:bg-wood text-white text-center text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Custom 3D</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
