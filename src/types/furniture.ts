export interface ProductMaterial {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number; // e.g. 1.0 for Solid Teak, 1.15 for Solid Walnut
  image?: string;
}

export interface DimensionRange {
  min: number;
  max: number;
  default: number;
  step?: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'dining' | 'living' | 'storage' | 'workspace';
  basePrice: number;
  description: string;
  material: string; // Default or primary material display text
  materials: ProductMaterial[];
  finishing: string; // Locked to "Natural Wood Finish"
  model3D: string; // GLB path or procedural model type
  modelType: 'table' | 'dining-table' | 'coffee-table' | 'cabinet' | 'bookshelf' | 'tv-console' | 'chair' | 'sofa' | 'bed';

  image: string;
  gallery: string[];
  productionTime: string;
  length: DimensionRange; // in cm
  width: DimensionRange; // in cm
  height: DimensionRange; // in cm
  recommendedDimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export interface CustomizationState {
  productId: string;
  productName: string;
  length: number;
  width: number;
  height: number;
  selectedMaterial: string;
  finishing: string;
  additionalRequest: string;
  referenceImage?: string;
  customerName: string;
  whatsapp: string;
  email: string;
  address: string;
}

export type OrderStatus =
  | 'SUBMITTED'
  | 'DIPROSES'
  | 'PRODUKSI'
  | 'DIPRODUKSI'
  | 'FINISHING'
  | 'SIAP DIKIRIM'
  | 'DIKIRIM'
  | 'SELESAI'
  | 'DIBATALKAN'

  | 'DESIGN_CONFIRMATION'
  | 'MATERIAL_PREPARATION'
  | 'PRODUCTION'
  | 'QUALITY_CHECK'
  | 'READY_TO_SHIP'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REVISION_REQUIRED';


export interface OrderData {
  orderId: string;
  "Id-Pemesanan"?: string;
  date: string;
  customerName: string;
  whatsapp: string;
  email: string;
  address: string;
  productId: string;
  productName: string;
  length: number;
  width: number;
  height: number;
  material: string;
  finishing: string;
  additionalRequest: string;
  referenceImage: string;
  estimatedPrice: number;
  finalPrice?: number;
  status: OrderStatus;
  estimatedProductionTime: string;
  timelineDates?: {
    submitted?: string;
    design?: string;
    material?: string;
    production?: string;
    qc?: string;
    shipping?: string;
    completed?: string;
  };
}
