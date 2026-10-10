export interface ProductMaterial {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
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
  material: string;
  materials: ProductMaterial[];
  finishing: string;
  model3D: string;
  modelType: 'table' | 'dining-table' | 'coffee-table' | 'cabinet' | 'bookshelf' | 'tv-console' | 'chair' | 'sofa' | 'bed';
  image: string;
  gallery: string[];
  productionTime: string;
  scale3D?: number;
  length: DimensionRange;
  width: DimensionRange;
  height: DimensionRange;
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
  | 'FINISHING'
  | 'SIAP DIKIRIM'
  | 'DIKIRIM'
  | 'SELESAI'
  | 'DIBATALKAN';

export interface StatusHistoryItem {
  id?: string;
  pesanan_id?: string;
  status_lama?: OrderStatus | string | null;
  status_baru: OrderStatus | string;
  catatan?: string | null;
  dibuat_oleh?: string;
  created_at: string;
}

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
  referenceImage?: string;
  estimatedPrice: number;
  finalPrice?: number | null;
  status: OrderStatus;
  estimatedProductionTime: string;
  statusHistory?: StatusHistoryItem[];
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

export interface AdminStatsSummary {
  totalOrders: number;
  submittedOrders: number;
  inProductionOrders: number;
  completedOrders: number;
}
