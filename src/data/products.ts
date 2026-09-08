import { Product } from '../types/furniture';

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "kursi-kayu-01",
    name: "Kursi Kayu Minimalis (Chair)",
    tagline: "Kursi makan & santai kayu solid berdesain ergonomis dan estetis.",
    category: "living",
    basePrice: 1200000,
    description: "Kursi kayu solid pilihan dengan konstruksi kokoh dan sandaran ergonomis. Sangat cocok untuk meja makan maupun sudut baca keluarga.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Jati kualitas premium dengan keindahan serat kayu alami.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/chair.glb",
    modelType: "chair",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "10 - 14 Hari",
    length: { min: 40, max: 70, default: 50, step: 2 },
    width: { min: 40, max: 70, default: 50, step: 2 },
    height: { min: 70, max: 110, default: 90, step: 2 },
    recommendedDimensions: { length: 50, width: 50, height: 90 }
  },
  {
    id: "sofa-single-02",
    name: "Kursi Sofa Custom (Chair Sofa)",
    tagline: "Sofa santai dengan rangka kayu solid dan kenyamanan tinggi.",
    category: "living",
    basePrice: 2400000,
    description: "Kursi sofa santai berbahan rangka kayu solid dengan bantalan empuk dan desain modern untuk kenyamanan ruang tamu Anda.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Rangka kayu jati solid dipadu kain linen berkualitas.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/chairsofa.glb",
    modelType: "sofa",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "14 - 18 Hari",
    length: { min: 60, max: 120, default: 65, step: 5 },
    width: { min: 60, max: 110, default: 80, step: 5 },
    height: { min: 60, max: 100, default: 80, step: 5 },
    recommendedDimensions: { length: 65, width: 80, height: 80 }
  },
  {
    id: "dipan-tempat-tidur-03",
    name: "Dipan Tempat Tidur Jati (Bed Frame)",
    tagline: "Dipan kayu solid berkualitas tinggi untuk kenyamanan tidur maksimal.",
    category: "living",
    basePrice: 4500000,
    description: "Tempat tidur kayu jati solid dengan konstruksi sambungan kayu presisi yang sangat kuat, tidak berderit, dan tahan puluhan tahun.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Kayu jati solid kelas oven pilihan untuk stabilitas maksimal.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/dipan.glb",
    modelType: "bed",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "21 - 30 Hari",
    length: { min: 160, max: 240, default: 200, step: 5 },
    width: { min: 120, max: 220, default: 160, step: 5 },
    height: { min: 30, max: 120, default: 40, step: 5 },
    recommendedDimensions: { length: 200, width: 160, height: 40 }
  },
  {
    id: "lemari-pakaian-04",
    name: "Lemari Kayu Solid (Cabinet/Wardrobe)",
    tagline: "Kabinet penyimpanan & lemari baju serbaguna yang elegan.",
    category: "storage",
    basePrice: 3800000,
    description: "Lemari kayu solid dengan kapasitas luas, pintu kayu presisi, dan rak penyimpanan yang dapat disesuaikan kebutuhan ruangan Anda.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Konstruksi kayu jati tebal dengan daya tahan kelembapan sangat baik.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/lemari.glb",
    modelType: "cabinet",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "18 - 25 Hari",
    length: { min: 80, max: 220, default: 120, step: 5 },
    width: { min: 40, max: 70, default: 55, step: 5 },
    height: { min: 120, max: 240, default: 190, step: 5 },
    recommendedDimensions: { length: 120, width: 55, height: 190 }
  },
  {
    id: "meja-kecil-coffee-05",
    name: "Meja Kecil / Coffee Table",
    tagline: "Meja kopi & sudut minimalis yang menambah estetika ruang tamu.",
    category: "living",
    basePrice: 1500000,
    description: "Meja kecil serbaguna dengan permukaan kayu halus dan desain minimalis serbaguna sebagai meja sudut maupun meja samping sofa.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Kayu jati solid oven dengan warna alami serat kayu.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/mejakecil.glb",
    modelType: "coffee-table",
    image: "https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "10 - 14 Hari",
    length: { min: 50, max: 120, default: 80, step: 5 },
    width: { min: 40, max: 90, default: 55, step: 5 },
    height: { min: 35, max: 60, default: 45, step: 2 },
    recommendedDimensions: { length: 80, width: 55, height: 45 }
  },
  {
    id: "meja-tinggi-makan-06",
    name: "Meja Tinggi / Meja Makan Custom",
    tagline: "Meja makan & meja kerja tinggi berkonstruksi kokoh untuk keluarga.",
    category: "dining",
    basePrice: 3200000,
    description: "Meja makan kayu tinggi dengan papan kayu tebal presisi. Dirancang khusus untuk ruang makan keluarga maupun meja kerja profesional.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Papan kayu jati pilihan tebal yang kuat dan stabil.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/mejatinggi.glb",
    modelType: "dining-table",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "14 - 21 Hari",
    length: { min: 100, max: 260, default: 160, step: 5 },
    width: { min: 60, max: 120, default: 80, step: 5 },
    height: { min: 70, max: 100, default: 76, step: 2 },
    recommendedDimensions: { length: 160, width: 80, height: 76 }
  },
  {
    id: "rak-buku-pajangan-07",
    name: "Rak Pajangan Kayu (Shelving Unit)",
    tagline: "Rak penyimpanan & pajangan kayu bertingkat yang rapi.",
    category: "storage",
    basePrice: 2800000,
    description: "Rak kayu bertingkat serbaguna untuk menata buku, tanaman hias, dan koleksi aksesoris interior rumah.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Rangka dan ambalan kayu jati oven berdaya tahan tinggi.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/rak.glb",
    modelType: "bookshelf",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "14 - 20 Hari",
    length: { min: 60, max: 200, default: 100, step: 5 },
    width: { min: 30, max: 60, default: 40, step: 2 },
    height: { min: 100, max: 220, default: 160, step: 5 },
    recommendedDimensions: { length: 100, width: 40, height: 160 }
  },
  {
    id: "rak-modular-tingkat-08",
    name: "Rak Modular Tingkat (Open Bookshelf)",
    tagline: "Rak buku & sekat ruangan kayu bertingkat berkapasitas besar.",
    category: "storage",
    basePrice: 3100000,
    description: "Rak kayu bertingkat arsitektural yang cocok digunakan sebagai pemisah ruangan (room divider) maupun tempat penyimpanan utama.",
    material: "Kayu Jati Solid",
    materials: [
      { id: "teak", name: "Kayu Jati Solid", description: "Struktur kayu jati tebal yang kokoh dan seimbang.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/rak1.glb",
    modelType: "bookshelf",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "14 - 21 Hari",
    length: { min: 80, max: 240, default: 120, step: 5 },
    width: { min: 30, max: 65, default: 40, step: 2 },
    height: { min: 120, max: 240, default: 180, step: 5 },
    recommendedDimensions: { length: 120, width: 40, height: 180 }
  }
];

export function getProductById(id: string): Product | undefined {
  return STATIC_PRODUCTS.find(p => p.id === id);
}
