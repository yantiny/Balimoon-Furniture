import { Product } from '../types/furniture';

export interface PriceCalculationResult {
  basePrice: number;
  dimensionAdjustment: number;
  materialAdjustment: number;
  totalEstimatedPrice: number;
  formattedPrice: string;
}

/**
 * Calculates estimated furniture price based on customizable dimensions and selected material.
 */
export function calculateEstimatedPrice(
  product: Product,
  length: number,
  width: number,
  height: number,
  selectedMaterialId?: string
): PriceCalculationResult {
  const basePrice = product.basePrice;
  const defaultVol = product.length.default * product.width.default * product.height.default;
  const currentVol = Math.max(1, length * width * height);

  // Volume factor with a gentle curve so custom sizes remain affordable while accounting for timber volume
  const volRatio = currentVol / defaultVol;
  
  // Dimension adjustment scaling
  let dimensionAdjustment = 0;
  if (volRatio !== 1) {
    dimensionAdjustment = Math.round(basePrice * (volRatio - 1) * 0.48);
  }

  const subtotalBeforeMaterial = basePrice + dimensionAdjustment;

  // Material factor
  const matchedMaterial = product.materials.find(m => m.id === selectedMaterialId);
  const materialMultiplier = matchedMaterial ? matchedMaterial.priceMultiplier : 1.0;
  
  const materialAdjustment = Math.round(subtotalBeforeMaterial * (materialMultiplier - 1.0));

  const totalEstimatedPrice = Math.max(1000000, subtotalBeforeMaterial + materialAdjustment);

  return {
    basePrice,
    dimensionAdjustment,
    materialAdjustment,
    totalEstimatedPrice,
    formattedPrice: formatIDR(totalEstimatedPrice)
  };
}

/**
 * Formats a numeric value into Indonesian Rupiah string (e.g., 2500000 -> "Rp 2.500.000")
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
